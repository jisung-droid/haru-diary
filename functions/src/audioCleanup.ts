import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

// Runs daily at 2:00 AM UTC
export const audioCleanup = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const db = admin.firestore();
    const storage = admin.storage().bucket();

    // Find entries with expired audio
    const snapshot = await db
      .collection('diaryEntries')
      .where('audioExpiresAt', '<=', now)
      .where('audioUrl', '!=', null)
      .get();

    if (snapshot.empty) {
      console.log('No expired audio files found');
      return null;
    }

    const batch = db.batch();
    const deletePromises: Promise<void>[] = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      // Delete audio file from Storage
      if (data.audioPath) {
        deletePromises.push(
          storage
            .file(data.audioPath)
            .delete()
            .then(() => {
              console.log(`Deleted audio: ${data.audioPath}`);
            })
            .catch((err) => {
              console.error(`Failed to delete ${data.audioPath}:`, err);
            })
        );
      }

      // Clear audio fields in Firestore
      batch.update(doc.ref, {
        audioUrl: null,
        audioPath: null,
        updatedAt: admin.firestore.Timestamp.now(),
      });
    });

    await Promise.all([batch.commit(), ...deletePromises]);
    console.log(`Cleaned up ${snapshot.size} expired audio entries`);
    return null;
  });

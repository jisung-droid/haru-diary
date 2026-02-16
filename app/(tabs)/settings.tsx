import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/hooks/useAuth';
import { useStatistics } from '../../src/hooks/useStatistics';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { PlantGrowth } from '../../src/components/statistics/PlantGrowth';
import { StatsOverview } from '../../src/components/statistics/StatsOverview';
import { MoodChart } from '../../src/components/statistics/MoodChart';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { stats, loading: statsLoading } = useStatistics();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          {user?.displayName && (
            <Text style={styles.userName}>{user.displayName}</Text>
          )}
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        {statsLoading ? (
          <LoadingSpinner />
        ) : stats ? (
          <>
            <PlantGrowth plantStage={stats.plantStage} currentStreak={stats.currentStreak} />
            <StatsOverview
              totalEntries={stats.totalEntries}
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
            />
            <MoodChart moodDistribution={stats.moodDistribution} />
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.emptyStats}>Start writing to see your statistics!</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  signOutButton: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStats: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  aboutValue: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/hooks/useAuth';
import { LoginButton } from '../../src/components/auth/LoginButton';

export default function LoginScreen() {
  const { loginWithGoogle, loginWithNaver, signingIn, error } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>📔</Text>
        <Text style={styles.title}>Haru Diary</Text>
        <Text style={styles.subtitle}>Record your precious moments every day</Text>
      </View>

      <View style={styles.buttons}>
        <LoginButton
          label="Continue with Google"
          onPress={loginWithGoogle}
          disabled={signingIn}
          variant="google"
        />
        <LoginButton
          label="Continue with Naver"
          onPress={loginWithNaver}
          disabled={signingIn}
          variant="naver"
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

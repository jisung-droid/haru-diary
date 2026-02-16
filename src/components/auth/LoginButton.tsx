import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';

interface LoginButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant: 'google' | 'naver';
}

const VARIANT_COLORS = {
  google: { bg: '#FFFFFF', text: '#333333', border: '#DADCE0' },
  naver: { bg: '#03C75A', text: '#FFFFFF', border: '#03C75A' },
};

export function LoginButton({ label, onPress, disabled, variant }: LoginButtonProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.bg, borderColor: colors.border },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {disabled ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

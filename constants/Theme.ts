import { Platform, StyleSheet } from 'react-native';
import Colors from './Colors';

export const theme = {
  colors: Colors.light,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    round: 9999,
  },
  typography: {
    h1: {
      fontFamily: 'Poppins-Bold',
      fontSize: 32,
      lineHeight: 38,
    },
    h2: {
      fontFamily: 'Poppins-Bold',
      fontSize: 28,
      lineHeight: 34,
    },
    h3: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 24,
      lineHeight: 30,
    },
    h4: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: 20,
      lineHeight: 26,
    },
    subtitle1: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      lineHeight: 24,
    },
    subtitle2: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      lineHeight: 22,
    },
    body1: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 24,
    },
    body2: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 21,
    },
    button: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      lineHeight: 18,
    },
  },
  shadows: {
    small: Platform.select({
      ios: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
    medium: Platform.select({
      ios: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
    large: Platform.select({
      ios: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: Colors.light.grey[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    ...theme.shadows.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.grey[300],
    borderRadius: theme.borderRadius.s,
    padding: theme.spacing.m,
    fontSize: 16,
    color: theme.colors.text,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary[500],
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    color: theme.colors.primary[500],
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  textCenter: {
    textAlign: 'center',
  },
  error: {
    color: theme.colors.error[500],
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
});
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { theme } from '@/constants/Theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.grey[300];
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary[500];
      case 'secondary':
        return theme.colors.secondary[500];
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return theme.colors.primary[500];
    }
  };
  
  const getTextColor = () => {
    if (disabled) return theme.colors.grey[500];
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return 'white';
      case 'outline':
        return theme.colors.primary[500];
      case 'text':
        return theme.colors.primary[500];
      default:
        return 'white';
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return theme.colors.grey[300];
    
    switch (variant) {
      case 'outline':
        return theme.colors.primary[500];
      default:
        return 'transparent';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.s,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.s,
          paddingHorizontal: theme.spacing.m,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.m,
          paddingHorizontal: theme.spacing.l,
        };
      default:
        return {
          paddingVertical: theme.spacing.s,
          paddingHorizontal: theme.spacing.m,
        };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'medium':
        return 16;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const buttonStyles = {
    backgroundColor: getBackgroundColor(),
    borderColor: getBorderColor(),
    borderWidth: variant === 'outline' ? 1 : 0,
    borderRadius: theme.borderRadius.m,
    ...getPadding(),
  };

  const iconSpacing = {
    marginRight: iconPosition === 'left' ? theme.spacing.s : 0,
    marginLeft: iconPosition === 'right' ? theme.spacing.s : 0,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyles, styles.button, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={iconSpacing}>{icon}</View>
          )}
          
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontFamily: 'Inter-SemiBold',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          
          {icon && iconPosition === 'right' && (
            <View style={iconSpacing}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
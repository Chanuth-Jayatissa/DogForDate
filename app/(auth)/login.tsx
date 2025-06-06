import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation will be handled by the auth state change in _layout.tsx
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/39317/chihuahua-dog-puppy-cute-39317.jpeg' }} 
            style={styles.logoImage} 
          />
          <Text style={styles.logoText}>Dog for Date</Text>
          <Text style={styles.tagline}>Find your perfect companion</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          
          <View style={globalStyles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={globalStyles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading}
            style={styles.loginButton}
          />
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logoText: {
    ...theme.typography.h2,
    color: theme.colors.primary[500],
    marginTop: theme.spacing.s,
  },
  tagline: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  label: {
    ...theme.typography.body2,
    marginBottom: theme.spacing.xs,
    color: theme.colors.grey[700],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.l,
  },
  forgotPasswordText: {
    ...theme.typography.body2,
    color: theme.colors.primary[600],
  },
  loginButton: {
    marginBottom: theme.spacing.l,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  signupLink: {
    ...theme.typography.body2,
    color: theme.colors.primary[500],
    fontFamily: 'Inter-SemiBold',
  },
});
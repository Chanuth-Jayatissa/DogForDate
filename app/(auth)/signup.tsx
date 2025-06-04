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
  ScrollView
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const handleSignup = () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      // Navigate to role selection
      router.push('/role-select');
    }, 1500);
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
          <Text style={styles.title}>Create Account</Text>
          
          {error ? <Text style={globalStyles.error}>{error}</Text> : null}
          
          <View style={globalStyles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>
          
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
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          
          <View style={globalStyles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          
          <Button 
            title="Sign Up" 
            onPress={handleSignup} 
            loading={loading}
            style={styles.signupButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
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
  signupButton: {
    marginBottom: theme.spacing.l,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  loginLink: {
    ...theme.typography.body2,
    color: theme.colors.primary[500],
    fontFamily: 'Inter-SemiBold',
  },
});
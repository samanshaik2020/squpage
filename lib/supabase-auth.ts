import { supabase, Profile } from './supabase'
import { Provider } from '@supabase/supabase-js'

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, username: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName }
      }
    })
    
    if (error) throw error
    
    // Create profile using server-side API to bypass RLS
    if (data.user) {
      try {
        // Use fetch to call a server API endpoint instead of direct client
        const response = await fetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: data.user.id,
            username,
            full_name: fullName
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create profile');
        }
      } catch (profileError: any) {
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }
    }
    
    return data
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    return data
  },

  // Sign in with GitHub
  async signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user with profile
  async getCurrentUser() {
    try {
      // Get current session first to ensure we have valid auth
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (!sessionData.session) {
        console.log('No active session found')
        return null
      }
      
      // Get user data
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user or no user found:', userError)
        return null
      }
      
      console.log('User found:', user.id, user.email)
      
      // Get profile data - using a more direct approach without try/catch to avoid issues
      let profile = null;
      try {
        // First check if the profile exists without using single() which throws errors
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);
        
        if (!profilesError && profiles && profiles.length > 0) {
          profile = profiles[0];
          console.log('Profile found:', profile);
        } else {
          console.log('No profile found or error:', profilesError || 'No profile data');
        }
      } catch (err) {
        // Catch any unexpected errors but don't let them fail the auth flow
        console.log('Unexpected error fetching profile, continuing with null profile');
      }
      
      // Always return user data, with profile if we have it
      return { user, profile }
    } catch (error) {
      console.error('Unexpected error in getCurrentUser:', error)
      return null
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user logged in')
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    if (error) throw error
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

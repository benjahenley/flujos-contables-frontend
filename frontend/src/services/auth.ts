import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
  isVerifiedCustomer: boolean;
  isSuperAdmin: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

class AuthService {
  // Sign up with Supabase Auth
  async signUp(
    data: SignUpData
  ): Promise<{ message: string; user: Partial<AuthUser> }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            isVerifiedCustomer: false,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        message:
          "Registration successful! Please check your email to verify your account.",
        user: {
          id: authData.user?.id,
          email: authData.user?.email!,
          name: data.name,
          isVerified: false,
          isVerifiedCustomer: false,
        },
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Sign up failed"
      );
    }
  }

  // Sign in with Supabase Auth
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: AuthUser; access_token: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Sign in failed");
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        throw new Error("Please verify your email first");
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        isVerified: !!data.user.email_confirmed_at,
        isVerifiedCustomer:
          data.user.user_metadata?.isVerifiedCustomer || false,
        isSuperAdmin: data.user.app_metadata?.is_super_admin || false,
      };

      return {
        user,
        access_token: data.session?.access_token || "",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Sign in failed"
      );
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        isVerified: !!user.email_confirmed_at,
        isVerifiedCustomer: user.user_metadata?.isVerifiedCustomer || false,
        isSuperAdmin: user.app_metadata?.is_super_admin || false,
      };
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("🔍 CheckAuth - Session:", !!session);

      if (!session) {
        console.log("❌ CheckAuth - No session found");
        return false;
      }

      // Double-check with user data
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(
        "🔍 CheckAuth - User:",
        !!user,
        "Email confirmed:",
        !!user?.email_confirmed_at
      );

      const isAuthenticated = !!(user && user.email_confirmed_at);
      console.log("✅ CheckAuth - Final result:", isAuthenticated);

      return isAuthenticated;
    } catch (error) {
      console.error("❌ Auth check error:", error);
      return false;
    }
  }

  // Resend confirmation email
  async resendConfirmation(email: string): Promise<{ message: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: "Confirmation email sent successfully" };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to resend confirmation"
      );
    }
  }

  // Get session token for backend API calls
  async getToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          isVerified: !!session.user.email_confirmed_at,
          isVerifiedCustomer:
            session.user.user_metadata?.isVerifiedCustomer || false,
          isSuperAdmin: session.user.app_metadata?.is_super_admin || false,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Call backend API to upgrade to customer (for payment integration)
  async upgradeToCustomer(): Promise<{ message: string }> {
    try {
      console.log("🚀 Starting upgrade to customer...");

      const token = await this.getToken();
      if (!token) {
        console.error("❌ No token found for upgrade");
        throw new Error("Not authenticated");
      }

      console.log("🔑 Got token for upgrade, making API call...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/upgrade-to-customer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ API Error:", error);
        throw new Error(error.message || "Upgrade failed");
      }

      const result = await response.json();
      console.log("✅ Upgrade successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Full upgrade error:", error);
      throw new Error(
        error instanceof Error ? error.message : "Upgrade failed"
      );
    }
  }
}

export const authService = new AuthService();

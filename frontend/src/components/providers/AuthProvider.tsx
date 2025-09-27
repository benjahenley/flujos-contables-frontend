"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService, type AuthUser } from "@/services/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Define which routes are public (don't require auth)
const PUBLIC_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/", // Landing page (if you want it public)
];

// Define which routes require specific permissions
const PREMIUM_ROUTES = [
  "/afip",
  "/afip/configure",
  "/afip/invoices",
  "/dashboard/premium",
];

const ADMIN_ROUTES = [
  "/admin",
  "/admin/users",
  "/admin/settings",
  "/admin/analytics",
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isPremiumRoute = PREMIUM_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      return currentUser;
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Main auth check and routing logic
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      console.log("🔍 Route Guard - Checking route:", pathname);

      try {
        const currentUser = await refreshUser();

        // If it's a public route, allow access
        if (isPublicRoute) {
          console.log("✅ Route Guard - Public route, allowing access");
          setIsLoading(false);
          return;
        }

        // If no user and not public route, redirect to sign in
        if (!currentUser) {
          console.log("❌ Route Guard - No user, redirecting to sign-in");
          router.push("/auth/sign-in");
          setIsLoading(false);
          return;
        }

        // If user not verified, redirect to verify email
        if (!currentUser.isVerified) {
          console.log("⚠️ Route Guard - Email not verified");
          // You could redirect to a "verify email" page here
          // router.push('/auth/verify-email');
          setIsLoading(false);
          return;
        }

        // Check premium route access
        if (isPremiumRoute && !currentUser.isVerifiedCustomer) {
          console.log(
            "💎 Route Guard - Premium required, redirecting to upgrade"
          );
          router.push("/dashboard?upgrade=required");
          setIsLoading(false);
          return;
        }

        // Check admin route access
        if (isAdminRoute && !currentUser.isSuperAdmin) {
          console.log("🛡️ Route Guard - Admin required, access denied");
          router.push("/dashboard?error=access-denied");
          setIsLoading(false);
          return;
        }

        // All checks passed
        console.log("✅ Route Guard - All checks passed, allowing access");
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Route Guard - Auth check failed:", error);
        router.push("/auth/sign-in");
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [pathname]);

  // Listen to auth state changes from Supabase
  useEffect(() => {
    console.log("🔄 Route Guard - Setting up auth listener");

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (user) => {
      console.log("🔄 Route Guard - Auth state changed:", !!user);

      if (!user) {
        setUser(null);
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          router.push("/auth/sign-in");
        }
      } else {
        await refreshUser();
      }
    });

    return () => {
      console.log("🔄 Route Guard - Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [router, isPublicRoute]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Redirecting to sign in...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Component for requiring specific permissions
interface RequirePermissionProps {
  children: ReactNode;
  requirePremium?: boolean;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function RequirePermission({
  children,
  requirePremium = false,
  requireAdmin = false,
  fallback,
}: RequirePermissionProps) {
  const { user } = useAuth();

  if (requireAdmin && !user?.isSuperAdmin) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">
            This feature requires admin permissions.
          </p>
        </div>
      )
    );
  }

  if (requirePremium && !user?.isVerifiedCustomer) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-orange-600">
            Premium Required
          </h2>
          <p className="text-gray-600">
            This feature requires a premium subscription.
          </p>
          <button className="mt-4 bg-primary text-white px-4 py-2 rounded">
            Upgrade to Premium
          </button>
        </div>
      )
    );
  }

  return <>{children}</>;
}

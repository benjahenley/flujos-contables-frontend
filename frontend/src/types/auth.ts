// Subscription tiers matching backend
export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  BUSINESS = 'BUSINESS',
}

// Subscription status
export enum SubscriptionStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
}

// Environment types
export enum Environment {
  DEV = 'DEV',
  PROD = 'PROD',
}

// Auth user interface
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
  isVerifiedCustomer: boolean;
  isSuperAdmin: boolean;
  subscriptionTier?: SubscriptionTier;
  subscriptionStatus?: SubscriptionStatus;
  currentEnvironment?: Environment;
  localUserId?: number;
}

// Subscription limits
export interface SubscriptionLimits {
  tier: SubscriptionTier;
  maxInvoicesPerMonth: number | null;
  allowProductionAccess: boolean;
  features: string[];
}

// Subscription info response
export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentEnvironment: Environment;
  limits: SubscriptionLimits;
  features: string[];
}

// Usage statistics
export interface UsageStats {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  usage: {
    dev: {
      current: number;
      limit: number | 'unlimited';
      remaining: number | 'unlimited';
    };
    prod: {
      current: number;
      limit: number | 'unlimited' | 'not_allowed';
      remaining: number | 'unlimited' | 'not_allowed';
    };
  };
}

// Usage check response
export interface UsageCheck {
  allowed: boolean;
  reason?: string;
  usage?: {
    current: number;
    limit: number | 'unlimited';
    remaining: number | 'unlimited';
    percentageUsed: number;
  };
}

// Subscription history entry
export interface SubscriptionHistoryEntry {
  id: string;
  previousTier?: SubscriptionTier;
  newTier: SubscriptionTier;
  previousStatus?: SubscriptionStatus;
  newStatus: SubscriptionStatus;
  reason?: string;
  createdAt: string;
}

// DTOs
export interface UpdateSubscriptionDto {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  reason?: string;
}

export interface SwitchEnvironmentDto {
  environment: Environment;
}

// Subscription tier configuration (client-side reference)
export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  {
    name: string;
    price: number;
    currency: string;
    description: string;
    maxInvoices: number | null;
    features: string[];
    recommended?: boolean;
  }
> = {
  [SubscriptionTier.FREE]: {
    name: 'Free',
    price: 0,
    currency: 'ARS',
    description: 'Perfect for testing',
    maxInvoices: 5,
    features: [
      '5 invoices per month',
      'TEST environment only',
      'Basic invoice generation',
      'Community support',
    ],
  },
  [SubscriptionTier.STARTER]: {
    name: 'Starter',
    price: 15000,
    currency: 'ARS',
    description: 'For small businesses',
    maxInvoices: 50,
    recommended: true,
    features: [
      '50 invoices per month',
      'Production environment access',
      'Excel upload',
      'Email support',
    ],
  },
  [SubscriptionTier.PROFESSIONAL]: {
    name: 'Professional',
    price: 35000,
    currency: 'ARS',
    description: 'For growing companies',
    maxInvoices: 200,
    features: [
      '200 invoices per month',
      'Production environment access',
      'Batch processing',
      'Email notifications',
      'Priority support',
    ],
  },
  [SubscriptionTier.BUSINESS]: {
    name: 'Business',
    price: 75000,
    currency: 'ARS',
    description: 'For large operations',
    maxInvoices: null,
    features: [
      'Unlimited invoices',
      'Production environment access',
      'AI invoice scanning',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
};

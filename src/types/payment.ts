export interface PaymentStatus {
    id: string;
    status: string;
    paid: boolean;
}

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';

export interface PaymentMethod {
    id: string;
    type: string;
    saved: boolean;
    status?: string;
    title?: string;
    card?: {
        first6: string;
        last4: string;
        expiry_year: string;
        expiry_month: string;
        card_type: string;
        issuer_country?: string;
    };
    addedAt?: string;
}

export interface Payment {
    _id: string;
    amount: number;
    currency: string;
    status: SubscriptionStatus;
    paid: boolean;
    plan?: SubscriptionPlan;
    description?: string;
    createdAt: string;
    paymentMethod?: PaymentMethod;
}

export interface PaymentCreation {
    plan: SubscriptionPlan;
}

export interface PaymentResponse {
    idempotenceKey: string;
    id: string;
    status: string;
    confirmation_url: string;
}

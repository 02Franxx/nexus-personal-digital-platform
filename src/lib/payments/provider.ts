import 'server-only';

export type CheckoutRequest = {
  orderId: string;
  totalCents: number;
  currency: string;
};

export type CheckoutSession = {
  provider: string;
  checkoutUrl: string;
  externalId: string;
};

export interface PaymentProvider {
  createCheckout(input: CheckoutRequest): Promise<CheckoutSession>;
}

export function getPaymentProvider(): PaymentProvider {
  throw new Error('No payment provider configured. Add a provider adapter before enabling checkout.');
}

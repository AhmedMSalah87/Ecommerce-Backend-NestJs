import Stripe from 'stripe';
import { StripeService } from './providers/stripe/stripe.service';
import { CheckoutItem } from '../../types/checkoutItem.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(private readonly provider: StripeService) {}

  async payOnline(
    lineItems: CheckoutItem[],
    metadata: Record<string, string>,
    customerEmail: string,
  ): Promise<Stripe.Checkout.Session> {
    return this.provider.createCheckoutSession(
      lineItems,
      metadata,
      customerEmail,
    );
  }
}

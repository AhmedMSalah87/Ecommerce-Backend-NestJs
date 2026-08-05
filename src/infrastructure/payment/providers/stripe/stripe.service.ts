import Stripe, { MetadataParam } from 'stripe';
import { CheckoutItem } from '../../../../types/checkoutItem.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createCheckoutSession(
    items: CheckoutItem[],
    metadata: MetadataParam,
    customerEmail: string,
  ): Promise<Stripe.Checkout.Session> {
    const lineItems = items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'egp',
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
        },
      },
    }));
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      currency: 'egp',
      success_url: '',
      cancel_url: '',
      payment_method_types: ['card'],
      customer_email: customerEmail,
      metadata,
    });
  }
}

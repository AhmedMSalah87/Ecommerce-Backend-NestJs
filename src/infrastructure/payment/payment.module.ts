import { Module } from '@nestjs/common';
import { StripeService } from './providers/stripe/stripe.service';
import { PaymentService } from './payment.service';

@Module({
  providers: [StripeService, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

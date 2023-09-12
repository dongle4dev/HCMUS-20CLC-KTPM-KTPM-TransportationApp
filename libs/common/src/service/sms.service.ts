import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio.Twilio;

  constructor() {
    // Initialize Twilio client with your Twilio Account SID and Auth Token
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendOTP(phone: string, otp: number): Promise<void> {
    try {
      //   Send OTP via SMS using Twilio
      await this.twilioClient.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      throw new Error('Error sending OTP via SMS');
    }
  }
}

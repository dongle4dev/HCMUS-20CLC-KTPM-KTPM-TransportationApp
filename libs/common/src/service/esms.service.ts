import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EsmsService {
  private readonly baseUrl = 'http://rest.esms.vn/MainService.svc/json';
  //env file
  private readonly username = 'your_username';
  private readonly password = 'your_password';
  private readonly apiKey = 'your_api_key';

  async sendSMS(phone: string, content: string) {
    const body = {
      UserName: this.username,
      Password: this.password,
      Phone: phone,
      Content: content,
      ApiKey: this.apiKey,
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/SendMultipleMessage_V4`,
        body,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }
}

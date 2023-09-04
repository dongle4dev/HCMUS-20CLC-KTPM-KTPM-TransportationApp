import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UpdateStatusHotlineDto,
  CreateTripDto,
  LoginHotlineDto,
  SignUpHotlineDto,
  UpdateHotlineDto,
  UpdateTripLocationDto,
} from 'y/common';
import { UserInfo } from 'y/common/auth/user.decorator';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { CreateHotlineDto } from 'y/common/dto/admin/create.hotline.dto';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { HotlinesService } from './hotlines.service';

@Injectable()
export class HotlinesServiceFacade {
  constructor(
    private readonly hotlinesService: HotlinesService,
    private jwtService: JwtService,
  ) {}

  async createOTPFacade(phoneNumber: string) {
    const { otp, phone } = await this.hotlinesService.createOTP(phoneNumber);
    const OTP_token = this.jwtService.sign({ otp, phone });
    return { OTP_token };
  }
  async signUpFacade(
    signUpHotlineDto: SignUpHotlineDto,
  ): Promise<{ token: string }> {
    const OTP_verify = this.jwtService.verify(signUpHotlineDto.OTP_token);
    if (OTP_verify.otp === signUpHotlineDto.otp) {
      if (OTP_verify.phone !== signUpHotlineDto.phone) {
        throw new BadRequestException('Incorrect phone number');
      }
      const hotline = await this.hotlinesService.signUp(signUpHotlineDto);
      const token = this.jwtService.sign({
        hotline,
      });

      return { token };
    } else {
      throw new BadRequestException('Invalid OTP');
    }
  }

  async loginFacade(
    loginHotlineDto: LoginHotlineDto,
  ): Promise<{ token: string }> {
    const hotline = await this.hotlinesService.login(loginHotlineDto);

    const token = this.jwtService.sign({
      hotline,
    });

    return { token };
  }

  async getInformationFacade(id: string) {
    return this.hotlinesService.getInformation(id);
  }

  async updateAccountFacade(
    updateHotlineDto: UpdateHotlineDto,
    id: string,
  ): Promise<Hotline> {
    return this.hotlinesService.updateAccount(updateHotlineDto, id);
  }

  async deleteAccountFacade(id: string): Promise<{ msg: string }> {
    return this.hotlinesService.deleteAccount(id);
  }
  async getAllFacade(): Promise<Hotline[]> {
    return this.hotlinesService.getAll();
  }

  async deleteAllFacade(): Promise<{ msg: string }> {
    return this.hotlinesService.deleteAll();
  }

  //CRUD Hotline
  async getHotlinesFacade(): Promise<Hotline[]> {
    return this.hotlinesService.getHotlines();
  }

  async getNumberHotlinesFacade() {
    return this.hotlinesService.getNumberHotlines();
  }

  // Mở hoặc khoá tài khoản
  async updateStatusBlockingHotlineFacade(
    updateStatusHotlineDto: UpdateStatusHotlineDto,
  ): Promise<Hotline> {
    return this.hotlinesService.updateStatusBlockingHotline(
      updateStatusHotlineDto,
    );
  }

  async deleteHotlineFacade(hotlineID: string) {
    return this.hotlinesService.deleteHotline(hotlineID);
  }

  async createHotlineFacade(
    createHotlineDto: CreateHotlineDto,
  ): Promise<Hotline> {
    return this.hotlinesService.createHotline(createHotlineDto);
  }

  // async demandOrderFacade(customerPositionDto: CustomerPositionDto) {
  //   return this.hotlinesService.demandOrder(customerPositionDto);
  // }
}

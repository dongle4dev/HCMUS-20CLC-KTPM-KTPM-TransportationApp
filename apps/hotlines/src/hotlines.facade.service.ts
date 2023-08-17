import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateHotlineDto } from 'apps/admins/src/dto/create.hotline.dto';
import { UpdateStatusHotlineDto } from 'apps/admins/src/dto/updateStatus.hotline.dto';
import { UserInfo } from 'y/common/auth/user.decorator';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { CustomerPositionDto } from 'y/common/dto/customer-location.dto';
import { LoginHotlineDto } from './dto/login.hotline.dto';
import { SignUpHotlineDto } from './dto/signup.hotline.dto';
import { UpdateHotlineDto } from './dto/update.hotline.dto';
import { HotlinesService } from './hotlines.service';

@Injectable()
export class HotlinesServiceFacade {
  constructor(
    private readonly hotlinesService: HotlinesService,
    private jwtService: JwtService,
  ) {}

  async signUpFacade(
    signUpHotlineDto: SignUpHotlineDto,
  ): Promise<{ token: string }> {
    const driver = await this.hotlinesService.signUp(signUpHotlineDto);

    const token = this.jwtService.sign({
      id: driver._id,
      role: driver.role,
    });

    return { token };
  }

  async loginFacade(
    loginHotlineDto: LoginHotlineDto,
  ): Promise<{ token: string }> {
    const driver = await this.hotlinesService.login(loginHotlineDto);

    const token = this.jwtService.sign({
      id: driver._id,
      role: driver.role,
    });

    return { token };
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

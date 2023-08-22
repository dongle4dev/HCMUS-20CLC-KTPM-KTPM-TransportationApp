import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateStatusHotlineDto, CreateTripDto, LoginHotlineDto, 
         SignUpHotlineDto, UpdateHotlineDto, UpdateTripDto, UpdateTripLocationDto } from 'y/common';
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
  ) { }
  
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

  // async demandOrderFacade(customerPositionDto: CustomerPositionDto) {
  //   return this.hotlinesService.demandOrder(customerPositionDto);
  // }
}

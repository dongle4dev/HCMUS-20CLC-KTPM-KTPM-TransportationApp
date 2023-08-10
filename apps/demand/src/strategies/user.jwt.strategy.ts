import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { Customer } from 'y/common/database/customer/schema/customer.schema';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';
import { Driver } from 'y/common/database/driver/schema/driver.schema';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Hotline.name) private hotlineModel: Model<Hotline>,
    @InjectModel(Driver.name) private driverModel: Model<Driver>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id, role } = payload;
    let user: any;
    if (role === 'Admin') {
      user = await this.adminModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else if (role === 'Driver') {
      user = await this.driverModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else if (role === 'Customer') {
      user = await this.customerModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else if (role === 'Hotline') {
      user = await this.hotlineModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'y/common/database/admin/schema/admin.schema';
import { Customer } from 'y/common/database/customer/schema/customer.schema';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
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
      user = this.adminModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else if (role === 'Customer') {
      user = this.customerModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else if (role === 'Driver') {
      return;
    } else if (role === 'Hotline') {
      return;
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

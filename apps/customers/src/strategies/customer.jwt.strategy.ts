import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from '../schema/customer.schema';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
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
    if (role === 'Customer') {
      user = this.customerModel.findById({ _id: id });

      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

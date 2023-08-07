import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver } from 'y/common/database/driver/schema/driver.schema';

@Injectable()
export class DriverJwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Driver.name) private driverModel: Model<Driver>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id, role } = payload;
    let user: any;
    if (role === 'Driver') {
      user = await this.driverModel.findById({ _id: id });
      if (user.blocked) {
        throw new UnauthorizedException('User has been blocked');
      }
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

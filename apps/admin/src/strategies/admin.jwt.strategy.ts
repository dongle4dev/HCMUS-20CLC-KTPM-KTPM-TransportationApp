import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../schema/admin.schema';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {
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
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

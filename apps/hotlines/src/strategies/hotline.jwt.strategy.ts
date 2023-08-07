import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotline } from 'y/common/database/hotline/schema/hotline.schema';

@Injectable()
export class HotlineJwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(Hotline.name) private hotlineModel: Model<Hotline>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    const { id, role } = payload;
    let user: any;
    if (role === 'Hotline') {
      user = await this.hotlineModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('Login first to access this endpoint.');
      }
      if (user.blocked) {
        throw new UnauthorizedException('User has been blocked');
      }
      return user;
    } else {
      throw new UnauthorizedException('Invalid User');
    }
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, encodePassword } from 'utils/bcrypt';
import { LoginAdminDto } from './dto/login.admin.dto';
import { SignUpAdminDto } from './dto/signup.admin.dto';
import { Admin } from './schema/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpAdminDto: SignUpAdminDto): Promise<{ token: string }> {
    const { password } = signUpAdminDto;

    const hashedPassword = await encodePassword(password);
    try {
      const admin = await this.adminModel.create({
        ...signUpAdminDto,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: admin._id, role: admin.role });

      return { token };
    } catch (e) {
      if (e.code === 11000) {
        throw new BadRequestException('Duplicated Prop');
      }
      throw new BadRequestException('Please enter valid information');
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ token: string }> {
    const { email, password } = loginAdminDto;

    const admin = await this.adminModel.findOne({ email });

    if (!admin) {
      throw new UnauthorizedException('Invalid credential');
    }
    const isPasswordMatched = await comparePassword(password, admin.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Incorrect Password');
    }
    const token = this.jwtService.sign({
      id: admin._id,
      role: admin.role,
    });

    return { token };
  }
  async getAll(): Promise<Admin[]> {
    const admins = this.adminModel.find().exec();
    console.log(typeof admins);
    console.log(admins);
    return admins;
  }
}

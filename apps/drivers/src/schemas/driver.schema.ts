import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "y/common";

@Schema({ versionKey: false}) 
export class Driver extends AbstractDocument {
    @Prop()
    username: string;

    @Prop()
    fullname: string;
  
    @Prop({ unique: [true, 'Duplicate phone number entered'] })
    phone: string;
  
    @Prop({ unique: [true, 'Duplicate email entered'] })
    email: string;
  
    @Prop()
    password: string;
  
    @Prop()
    gender: string;
  
    @Prop()
    dob: string;
  
    @Prop()
    address: string;
  
    @Prop({ default: false })
    blocked: boolean;

    @Prop()
    rating: number;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
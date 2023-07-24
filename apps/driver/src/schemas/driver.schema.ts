import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "y/common";

@Schema({ versionKey: false}) 
export class Driver extends AbstractDocument {
    @Prop()
    name: string;

    @Prop()
    address: string;

    @Prop()
    number: number;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
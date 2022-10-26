import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {User, UserDocument} from './auth.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('users') private _userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async create(user: User): Promise<UserDocument> {
        const newUser: UserDocument = new this._userModel({
            ...user,
            password: await bcrypt.hash(user.password, 8)
        });
        return newUser.save();
    }

    async getUser(query) : Promise<UserDocument> {
        const user = await this._userModel.findOne(query);
        return user 
    }

    async deleteUser(id: string) {
        await this._userModel.deleteOne({_id: id})
    }

    async validatePassword(params: { [key:string]: any}) {
        const {email, password} = params;
        const user = await this._userModel.findOne({email});
        if(!user) throw new HttpException("user not found", HttpStatus.NOT_FOUND)
        const isVerified: boolean = await user.verifyPassword(password)
        if(!isVerified) throw new HttpException("invalid credentials", HttpStatus.UNAUTHORIZED)
        return isVerified
    }

    async authorize(user: UserDocument) {
        const payload = { username: user.username, email: user.email, sub: user._id}
        const token = this.jwtService.sign(payload)
        return {token}
    }
}
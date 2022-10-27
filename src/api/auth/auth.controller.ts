import { Body, Get, Post, Controller, Inject, forwardRef, HttpException, HttpStatus, UseGuards, Request, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User, UserDocument } from "./auth.model";
import { LocalAuthGuard } from "./local-auth.guard";


@Controller({ path: '/auth' })
export class AuthController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly _authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() userDto: User) {
        try {
            let query = {
                $or: [
                    { email: userDto.email },
                    { username: userDto.username }
                ]
            }
            const existingUser = await this._authService.getUser(query);
            if (existingUser) throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
            await this._authService.create(userDto);
            return {
                statusCode: HttpStatus.CREATED,
                message: "registration successful"
            };
        } catch (error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() userDto: User) {
        try {
            let query = {
                $or: [
                    { email: userDto.email },
                    { username: userDto.username }
                ]
            }
    
            const user = await this._authService.getUser(query);
            user.verifyPassword(userDto.password)
            const { token } = await this._authService.authorize(user);
            if (!token) throw new HttpException('Error getting token', HttpStatus.INTERNAL_SERVER_ERROR)
            return { 
                statusCode: HttpStatus.OK,
                message: "authentication successful", 
                data: token 
            };
        }  catch (error) {
            console.log(error)
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }
}
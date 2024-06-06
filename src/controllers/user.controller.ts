import { Controller, Post, Get, Route, Body, SuccessResponse, Tags, Header, Request, Security, Response, Middlewares} from 'tsoa';
import UserModel, { User, DocUser } from "../../models/user"
import { isValidCreateUser, isValidEmail } from '../utils/createUser.validator';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { Role } from '../../models/user';
dotenv.config();
const jwtSecret = process.env.jwtSecret;
const salt = 10

interface login{
    email : string,
    password: string,
}

interface createResult {
    name: String,
    email: String,
    role : Role
}
type loginResult = createResult;


@Route('user')
@Tags('User')
export class UserController extends Controller {
    /**
     * Create a new user
     * @summary Creates a new user
     * @param requestBody User details like username, email, and password
     * @returns user object
     */
    @SuccessResponse('200', 'User Object')
    @Response('500', 'Internal Server Error')
    @Response('400', 'Bad Request')
   @Header()
    @Post('create')
    public async createUser(@Body() requestBody: User): Promise<DocUser | String>{
        try {
            if(!isValidCreateUser(requestBody.username, requestBody.email, requestBody.password))
                {
                    this.setStatus(400);
                    throw new Error("Invalid From Data");
                }
            const newUser = requestBody;
            newUser.password = await bcrypt.hash(newUser.password, salt);
            const {username, email, role, id} = await UserModel.create(newUser);
            const user = {username, email, role};
            const data = {id, role};
            const access_token = jwt.sign(data, jwtSecret, {expiresIn:"1h"});
            const options = {httpOnly:true, secure:false}
            let cookieOptions = Object.entries(options)
            .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
            .join('; ');
            const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour from now
        cookieOptions += `; Expires=${expiryDate.toUTCString()}`;

            this.setHeader("Set-Cookie", `access_token =${access_token}; ${cookieOptions}`);
            this.setStatus(200);
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            if (error instanceof Error)
                {
                    return "Error occured: " + error.message
                }
                this.setStatus(500);
                return "Internal Server Error"   
        }
    }
   
    /**
 * Get all users
 * @summary Testing protected route(uses http only cookies)
 */
@Get('get')
@SuccessResponse('200', "Array of User Objects")
@Response('401', 'Unauthorized')
@Response('500', 'Internal Servel Error')
// @Security('cookieAuth')
@Security("BearerAuth")
public async getUsers(@Request() req: any): Promise<DocUser[] | String> {
    try {
        const users: DocUser[] = await UserModel.find();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        if (error instanceof Error) {
            return "Error occurred: " + error.message;
        }
        else{
            this.setStatus(500);
            return "Internal Server Error";
        }
    } 
}

     /**
     * Login to the account
     * @summary Login
     */
    @Post("login")
    @SuccessResponse('200', 'User Object')
    @Response("401", "Unauthorized")
    @Response('500', 'Internal Server Error')
    public async loginUser(@Body() requestBody:login): Promise<loginResult | string>{
        try{
            if(!isValidEmail(requestBody.email))
                {
                    this.setStatus(400)
                    throw new Error("Invalid From Data");
                }
            const user = await UserModel.findOne({email:requestBody.email});
            if(!user)
                {
                    this.setStatus(401)
                    throw new Error("Credentials are invalid");
                }
            const validPassword = await bcrypt.compare(requestBody.password, user.password);
            if(validPassword)
                {
                    const data = {id:user.id, role: user.role};
                    const access_token = jwt.sign(data, jwtSecret, {expiresIn:"1h"});
                    const options = {httpOnly:true, secure:false}
                    let cookieOptions = Object.entries(options)
                    .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
                    .join('; ');
                    const expiryDate = new Date();
                    expiryDate.setTime(expiryDate.getTime() + (1 * 60 * 60 * 1000)); // 1 hour from now
                    cookieOptions += `; Expires=${expiryDate.toUTCString()}`;
                    this.setStatus(200);
                    this.setHeader("Set-Cookie", `access_token =${access_token}; ${cookieOptions}`);
                    return JSON.parse(JSON.stringify({name:user.username, role:user.role, email:user.email}))
                }
                else{
                    this.setStatus(401)
                    throw new Error("Credentials are invalid");
                }
                }
        catch(error)
        {
            if (error instanceof Error)
                {
                    return "Error occured: " + error.message
                }
                this.setStatus(500);
                return "Internal Server Error"   
        }
        }


         /**
 * Get all users using jwt token
 * @summary Testing protected route(using jwt token)
 */
@Get('getall')
@Security('jwt')
@SuccessResponse('200', "Array of User Objects")
@Response('401', 'Unauthorized')
@Response('500', 'Internal Servel Error')
@Security("BearerAuth")
// @Middlewares(authMiddleware)
// @Security('cookieAuth')
public async getllUsers(@Request() req: any): Promise<DocUser[] | String> {
    try {
        const users: DocUser[] = await UserModel.find();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        if (error instanceof Error) {
            return "Error occurred: " + error.message;
        }
        else{
            this.setStatus(500);
            return "Internal Server Error";
        }
    } 
}

        
    }


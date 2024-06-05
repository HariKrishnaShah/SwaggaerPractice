import { Controller, Post, Get, Route, Body, SuccessResponse, Tags, Middlewares, Header, Request, Security} from 'tsoa';
import UserModel, { User, DocUser } from "../../models/user"
import { NextFunction} from 'express';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { Role } from '../../models/user';
dotenv.config();
const jwtSecret = process.env.jwtSecret;
const salt = 10

interface login{
    email : String,
    password: String,
}

interface createResult {
    name: String,
    email: String,
    role : Role
}
type loginResult = createResult;


const middlwareCalled = async(req:any, res:Response, next:NextFunction)=>{
    try
    {
        const cookies = req.headers.cookie;

        if (cookies) {
            const cookiesArray = cookies.split(';');
            const accessTokenCookie = cookiesArray.find(cookie => cookie.trim().startsWith('access_token='));
    
            if (accessTokenCookie) {
                const access_token = accessTokenCookie.split('=')[1];
                const validJWT = jwt.verify(access_token, jwtSecret);
                console.log("Jwt is valid or not? ");
                console.dirxml(validJWT);
                if(validJWT)
                    {
                        req.user = validJWT;
                        next()
                    }
                    else{
                        throw new Error("Access cookie not found");
                    }
    
            } else {
                console.log("Access token cookie not found");
            }
        } else {
            throw new Error("Access cookie not found");
        }
        
    }
    catch(error)
    {
        console.log("Error occured: " + error)
    }
   
   
}

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
   @Header()
    @Post('create')
    public async createUser(@Body() requestBody: User): Promise<DocUser> {
        try {
            console.log("Started");
            const newUser = requestBody;
            newUser.password = await bcrypt.hash(newUser.password, salt);
            console.log("Salt added")
            const {username, email, role, id} = await UserModel.create(newUser);
            console.log("User crearted");
            const user = {username, email, role};
            console.log("sample user formed");
            const data = {id, role};
            const access_token = jwt.sign(data, jwtSecret, {expiresIn:"1h"});
            const options = {httpOnly:true, secure:false}
            console.log("cookies set");
            const cookieOptions = Object.entries(options)
    .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
    .join('; ');
            console.log("Reached here");
            this.setHeader("Set-Cookie", `access_token =${access_token}; ${cookieOptions}`);
            // res.cookie('access_token', "Latest token by Hari", options);
            this.setStatus(200)
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            this.setStatus(502)
            throw new Error("Error occurred");
        }
    }

   
    /**
 * Get all users
 * @summary Get All Users
 */
@Get('get')
@Middlewares(middlwareCalled)
// @Security('cookieAuth')
public async getUsers(@Request() req: any): Promise<DocUser[]> {
    try {
        console.log("Incoming user details");
        console.dirxml(req.user);
        const users: DocUser[] = await UserModel.find();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        this.setStatus(500);
        throw new Error("Internal server error occurred.");
    }
}

     /**
     * Login to the account
     * @summary Login
     */
    @Post("login")
    @SuccessResponse('200', 'User Object')
    public async loginUser(@Body() requestBody:login): Promise<loginResult>{
        try{
            const user = await UserModel.findOne({email:requestBody.email});
            if(!user)
                {
                    this.setStatus(404)
                    return JSON.parse(JSON.stringify("User not found"));
                }
            const validPassword = await bcrypt.compare(requestBody.password, user.password);
            if(validPassword)
                {
                    const data = {id:user.id, role: user.role};
                    const access_token = jwt.sign(data, jwtSecret, {expiresIn:"1h"});
                    const options = {httpOnly:true, secure:false}
                    const cookieOptions = Object.entries(options)
                    .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
                    .join('; ');

                    this.setStatus(200);
                    this.setHeader("Set-Cookie", `access_token =${access_token}; ${cookieOptions}`);
                    return JSON.parse(JSON.stringify({name:user.username, role:user.role, email:user.email}))
                    
                }
                else{
                    this.setStatus(404);
                    return JSON.parse(JSON.stringify("Credentils are wrong."))
                }
        }
        catch(error)
        {
            this.setStatus(502);
            throw new Error("Internal server error occured.");
        }

        
    }
}

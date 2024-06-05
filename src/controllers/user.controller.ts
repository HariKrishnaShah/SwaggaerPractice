import { Controller, Post, Get, Route, Body, SuccessResponse, Tags, Middlewares, Header, Request, Security} from 'tsoa';
import UserModel, { User, DocUser } from "../../models/user"
import { NextFunction, Response, Request as ExpressRequest} from 'express';
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


const middlwareCalled = async(req:Request, res:Response, next:NextFunction)=>{
    console.log("middleware called.")
    console.log("The attached auth token is");
    console.dirxml(await req.headers['authtoken']);
    next()
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
            const options = {httpOnly:true, secure:true}
            console.log("cookies set");
            const cookieOptions = Object.entries(options)
            .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
            .join('; ');
            console.log("Reached here");
            this.setHeader("Set-Cookie", `access_token = Bearer ${access_token}; ${cookieOptions}`);
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
    // @Security('cookieAuth')
    public async getUsers(@Request() request:ExpressRequest): Promise<DocUser[]> {
        try {
            console.log("Get Users called");
            const users: DocUser[] = await UserModel.find();
           const access_token = request.cookies.access_token;
           console.log("Got cookie " + access_token);
            return JSON.parse(JSON.stringify(users));
        } catch (error) {
            this.setStatus(500);
            throw new Error("Internal server error occurred.");
        }
    }
//  /**
//      * Login to the account
//      * @summary Login
//      */
//     @Get("login")
//     public async loginUser(@Request() request:login): Promise<String>{
//         try{
//             const {id, role, password} = await UserModel.findOne({name:request.email});
//             const validPassword = bcrypt.compare(request.password, password);
//             if(validPassword)
//                 {
//                     this.setStatus(200);
//                     const data = {id, role};
//                     const access_token = jwt.sign(data, jwtSecret, {expiresIn:"1h"});
//                     const options = {httpOnly:true, secure:true}
//                     const cookieOptions = Object.entries(options)
//                     .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
//                     .join('; ');
            
//                     this.setHeader("Set-Cookie", `access_token = Bearer ${access_token}; ${cookieOptions}`);
//                     return "Login Successful"
//                 }
//                 else{
//                     this.setStatus(404);
//                     return "Credentials are invalid";
//                 }
//         }
//         catch(error)
//         {
//             this.setStatus(502);
//             throw new Error("Internal server error occured.");
//         }

        
//     }
}

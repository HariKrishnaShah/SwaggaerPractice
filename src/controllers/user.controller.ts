import { Controller, Post, Get, Route, Body, SuccessResponse, Tags, Middlewares, Header, Request} from 'tsoa';
import UserModel, { User, DocUser } from "../../models/user"
import { NextFunction, Response, Request as ExpressRequest, Response as ExpressResponse} from 'express';


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
    @Middlewares(middlwareCalled)
    public async createUser(@Body() requestBody: User): Promise<DocUser> {
        try {
            console.log("Create Users called.")
            const user: DocUser = await UserModel.create(requestBody);
            const options = {httpOnly:true, secure:true}
            const cookieOptions = Object.entries(options)
    .map(([key, value]) => `${key}=${value ? 'true' : 'false'}`)
    .join('; ');
            this.setHeader("Set-Cookie", `access_token = Latest token by HARI; ${cookieOptions}`);
            
            // res.cookie('access_token', "Latest token by Hari", options);
            this.setStatus(200);
            return JSON.parse(JSON.stringify(user));

 
        } catch (error) {
            this.setStatus(502);
            throw new Error("Error occurred");
        }
    }

    /**
     * Get all users
     * @summary Get All Users
     */
    @Get('get')
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
}

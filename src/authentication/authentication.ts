import { NextFunction} from 'express';
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.jwtSecret;
//Http only cookie based authentication
// export async function expressAuthentication(req: any,
//     securityName: string,
//     scopes?: string[]){
//     try
//     {
//         const cookies = req.headers.cookie;

//         if (cookies) {
//             const cookiesArray = cookies.split(';');
//             const accessTokenCookie = cookiesArray.find(cookie => cookie.trim().startsWith('access_token='));
    
//             if (accessTokenCookie) {
//                 const access_token = accessTokenCookie.split('=')[1];
//                 const validJWT = jwt.verify(access_token, jwtSecret);
               
//                 if(validJWT)
//                     {
//                         return Promise.resolve(validJWT)
//                     }
//                     else{
//                         return Promise.reject({message:"Access Token expired."});
//                     }
    
//             } else {
//                 return Promise.reject({message:"Access Token not found."});
//             }
//         } else {
//             return Promise.reject({message:"Cookie not found Error."});
//         }
        
//     }
//     catch(error)
//     {
//     }
   
   
// }
// jwt token based authentication
export async function expressAuthentication(req: any,
    securityName: string,
    scopes?: string[]){
        try {
            const token = await req.headers.authorization?.split(" ")[1];
            if (!token) {
               return Promise.reject({ message: "Authorization token is missing" });
            }
            const payload = await jwt.verify(token, jwtSecret);
            if(!payload)
                {
                    return Promise.reject({ message: "Failed to authenticate token" });
                }
                const data = {payload}
                return Promise.resolve(data)
            
        } catch (error) {
            return Promise.reject({message:"Internal server error occured."})
        }
    }
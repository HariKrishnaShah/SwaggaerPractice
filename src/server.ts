import express, { Request, Response } from 'express';
import {connectToDB} from "../db"
import bodyParser from "body-parser"
import * as swaggerUI from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { RegisterRoutes } from "../build/routes";
import cookieParser from 'cookie-parser';
// import userRoutes from "../routes/user.routes"



// Create Express server
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

RegisterRoutes(app);


// Define a route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript!');
});
connectToDB();
console.log("Connected to DB");
// app.use("/user", userRoutes);

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Sample API',
//       version: '1.0.0',
//       description: 'A simple Node.js server with Swagger documentation',
//     },
//   },
//   apis: ['./routes/**/*.ts'], // Path to the API routes
// };

// const specs = swaggerJsdoc(options);
app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(require("../build/swagger.json")));

app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/swagger.json'));
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http:localhost/${PORT}`);
});

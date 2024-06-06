import express, { Request, Response } from 'express';
import {connectToDB} from "../db"
import bodyParser from "body-parser"
import * as swaggerUI from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { RegisterRoutes } from "../build/routes";
import cookieParser from 'cookie-parser';
import SwaggerJson from "../build/swagger.json"



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

app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(SwaggerJson,{
  swaggerOptions: {
    validatorUrl: null, // Disable Swagger validation
    docExpansion: 'list',
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: -1,
  },
  customSiteTitle: 'My Swagger Documentation',
}));

app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/swagger.json'));
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http:localhost/${PORT}`);
});

import express, { Request, Response } from 'express';
import {connectToDB} from "../db"
import bodyParser from "body-parser"
import * as swaggerUI from "swagger-ui-express";
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { RegisterRoutes } from "../build/routes";
import cookieParser from 'cookie-parser';
import SwaggerJson from "../build/swagger.json"
import multer from 'multer';


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
app.use(express.static(path.join(__dirname, "../", 'public', "uploads")));

app.get('/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/swagger.json'));
});


const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'public', 'uploads'), // Set the destination directory
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Generate a unique timestamp
    const extension = path.extname(file.originalname); // Get the file extension
    const filename = `${timestamp}${extension}`; // Construct the filename with timestamp and extension
    cb(null, filename); // Call the callback with the constructed filename
  },
});

const upload = multer({ storage });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http:localhost/${PORT}`);
});

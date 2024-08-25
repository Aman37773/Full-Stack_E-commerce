import express from 'express';
import connecttodb from './db.js';
import path from 'path'
import { fileURLToPath } from 'url';
import {errMiddleware} from './middleware.js';
const app=express();
import morgan from 'morgan'  //this depedency helps in keep showing the routes user trying to reach like if user trying to visit /kl or anything so it shows in terminal.
app.use(morgan('dev'));  //here we are using dev method which basically defines how that routes will be printed like  green code for correct route,yellow code for incorrect route by user, red code for server error at existing route
import dotenv from 'dotenv'
dotenv.config();
import cookieparser from 'cookie-parser';
import cors from 'cors'
import router from './routes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:true}));   //when we want to take value from url like req.params

app.use(express.static(path.join(__dirname, "./dist")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
});


app.use(cors({
origin:[process.env.front_end_url],
credentials:true,  //this helps frontend to make request to this backend with credentials(cookies) in it..
methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Include all methods you expect to use
allowedHeaders: ['Authorization', 'Content-Type'], // Include all headers you expect to use
}));
connecttodb();

app.use('/api',router)

app.all('*',(req,res)=>{
          res.status(404).send('not exist');
})

app.use(errMiddleware)  //imagine i made request to /api/register then if it is available then compiler will fullfill it and will not stop program there without checking any other routes and app.get() but if in that route(/api/register) if i used next() then firstly compiler will check any furthur middleware in route.post(/api/register) then check in app.get(/api) then check common middlewares like (app.use(name_of_middleware)) 

export default app;
// //note: require method involves commonjs module and import method involves es6 module which is advanced so we prefer to use import method and for that we need to include "type":module in package.json file
// import app from './app.js'
// import cloudinary from 'cloudinary'
// import path from 'path';


// //cloudinary config
// cloudinary.v2.config({
//           cloud_name: process.env.cloud_name, 
//           api_key: process.env.api_key, 
//           api_secret: process.env.api_secret
// })





// const port =process.env.port||3002;

// app.listen(port,async ()=>{
//           console.log(`server running successfully at ${port}`);
// })




          
import express from 'express';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url'; // For __dirname equivalent in ES6

const app = express();

// Setting up __dirname and __filename in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,  // Use uppercase for environment variable names for consistency
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Serve static files from the 'dest' directory
app.use(express.static(path.join(__dirname, "../dest")));

// Serve the index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dest/index.html"));
});

// Catch-all route for SPA client-side routing
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dest/index.html"));
});

const port = process.env.PORT || 3002; // Use uppercase PORT for consistency

app.listen(port, () => {
  console.log(`Server running successfully at port ${port}`);
});

const http = require("http");
const cloudinary = require("cloudinary");

process.on("uncaughtException",error =>{
    console.log("ERROR: " + error.stack);
    console.log("Shuting down due to uncaught exception");
    process.exit(1);
});

const app = require("./app");
const connectDatabase = require("./config/database");


//setting up database
connectDatabase();


//setting up cloudinary
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const server = http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${ process.env.PORT } PORT in ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection",error=>{
    console.log("ERROR: " + error.message);
    console.log("Shutting down server due to unhandled Promise rejections");
    server.close(()=>{
        process.exit(1);
    });
});
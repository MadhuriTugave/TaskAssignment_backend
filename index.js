const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const connect = require("./DB/index");
const authenticateToken = require("./authenticationMiddleware");
const UserRouter = require("./Routes/UserRoutes");
const EmployeeRouter = require("./Routes/EmployeeRoute");



dotenv.config();

const port = process.env.PORT || 5000;

//Middlewares;
app.use(cors());
app.use(express.json());

connect();



app.use("/User",UserRouter);
app.use( "/Employee", authenticateToken);
app.use("/Employee",EmployeeRouter);

app.listen(port ,()=>{
    console.log(`server is running on ${port}`);
})
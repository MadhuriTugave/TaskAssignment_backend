const express = require ("express");
const EmployeeController = require("../Controllers/Employee");


const EmployeeRouter = express.Router();

EmployeeRouter.post("/create" ,EmployeeController.CreateEmployee);
EmployeeRouter.get("/",EmployeeController.GetEmployee);
EmployeeRouter.delete("/:id",EmployeeController.DeleteEmployee);
EmployeeRouter.get("/search", EmployeeController.searchResult)
module.exports = EmployeeRouter;
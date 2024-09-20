const { User } = require("../Schema/Uesr");
const ObjectId = require("mongoose").Types.ObjectId;
const GetEmployee = async(req, res)=>{

    // console.log(req.user._id ,"user");
    try {
      const id = req.user._id;
      // console.log(req)
 
  const AllEmployees = await User.findById(id).select("Employees")
//   console.log(AllEmployees.Employees)

    //if No Project has created then it will give this error
  if (AllEmployees.Employees.length === 0) {
      return res.status(404).json({ message: 'You havent created any project !!!' });
    }

  // sending project list as a json   
  res.status(200).json(AllEmployees.Employees);

    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }


}

   const CreateEmployee = async(req , res)=>{
    // const { Name, email,mobileNumber, designation, gender, course, img}= req.body;
    //   console.log (Name, email,mobileNumber, designation, gender, course, img)

      try {

        const { Name, email,mobileNumber, designation, gender, course, img}= req.body;
        // console.log (Name, email,mobileNumber, designation, gender, course, img)
        // console.log(req.user)
        const id = req.user._id;
        // console.log(id)
        const user = await User.findOne({_id :id});
        console.log(user);
        // const isEmployeeExists = user.Employees.some(emp => emp.name === Name || emp.email === email);
    // if(!isEmployeeExists){
        if(user){
            await User.updateOne(
                { _id: id },
                { $push: { Employees : { _id: new ObjectId(),
                    name :Name,
                     email :email,
                     mobileNumber : mobileNumber,
                      designation:designation,
                       gender:gender,
                        course:course,
                         img:img
                } }}
              );
              res.status(201).json({ message: "Employee successfully added !!! "});
        }
    // }
    // else{
    //     res.status(409).json({
    //         message: "Duplicate Name or Email !!!",
    //        });
    // }

      } catch (error) {
       // console.log(error);
       res.status(500).json({
           message: "Server error",
          });
      }

   }

   const EditEmployee = async(req,res)=>{

    // console.log(req)
    // const {name, email,mobileNumber, designation, gender, course, img}= req.body;

        try {
            const userId = req.user._id; 
            const employeeId = req.params.id; 
            // console.log(userId , employeeId)
    
            // Find the user and get the specific employee's current data
            const user = await User.findOne({ _id: userId, "Employees._id": employeeId });
    
            if (!user) {
                return res.status(404).json({ message: "User or Employee not found" });
            }
    
         
            const employee = user.Employees.id(employeeId);
    
            // Merge the existing employee data with the new data from req.body
            const updatedEmployee = {
                ...employee.toObject(),
                ...req.body
            };
    // console.log(updatedEmployee)
           
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId, "Employees._id": employeeId },
                { $set: { "Employees.$": updatedEmployee } },
                { new: true } 
            );
    // console.log(updatedUser )
            res.status(200).json({
                message: "Employee updated successfully",
                updatedEmployee: updatedUser.Employees.id(employeeId)
            });
        } catch (error) {
            // console.error(error);
            res.status(500).json({ message: "Error updating employee", error });
        }
    };    

    const searchResult = async (req, res)=>{
         console.log(req.query)
         try {
          const id = req.user._id;
           let searchValue = req.query.query;
        //    console.log(searchValue);
           const capitalizeFirstLetter = (str) => {
            if (str.length === 0) return str; // handleing empty string
            return str.charAt(0).toUpperCase() + str.slice(1);
          };
          const capitalizedString = capitalizeFirstLetter(searchValue);
          // console.log(capitalizedString)
       
           const user = await User.findById(id);

    //  console.log(searchValue ,";;;;")
         const results = user.Employees.filter(project => {
          return (
            project.name && project.name.includes(capitalizedString) ||
            project.email &&  project.email.includes(capitalizedString) ||
            // project.mobileNumber && project.mobileNumber.includes(capitalizedString) ||
            project.course && project.course.includes(capitalizedString) ||
            project.designation &&  project.designation.includes(capitalizedString) ||
            project.gender &&  project.gender.includes(capitalizedString) 
         
            
          );
        });
      
            // console.log(results)
          res.json(results)
         } catch (error) {
          console.log(error);
         }


}

   

const DeleteEmployee = async(req,res)=>{
   try {
    // console.log(req.params.id , req.user._id)
    const userId = req.user._id; 
    const employeeId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { $pull: { Employees: { _id: employeeId } } },
        { new: true } 
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "Employee removed successfully",
        updatedUser
    });

} catch (error) {
    console.log(error);
}


   }

   module.exports = { CreateEmployee ,EditEmployee,DeleteEmployee,GetEmployee ,searchResult};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../Schema/Uesr");
const KEY = process.env.JWT_SECRET_KEY;

const login = async(req,res)=>{
    // console.log(req.body.UserName);

    try {
   
    const UserName = req.body.UserName
    
        const user = await User.findOne({UserName:UserName});
     
        if (!user) {
          // Hash the password
          const hashedPassword = await bcrypt.hash(req.body.password, 12);
          // Save the user to the database
          const userCreated = await User.create({
            UserName: req.body.UserName,
            password_hashed: hashedPassword,
          });
          // Create a Response object to send back to the client with sensitive data excluded
          const responseUser = {
            _id: userCreated._id,
            UserName: UserName,
          };
  
          // Generate an access token for the newly created user
          const accessToken = jwt.sign({ _id: userCreated._id }, KEY, {
            expiresIn: "1d",
          });
//   console.log(accessToken);
          // Send the response back to the client
          res.status(201).json({
            user: responseUser,
            access_token: accessToken,
            token_type: "Bearer",
            expiresIn: "3600",
          });
        } else {
          const isPasswordMatch = await bcrypt.compare(
            req.body.password,
            user.password_hashed
          );
          //  console.log(isPasswordMatch)
          if (!isPasswordMatch) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid Credentials" }); // 401 Unauthorized
          }
          // Create a Response object to send back to the client with sensitive data excluded
          const responseUser = {
            _id: user._id,
            UserName: user.UserName,
          };
          // Generate an access token for the user
          const accessToken = jwt.sign({ _id: user._id }, KEY, {
            expiresIn: "1d",
          });
          // Send the response back to the client
          res.status(200).json({
            user: responseUser,
            access_token: accessToken,
            token_type: "Bearer",
            expiresIn: "3600",
          });
        }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Invalid credentials " });
    }
  };
  module.exports = { login };


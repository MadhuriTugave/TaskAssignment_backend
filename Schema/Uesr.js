const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const UserSchema = new mongoose.Schema({
    UserName:{
        type:String,
        required : true,
      
    },
    password_hashed:{
        type: String,
        required : true
    },
   Employees:[
        {
            // _id: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     required: true,
            //   },
            
            name:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true,
              
            },
            mobileNumber:{
                type: Number,
                required: true
            },
            designation:{
                type: String,
                required: true
            },
            gender:{
                type: String,
                required: true
            },
            course:{
                type:[],
                required: true
            },
           
            img:{
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now 
            }
            
        }
    ]
});

const User = mongoose.model("testUser",UserSchema);


module.exports={ User }
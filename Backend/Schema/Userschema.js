import mongoose from "mongoose";
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,  
    },          
    email:{ 
        type:String,                        
           required:true,          
          unique:true,                                    

    }, 
    
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,    
        enum:['banker','customer'],
        required:true,
        default:'customer'
    }
},{timestamps:true}
);
const Usermodel=mongoose.model("User",userschema);
export default Usermodel;

import mongoose from 'mongoose';
const customerschema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true}
);
const Customermodel=mongoose.model("Customer",customerschema);
export default Customermodel;

    
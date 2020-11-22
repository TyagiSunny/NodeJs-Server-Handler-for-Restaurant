const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const promoSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    featured:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
});

const Promotions=mongoose.model('Promotion',promoSchema);

module.exports=Promotions;
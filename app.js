const express=require('express');
const mongoose=require('mongoose');
const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/RestApi").then(()=>{
    console.log("connected with mongo db");
}).catch((err)=>{
    console.log(err);
})
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
const productSchema=new mongoose.Schema({
name:String,
description:String,
price:Number,
}
)
const Product=new mongoose.model("Product",productSchema);
//create product
app.post("/api/v1/product/new",async(req,res)=>{
 const product=   await Product.create(req.body); //body parser install
 res.status(200).json({
    succes:true,
    product,
 })
});
//read product
app.get("/api/v1/products",async(req,res)=>{
    const products=await Product.find();
    res.status(200).json({
        succes:true,
        products,
     })
});
//update product 
app.put("/api/v1/product/:id",async(req,res)=>{
    let product=await Product.findById(req.params.id)
    if(!product){
        return product.status(500).json({
            succes:false,
            message:"product not found"
        })
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,({new:true,useFindAndModify:true,runValidators:true}))
    res.status(200).json({
        succes:true,
        product,
     })
});
app.delete("/api/v1/product/:id",async(req,res)=>{
    const product=await Product.findById(req.params.id);
   
    if(!product){
        return product.status(500).json({
            succes:false,
            message:"product not found"
        })
    }
    await product.deleteOne();
    res.status(200).json({
        succes:true,
        message:"product is deleted"
    })
})
app.listen(3000,()=>{
    console.log("server is running");
})
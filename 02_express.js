const express=require('express');
const app=express();
const mw=(req,res,next)=>{
    console.log("局部生效")
}
app.get('/user',mw,(req,res)=>{
res.send({name:'zs'})
})
app.post('/user',(req,res)=>{
    res.send('请求post')
    })
app.listen(80,()=>{
    console.log('http://127.0.0.1');
})
app.get('/',(req,res)=>{
    console.log(req.query);
    res.send(req.query);
})
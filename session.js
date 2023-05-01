var express=require('express')
const app=express()

var session=require('express-session');
app.use(session({
    secret:'itheima',
    resave:false,
    saveUninitialized:true,
}))
const express=require('express')
const app=express()
//解决接口跨域
const cors=require('cors')
app.use(cors())
const joi=require('joi');
//配置解析表单数据中间件
app.use(express.urlencoded({extended:false}))
//封装cc函数实现send
app.use((req,res,next)=>{ 
    res.cc=function(err,status=1)
    {
        res.send({
            status,
            message:err instanceof Error?err.message:err,
        })
    }
    next();
})
//导入错误级别中间件
app.use((err,req,res,next)=>{
    //验证失败
    if(err instanceof joi.ValidationError)
    return res.cc(err)
    //身份认证失败
    if(err.name==='UnauthorizedError')
    return res.cc('身份认证失败')
    //其他错误
    //return res.cc(err);
     return res.send({
        message:err
     })
})
//路由之前配置解析token中间件
const expressJwt=require('express-jwt')
const config=require('./config')
//api开头不需要认证
app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\/api/]}))


//导入用户路由模块
const userRouter=require('./router/user')

app.use('/api',userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)

//导入文章分类路由模块
const  artCateRouter=require('./router/artcate');
const { error } = require('@hapi/joi/lib/base');
app.use('/my/article', artCateRouter)



app.listen(3008,function()
{
    console.log('http://127.0.0.1:3008');
})
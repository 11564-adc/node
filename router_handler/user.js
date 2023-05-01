/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

  //导入数据库模块
  const db=require('../db/index')
  //导入密码加密模块
  const bcrypt=require('bcryptjs')
  //导入生成Token包
  const jwt=require('jsonwebtoken')
  //导入全局配置文件
  const config=require('../config')


// 注册用户的处理函数
exports.regUser = (req, res) => {
    const userinfo=req.body;
    //为空返回
    if(!userinfo.username||!userinfo.password)
    return res.send({
      status:1,
      message:'用户名或密码不合法'
     })
      //数据库操作检查是否存在用户名
  const sqlStr='select * from ev_users where username=?';
  db.query(sqlStr,userinfo.username,(err,results)=>{
    //执行sql语句失败

    if(err)
    return res.send({ status:1, message:err.message})

    //判断是否占用
    if(results.length>0)
    {
      return res.send({status:1,message:'用户名已存在'})
      //return res.cc(err);
    }
    //密码加密
    userinfo.password=bcrypt.hashSync(userinfo.password,10);
    //插入用户sql语句
    const sql='insert into ev_users set ?';
    db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
      if(err)
      return res.send({status:1,message:err.message})
      //判断是否影响一行
      if(results.affectedRows!==1)
      return res.send({status:1,message:'注册用户失败'})
      //注册成功
      res.send({status:0,message:'注册成功',
      });  
    })
  })
  }
 

  // 登录的处理函数
  exports.login = (req, res) => {
    //接受表单数据
    const userinfo=req.body;
    //定义sql
  const sql='select * from ev_users where username=?'
    //执行sql
    db.query(sql,userinfo.username,(err,results)=>{
      //执行失败
    if(err)
    return res.cc(err)
      //获取数据不对
      if(results.length!==1)
      return res.cc("登陆失败")
      //判断密码是否正确
      const compareResult=bcrypt.compareSync(userinfo.password,results[0].password);
      if(!compareResult)
      return res.cc("登陆失败")
      //登陆成功生成token字符串
      const user={...results[0],password:'',user_pic:''}
      //信息加密
       const tokenStr=jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
       //调用res.send()将token响应给客户端
       res.send({
        status:0,
        message:'登陆成功',
        token:'Bearer '+tokenStr,
        username:userinfo.username,
      password:userinfo.password
       })
    })
    }


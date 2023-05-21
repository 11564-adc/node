
const express=require('express')
const bodyParser = require('body-parser');
//要解决跨域问题，草
var cors = require('cors');
const app = express()
app.use(cors());
const joi=require('joi');
//修改请求体大小
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

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

//数据库
const mysql=require('mysql');
const { error, result } = require('@hapi/joi/lib/base');
const db=mysql.createPool({
  host:'127.0.0.1',
  user:'root',
  password:'1234',
  database:'first_table',
})
//解析表单
app.use(bodyParser.urlencoded({ extended: false}));

//api开头不需要认证  show getCount newdata solved delete
app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\/api/,/\/show/,/\/getCount/,/\/newdata/,/\/delete/,/\/solved/,/\/pieChart/,/\/account/]}))


//导入用户路由模块
const userRouter=require('./router/user')
app.use('/api',userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)


//const { error } = require('@hapi/joi/lib/base');



//报修提交
app.post('/repair', (req, res) => {
    const sql='insert into baoxiu set ?'
  const username = req.body.username;
  const tel=req.body.tel;
  var time=req.body.time;
  time=new Date(time.replace('T',' '));
  const xh=req.body.xh;
  const question=req.body.question;
  db.query(sql,{username:username,tel:tel,time:time,xh:xh,question:question},(err,results)=>{
    if(err)
    return res.send({message:err.message})
    //提交成功
    res.send({status:0,message:'提交成功'
});  
  })
  
  
  
})

//申请加入提交


//进入页面初始化表格,以及维修情况表
app.get('/show', (req, res) => {
  const sql='select * from baoxiu ORDER BY time DESC LIMIT 0,7'
db.query(sql,(err,results)=>{
  if(err)
  return res.send({message:err.message})
  //表单数据返回到前端
 
  res.json(results);  
})
//维修情况数据表
app.get('/showData',(req,res)=>{
  
  db.query('CALL baoxiu_statistics()', function (error, results, fields) {
    if (error) throw error;
  
    
    res.json(results[0]);
  });
})
//分页显示
app.post('/newdata',(req,res)=>{

   const pageNum=req.body.Num;
   //要解决类型不同问题
   const pageSize=parseInt(req.body.Size)
   //从那一条开始
   const start=(pageNum-1)*pageSize;
   
  // res.send({status:0,start:start})
  db.query('select * from baoxiu ORDER BY time DESC LIMIT ?,?',[start,pageSize],(error,results)=>{
    if(error)
    res.send({message:error.message})

    res.json(results)
   })
})
//最大页码
app.get('/getCount',(req,res)=>{
  db.query('select count(*) from baoxiu',(error,results)=>{
    if(error)
    res.send({message:error.message})
    
    const total=results[0]['count(*)'];
    res.send({total});  
    
  })
 
})

})
 //柱状图
app.get('/account',(req,res)=>{
  const sql='SELECT xh,count(xh) FROM `baoxiu` GROUP BY xh'
  db.query(sql,(error,results)=>
       {
    if(error)
    res.send({message:error.message})
    else
    {
      const xhArray = [];
      const countArray = [];
      for (let i = 0; i < results.length; i++) {
        xhArray.push(results[i].xh);
        countArray.push(results[i]['count(xh)']);
      }
      res.send({
        xh: xhArray,
        count: countArray
      });
    }
    
        })
   
      })
      //饼图
app.get('/pieChart',(req,res)=>{
        const sql='SELECT xh,count(xh) FROM `baoxiu` GROUP BY xh'
        db.query(sql,(error,results)=>
             {
          if(error)
          res.send({message:error.message})
          else
          {
            const xhArray = [];
            const countArray = [];
            for (let i = 0; i < results.length; i++) {
              xhArray.push(results[i].xh);
              countArray.push(results[i]['count(xh)']);
            }
            res.send({
              xh: xhArray,
              count: countArray
            });
          }
          
              })
         
            })
//是否完成
app.post('/solved',(req,res)=>{
  const sql='UPDATE baoxiu SET solve=? WHERE username=?'
console.log(req.body.solve)
console.log(req.body.username)
  var s;
  if(req.body.solve=="true")
  s="1"
  else
  s="0"
  console.log(s)
  db.query(sql,[s,req.body.username],(error,results)=>{
    if(error){
    res.send({message:error.message})
    }
     else {
      
     // db.commit()
    res.send({solve:s});
     }
  })

})
//删除记录
app.post('/delete',(req,res)=>{
  const sql='delete from baoxiu where username=? '
 db.query(sql,req.body.username,(error,results)=>{
  if(error){
    res.send({message:error.message})
    }
     else {
      
    res.send({delete:'删除成功'});
     }
 })
})
//申请表相关接口


//进入页面初始化表格,以及维修情况表
app.get('/showApp', (req, res) => {
  const sql='select * from applicant ORDER BY time DESC LIMIT 0,7'
db.query(sql,(err,results)=>{
  if(err)
  return res.send({message:err.message})
  //表单数据返回到前端

  res.json(results);  
})
})

//维修情况数据表
app.get('/showDataApp',(req,res)=>{
  
  db.query('CALL applicant_statistics()', function (error, results, fields) {
    if (error) throw error;
  
    
    res.json(results[0]);
  });
})
//分页显示
app.post('/newdataAPpp',(req,res)=>{

   const pageNum=req.body.Num;
   //要解决类型不同问题
   const pageSize=parseInt(req.body.Size)
   //从那一条开始
   const start=(pageNum-1)*pageSize;
   
  // res.send({status:0,start:start})
  db.query('select * from applicant ORDER BY time DESC LIMIT ?,?',[start,pageSize],(error,results)=>{
    if(error)
    res.send({message:error.message})

    res.json(results)
   })
})
//最大页码
app.get('/getCountApp',(req,res)=>{
  db.query('select count(*) from applicant',(error,results)=>{
    if(error)
    res.send({message:error.message})
    
    const total=results[0]['count(*)'];
    res.send({total});  
    
  })
 
})
//是否完成
app.post('/solvedApp',(req,res)=>{
  const sql='UPDATE applicant SET connect=? WHERE name=?'
console.log(req.body.solve)
console.log(req.body.username)
  var s;
  if(req.body.solve=="true")
  s="1"
  else
  s="0"
  
  db.query(sql,[s,req.body.username],(error,results)=>{
    if(error){
    res.send({message:error.message})
    }
     else {
      
     // db.commit()
    res.send({solve:s});
     }
  })

})
//删除记录
app.post('/delete',(req,res)=>{
  const sql='delete from applicant where name=? '
 db.query(sql,req.body.username,(error,results)=>{
  if(error){
    res.send({message:error.message})
    }
     else {
      
    res.send({delete:'删除成功'});
     }
 })
})
//管理员头像
app.post('/userImg',(req,res)=>{
  const sql='select user_pic from manager where username=?'
  db.query(sql,req.user.username,(error,results)=>{
    if(error){
      res.send({message:error.message})
      }
       else {
        
      res.send({img:results[0]});
       }
   })
})
const server=app.listen(3007, () => console.log('Server Started on http://localhost:3007'))


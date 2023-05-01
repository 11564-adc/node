//导入数据库模块
const { result } = require('@hapi/joi/lib/base')
const db=require('../db/index')
//导入处理密码模块
const bcrypt=require('bcryptjs')

//获取用户基本信息处理函数
exports.getUserInfo=(req,res)=>{
    const sql='select id,username,nickname,email,user_pic from ev_users where id=?'
    //身份认证成功自动往req挂载了user
   db.query(sql,req.user.id,(err,results)=>{
    if(err)
    return res.cc(err)
    if(results.length!==1)
    return rec.cc('获取信息失败')
    res.send({
        status:0,
        message:'获取用户基本信息成功',
        data:results[0],
    })
   })
}

//更新用户信息处理函数
exports.updateUserInfo=(req,res)=>{
    const sql='update ev_users set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) 
        return res.cc(err)
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) 
        return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功',0)
      })
}
//更新用户密码处理函数
exports.updatePassword=(req,res)=>{
    //根据id查询用户信息
    const sql='select * from ev_users where id=?'
    db.query(sql,req.user.id,(err,results)=>{
         // 执行 SQL 语句失败
         if (err) 
         return res.cc(err)
         // 执行 SQL 语句成功，但影响行数不为 1
         if (results.length !== 1) 
         return res.cc('用户不存在')
         //判断旧密码是否正确
         // 在头部区域导入 bcryptjs 后，
         const bcrypt=require('bcryptjs')
         // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
         // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
         const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if(!compareResult)
       return res.cc('原密码错误')
       //更新密码sql语句
       const sql='update ev_users set password=?  where id=?'
       //对新密码加密
       const newPwd=bcrypt.hashSync(req.body.newPwd,10)
       db.query(sql,[newPwd,req.user.id],(err,results)=>{
        //执行sql失败
        if(err)
        return res.cc(err)
        if(results.affectedRows!==1)
        return res.cc('更新密码失败')
        //成功
        res.cc('更新密码成功',0)
       })
    
    })
}
//更换头像
exports.updateAvatar=(req,res)=>{
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
      
        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
      })
}

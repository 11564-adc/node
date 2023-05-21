const expressJoi = require('@escook/express-joi');
const joi=require('joi')
//定义验证规则
const username =joi.string().alphanum().min(1).max(10).required();
const password=joi.string().pattern(/^[\S]{6,12}$/).required();
const id=joi.number().integer().min(1).required()
const nickname=joi.string().required()
const email=joi.string().email().required()
//验证头像规则
const avatar=joi.string().dataUri().required()

//验证注册登录表单数据规则对象
exports.reg_login_schema={
    body:{
        username,
        password,
    }
}
//验证更新用户信息
exports.update_userinfo_schema={
    //对req.body里面的数据后进行验证
      body:{
        id,
        nickname,
        email,
      }
}
//验证重置密码
exports.update_password_schema={
    body:{
     oldPwd:password,
     //新密码与旧密码不同，同时满足上面的password验证规则
     newPwd:joi.not(joi.ref('oldPwd')).concat(password)
    }
}
//更换头像
exports.update_avatar_schema={
    body:{
        avatar,
    }
}
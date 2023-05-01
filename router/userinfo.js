// 导入 express
const express = require('express')
//导入数据验证中间件
const expressJoi=require('@escook/express-joi')
//导入需要的验证规则对象
const {update_userinfo_schema, update_password_schema,update_avatar_schema}=require('../schema/user')
// 创建路由对象
const router = express.Router()
//得到对应处理函数
const userinfo_handler=require('../router_handler/userinfo_handler')
// 获取用户的基本信息,利用router_handler的处理函数
router.get('/userinfo',userinfo_handler.getUserInfo)
//更新用户信息,第二个表示对表单数据进行验证
router.post('/userinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)
//重置密码
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)
//更换头像
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)
// 向外共享路由对象
module.exports = router
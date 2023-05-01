//文章分类路由
const express=require('express')
const router=express.Router()
//导入文章分类路由处理函数模块
const artcate_handler=require('../router_handler/artcate')
//导入验证数据中间件
const expressJoi=require('@escook/express-joi')
//导入文章分离验证模块
const {add_cate_schema}=require('../schema/artcate')
//导入删除文章分类模块
const { delete_cate_schema } = require('../schema/artcate')
// 导入根据 Id 获取分类的验证规则对象
const { get_cate_schema } = require('../schema/artcate')
// 导入更新文章分类的验证规则对象
const { update_cate_schema } = require('../schema/artcate')
//获取文章分类
router.get('/cates',artcate_handler.getArticleCates)
//新增文章路由处理
router.post('/addcates', expressJoi(add_cate_schema),artcate_handler.addArticleCates)
//删除文章
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artcate_handler.deleteCateById)
//获取文章分类数据
router.get('/cates/:id',expressJoi(get_cate_schema),artcate_handler.getArticleById)
// 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema),artcate_handler.updateCateById)
module.exports=router
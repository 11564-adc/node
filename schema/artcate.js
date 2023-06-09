const joi=require('joi')
//定义分类名称和分类别名的校验规则
const name=joi.string().required()
const alias=joi.string().alphanum().required()
const id=joi.number().integer().min(1).required()
//校验规则
exports.add_cate_schema={
    body:{
        name,
        alias,
    },
}
//删除校验规则
exports.delete_cate_schema={
    params:{
        id, 
    },
}
// 校验规则对象 - 根据 Id 获取分类
exports.get_cate_schema = {
    params: {
      id,
    },
  }
// 校验规则对象 - 更新分类
exports.update_cate_schema = {
    body: {
      Id: id,
      name,
      alias,
    },
  }
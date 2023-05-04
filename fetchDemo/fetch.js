const express = require('express');
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
// 解析 application/x-www-form-urlencoded 格式的请求体
app.use(bodyParser.urlencoded({extended: false}));

// 解析 application/json 格式的请求体
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  
  
  res.json({username:req.body.username,
            password:req.body.password}); // 返回JSON格式的数据
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
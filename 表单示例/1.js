
const express=require('express')
const bodyParser = require('body-parser');
//要解决跨域问题，草
var cors = require('cors');
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const result = `Username: ${username} , Password: ${password}`;
  
  res.send(result);
})

app.listen(8080, () => console.log('Server Started on http://localhost:8080'))


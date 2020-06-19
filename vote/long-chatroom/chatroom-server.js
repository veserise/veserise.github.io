

const express = require('express')
const app = express()
const port = 3006
var pendingResponses = []

app.use(express.raw())
app.use(express.urlencoded({
  extended: true
}))


app.get('/', (req,res,next)=>{
  res.sendFile('/index.html')
})

app.get('/msg', (req,res,next)=>{
  pendingResponses.push(res)
})
app.post('/msg', (req,res,next)=>{
  var body = req.body
  if(body){

    pendingResponses.forEach(re =>{
      re.end(body)
    })
  }
})

app.listen(port, ()=>[
  console.log('lisnetning to prot', port)
])
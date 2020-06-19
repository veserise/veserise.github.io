const express = require('express')
const app = express.Router()
const http = require('http')
const url = require('url')
const server = http.createServer(app)
const socketIo = require('socket.io')
const ioServer = socketIo(server)

let db
const dbPromise = require('./db')   //数据库

dbPromise.then(dbResolve => { //数据库打开,服务器才进行操作
  db = dbResolve
})


//创建投票
app.post('/create-vote', async (req, res, next) => {
  var info = req.body
  var userid = req.signedCookies.userid

  var user = await db.run('INSERT INTO votes (title, desc ,userid, singleSelection, deadline, anonymouse) VALUES (?,?,?,?,?,?)',
    info.title, info.desc, userid, info.singleSelection, info.deadline, info.anonymouse
  )

  var vote = await db.get('SELECT * FROM votes ORDER BY id DESC LIMIT 1')

  await Promise.all(info.options.map(option => {
    return db.run('INSERT INTO options (content, voteid) VALUES (?,?)', option, vote.id)
  }))

  if( req.is('json') ){
    res.json(vote)
  }else{
    res.redirect('/vote/' + vote.id)
  }
})

//投票页面
app.get('/vote/:id', async (req, res, next) => {
  var id = req.params.id
  var userid = req.signedCookies.userid

  var vote = await db.get("SELECT * FROM votes WHERE id=?", id) 
  var options = await db.all("SELECT * FROM options WHERE voteid=?", id)
  var voteups = await db.all("SELECT * FROM voteups WHERE voteid=?", id)

  res.json({
    vote: vote,
    options: options,
    voteups: voteups,
  })
})

//投票主页面
app.get('/vote', async (req, res, next) => {
  var votes = await db.all("SELECT * FROM votes")
  var options = await db.all("SELECT * FROM options")
  var voteups = await db.all("SELECT * FROM voteups")

  res.json({
    votes: votes,
    options: options,
    voteups:voteups,
  })
})

//点击投票
app.post('/voteup', async (req, res, next) => {
  const userid = req.signedCookies.userid
  const voteid = req.body.voteid
  const optionid = req.body.optionid

  if (!userid) {
    res.status(401).json({
      code: -1,
      msg: '未登陆用户不能参与投票'
    })
    return
  }

  var voteInfo = await db.get('SELECT * FROM votes WHERE id=?', voteid)

  if (Date.now() > voteInfo.deadline) {
    res.status(403).json({
      code: -1,
      msg: '当前投票已截止'
    })
    return
  }

  var voteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, voteid)
  

  if (voteupInfo) {//已经投过
    await db.run('UPDATE voteups SET optionid=? WHERE userid=? AND voteid=?', optionid , userid, voteid)
  } else {
    await db.run('INSERT INTO voteups (userid, optionid, voteid) VALUES (?,?,?)', userid, optionid, voteid )
  }

  ioServer.in(`/vote/${voteid}`).emit('new vote', {
    userid,
    voteid,
    optionid: optionid,
  })

  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', voteid)

  res.json({
    voteups:voteups,
  })
})


//某个用户获取某个问题的投票信息
app.get('/voteup/:voteid/info', async (req, res, next) => {
  var userid = req.signedCookies.userid
  var voteid = req.params.voteid
  var userVoteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, voteid)

  if (userVoteupInfo) {
    var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', voteid)
    res.json(voteups)
  } else {
    res.json(null)
  }
})

//获取投票信息
app.get('/voteinfo/:id',async ( req,res, next) =>{
  let id = req.params.id
  console.log(id)
  var vote = await db.get('SELECT * FROM votes WHERE id=?', id)
  var options = await db.all('SELECT * FROM options WHERE voteid=?', id)
  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', id)

  res.json({
    vote: vote,
    voteups: voteups,
    options: options,
  })
})


module.exports = app








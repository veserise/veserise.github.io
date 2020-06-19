const md5 = require('md5')
const express = require('express')
const multer = require('multer')
const uploader = multer({
  dest: './upload/',
  preservePath: true,
})

const svgCaptcha = require('svg-captcha')
const emailTransporter = require('./email')
const session = require('express-session')
let db
const dbPromise = require('./db')

//数据库打开,服务器才进行操作
dbPromise.then(dbResolve => {
  db = dbResolve
})

const changepwdTokemap = {}  //纪录用户的邮箱
const app = express.Router()

/**
 * 中间件
 * 上传文件，session
 */

app.use(session({ secret: 'my secret', resave: false, cookie: { maxAge: 60000 } }))


//登陆页面
app.route('/login')
  .get((req, res, next) => {
    res.render('login.pug', {})
  })
  .post(async (req, res, next) => {
    var loginU = req.body
    console.log(loginU, req.session.captcha )

    if (loginU.captcha != req.session.captcha) {
      res.json({ code: -1, msg: '用户密码错误' })
      return
    }
    var user = await db.get('SELECT * FROM users WHERE name=? AND pwd=?', loginU.name, md5(md5(loginU.pwd)))
    if (user) {
      //用户登陆，信息cookie,标记，进行加密
      res.cookie('userid', user.id, {
        signed: true,
      })
      res.json({ code: 0 })
    } else {
      res.json({ code: -1 })
    }
  })

//获取当前用户的基本信息
app.route('/userinfo')
  .get( async (req, res, next) => {
    var userid = req.signedCookies.userid
    if(!userid){
      res.status(404).end()
    }
    var info =  await db.get('SELECT id,name,avatarid FROM users WHERE id=?', userid)
    res.json({
      info: info
    })
 })


//获取用户图片
app.route('/imgs/:id')
  .get( async (req, res, next) => {
    var id = req.params.id
    if(!id){
      res.status(404).end()
    }
    var user = await db.get('SELECT * FROM users WHERE id=?', id)
    if(user){
      var info =  await db.get('SELECT * FROM imgs WHERE id=?', user.avatarid)
      res.json({
        info: info
      })
    }else{
      res.json({
        code:-1
      })
    }
    
  })

//获取图片
app.route('/imgs')
.get( async (req, res, next) => {
  var info =  db.all('SELECT id, path FROM imgs')
  res.json({
    info: info,
  })
})

//注册页面
app.route('/register')
  .post(uploader.single('avatar'), async (req, res, next) => {
    var userInfo = req.body
    var file = req.file

    var user = await db.get('SELECT * FROM users WHERE name=?', userInfo.name)
    if (user) {
      if(req.file){
        await fsp.unlink(req.file.path)
      }
      res.status(401).json({
        code:-1,
        mesg:'用户已存在'
      })
    } else {
      // await sharp(imgBuf)
      //       .resize(256)
      //       .toFile(req.file.path)
      //存储图片
      await db.run('INSERT INTO imgs (name, avatarMime ,path,size) VALUES (?,?,?,?)',
        file.originalname, file.mimetype, file.path, file.size)

      var imgs = await db.get('SELECT * FROM imgs ORDER BY id DESC LIMIT 1')

      //插入数据
      await db.run('INSERT INTO users (name, pwd,email,avatarid) VALUES (?,?,?,?)',
        userInfo.name, md5(md5(userInfo.pwd)), userInfo.email, imgs.id)

      res.end(`<script>alert('注册成功');setTimeout( ()=>{location.href = '/login'},3000)</script>`)
    }
  })

//验证码
app.get('/captcha', (req, res, next) => {
  var captcha = svgCaptcha.create({
    ignoreChars: '0Ooil1t'
  })
  res.type('svg')
  req.session.captcha = captcha.text
  res.end(captcha.data)
})

//忘记密码
app.route('/forgot')
  .post(async (req, res, next) => {
    var email = req.body.email

    var user = await db.get('SELECT * FROM users WHERE email=?', email)
    if (!user) {
      res.status(404).json({
        code:-1,
        msg:'不存在此用户',
      })
      return
    }

    var token = Math.random().toString().slice(2)   //随机生成数
    changepwdTokemap[token] = email
    var link = `http://localhost:3005/change-pwd/${token}`

    setTimeout(() => {
      delete changepwdTokemap[token]
    }, 60 * 1000 * 20)//20分钟后删除token


    emailTransporter.sendMail({
      from: '1005281785@qq.com',
      to: email,
      subject: '修改密码',
      html: `<a href="${link}"></a>`

    }, (err, info) => {
      res.json({
        code:0,
        msg:'以向你的邮箱发送密码重置连接,请在20分钟内修改密码'
      })
    })
  })


//修改密码
app.route('/change-pwd/:token')
  .get( (req, res, next) => {

    var token = req.params.token
    var email = changepwdTokemap[token]

    var user =  db.get('SELECT * FROM users WHERE email=?', email)
    res.json({
      user: user,
    })
  })
  .post(async (req, res, next) => {

    var pwd = req.body.pwd
    var token = req.params.token
    var email = changepwdTokemap[token]

    var user = await db.get('SELECT * FROM users WHERE email=?', email)

    if (user) {
      await db.run('UPDATE users SET pwd=? WHERE email=?', md5(md5(pwd)), email)
      delete changepwdTokemap[token]
      res.json({
        code:0,
        msg:'密码修改成功'
      })
    } else {
      res.status().json({
        code:-1,
        msg:'连接已失效'
      })
      return
    }
  })


//退出
app.get('/logout', (req, res, next) => {
  res.clearCookie('userid')  //清楚当前用户标记
  res.json({
    code:-1,
  })  //跳回首页
})


module.exports = app

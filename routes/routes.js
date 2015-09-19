var express = require('express');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var router = express.Router();
var User = require('../models/user');
var email = require('../models/email');

router.get('/', function (req, res) {
    res.render('index');
});
router.get('/login', function (req, res) {
    if (req.cookies.md5key) {
        User.findOne({"md5key": req.cookies.md5key}, function(err, user){
            if (user) {
                res.render('login', {"email": user.email, "password": user.password});
            } else {
                res.render('login');
            }
        });
    } else {
        res.render('login');
    }
});

router.post('/login', function (req, res) {
    User.findOne({"email": req.body.email}, function(err, user){
        if (user) {
            if (user.password == req.body.password) {
                if (req.body.remember) {
                    res.cookie('md5key', user.md5key);
                } else {
                   res.cookie('md5key', "");
                }
                req.session.username = user.username;
                req.session.email = user.email;
                res.redirect(303, '/chat');
            }else {
                res.render('login', {"error": "密码错误！"});
            }
        } else {
            res.render('login', {"error": "用户不存在！"});
        }
    });
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var content = req.body.email + req.body.password;
    var hash = crypto.createHash('md5').update(content).digest('hex');
    var option = {
        'username': req.body.username,
        'email': req.body.email,
        'password': req.body.password,
        'md5key': hash
    };
    var aUser = new User(option);
    User.findOne({"email": req.body.email}, function(err, user){
        if (user) {
            res.render('register', {"error": "该用户已注册！"});
        } else {
            aUser.save(function(err, user){
                res.render('register', {"success": "成功"});
            });
        }
    });
});

router.get('/forget', function (req, res) {
    res.render('forget');
});

router.post('/forget', function (req, res) {
    User.findOne({"email": req.body.email}, function(err, user){
        if (user) {
            var transporter = nodemailer.createTransport({
                service: 'QQ',
                "domains": [
                    "qq.com"
                ],
                "host": "smtp.qq.com",
                "port": 465,
                "secure": true,
                auth: {
                    user: email.user,
                    pass: email.pass
                }
            });
            var mailOptions = {
                from: 'husterxsp@qq.com', 
                to: req.body.email, 
                subject: 'chat找回密码', 
                text: "您的账户密码为"+ user.password
            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    res.render('forget', {"error": error});
                } else {
                    res.render('forget', {"success": "密码已发至邮箱！"});
                }
                
            });
            
        } else {
            res.render('forget', {"error": "邮箱用户不存在！"});
        }
    });
});

router.get('/about', function (req, res) {
    res.render('about');
});

router.get('/chat', function (req, res) {
    if (req.session.username) {
        res.render('chat', {"username": req.session.username });
    } else {
        res.redirect(303, '/');
    }
});

module.exports = router;
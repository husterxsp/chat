###基于Node, Express, MongoDB, Bootstrap的聊天室
- 模板引擎采用handlebars
- 使用cookie来实现保存密码
- 使用session来保存用户登录状态

###运行
1. 运行MongoDB 
2. 安装依赖
	```
	npm install
	```
3. 修改 models/email.js 。将对应的qq邮箱和密码改为自己的，同时qq邮箱需开启smtp服务。此邮箱和密码用于找回密码时发送邮件。
4. 运行
	```
	node chat
	``` 
或者
```
npm start
```

###在线演示
[http://chat-d1577.coding.io/](http://chat-d1577.coding.io/)

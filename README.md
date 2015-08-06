# moa-console

a console for debug mongoose entity


- [原理](how.md)

## Install 

```
[sudo] npm install -g moa-console
```


## Usage

- mc
- moa-console


```
➜  moa-api git:(master) mc
/Users/sang/workspace/moa/moa-console
Users/sang/workspace/moa/moa-console
提醒:debug状态连接数据库:
mongodb://127.0.0.1:27017/xbm-wechat-api

[2015-08-06 00:12:59.159] [INFO] [default] - undefined

[2015-08-06 00:12:59.161] [INFO] [default] - Welcome to the Moa console.
[2015-08-06 00:12:59.161] [INFO] [default] - undefined

Available Entity: 
  - Todo
  - User
Moa> [mongoose log] Successfully connected to:  NaN
mongoose open success

undefined
Moa> .list
Available Entity: 
  - Todo
  - User
Moa> User.find({},function(err,doc){console.log(doc)})
undefined
Moa> [ { _id: 55c19fd43dac1deb08c43888,
    username: '12',
    password: '2',
    avatar: '23',
    phone_number: '23',
    address: '',
    __v: 0 },
  { _id: 55c19fde3dac1deb08c43889,
    username: 'sang',
    password: '000000',
    avatar: '',
    phone_number: '',
    address: '',
    __v: 0 } ]

undefined
Moa> 
```
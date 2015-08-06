# nodejs里的repl

## 什么是REPL?

REPL（Read-Eval-Print Loop） 中文的话有翻译成“交互式解释器”或“交互式编程环境”的。不过我觉得不用翻译，直接REPL就好了，这样的术语，翻译成中文后，读者更难理解。下面是对 REPL 的解释：

```
A Read-Eval-Print-Loop (REPL) is available both as a standalone program and easily includable in other programs. REPL provides a way to interactively run JavaScript and see the results. It can be used for debugging, testing, or just trying things out.
```

交互式解释器（REPL）既可以作为一个独立的程序运行，也可以很容易地包含在其他程序中作为整体程序的一部分使用。REPL为运行JavaScript脚本与查看运行结果提供了一种交互方式，通常REPL交互方式可以用于调试、测试以及试验某种想法。

基本上所有的脚本语言有REPL的。

## Nodejs的REPL

https://iojs.org/api/repl.html


- 稳定等级 Stability: 2 - Stable


A Read-Eval-Print-Loop (REPL) is available both as a standalone program and easily includable in other programs. The REPL provides a way to interactively run JavaScript and see the results. It can be used for debugging, testing, or just trying things out.

以上的意思是说node有一个很好的repl环境，可以用于调试、测试或尝试其他更有意思的东西

## 最简单的例子

```
// repl_test.js
var repl = require("repl"),
    msg = "message";

repl.start("> ").context.m = msg;
```

然后

```
➜  moa-console git:(master) ✗ node repl_test.js 
> m
'message'
> 
```

## 实例

如果用过rails，一定很喜欢rails console，它可以直接调用AR里的各种方法，非常简单的就可以测试对db的各种操作。那么作为一个nodejs开放，是否也可以实现一样的功能呢？

需求

- 加载app/models下的所有mongoose模型
- .list命令打印出所有的可用实体
- 执行User.find({},function(err,doc){console.log(doc)})可以查出具体内容

### 加载模型为global对象

    var models = requireDirectory(module, model_path);
  
    console.log('Available Entity: ');
    // 此处没有做递归，可能有bug
    for(var i in models){
      var name = Inflector.camelize(i);
      console.log('  - ' + name);
      global[name] = models[i];
    }
    
这样就可以在repl里使用，这些对象了

比如user.js会变成User类，这里有一个小机器，即  

    Inflector.camelize(i)

让单词的首字母大写


### 测试

所有的global的对象都会在repl的上下文里，所以可以直接执行

```
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

讨厌的点

- 不能分行
- 回调太痛苦

需要给mongoose扩展一些Sync方法，不然测试起来会死人的。

### .list命令打印出所有的可用实体

    repl.commands['.list'] = {
      help: 'Show Available Entity',
      action: function() {
        var models = requireDirectory(module, model_path);
  
        console.log('Available Entity: ');
        // 此处没有做递归，可能有bug
        for(var i in models){
          var name = Inflector.camelize(i);
          console.log('  - ' + name);
          global[name] = models[i];
        }
      
        repl.displayPrompt();
      }
    };

这个实际和上面的代码是一样，唯一不一样的是repl.command定义自己的命令

在repl里内置`.help`命令

```
Moa> .help
.break	Sometimes you get stuck, this gets you out
.clear	Break, and also clear the local context
.exit	Exit the repl
.help	Show repl options
.history	Show the history
.list	Show Available Entity
.load	Load JS from a file into the REPL session
.save	Save all evaluated commands in this REPL session to a file
Moa> 
```

上面定义`.list`命令，所以才有，这样大家可以自己扩展自己想要实现的命令


## 使用历史记录

历史记录即可以向上，向下翻查历史命令

repl有具体实现，参见 https://github.com/tmpvar/repl.history


原理也很简单

```
function history(repl, file) {

  try {
    var stat = fs.statSync(file);
    repl.rli.history = fs.readFileSync(file, 'utf-8').split('\n').reverse();
    repl.rli.history.shift();
    repl.rli.historyIndex = -1;
  } catch (e) {}

  var fd = fs.openSync(file, 'a'),
    reval = repl.eval;

  repl.rli.addListener('line', function(code) {
    if (code && code !== '.history') {
      fs.write(fd, code + '\n');
    } else {
      repl.rli.historyIndex++;
      repl.rli.history.pop();
    }
  });

  process.on('exit', function() {
    fs.closeSync(fd);
  });

  repl.commands['.history'] = {
    help: 'Show the history',
    action: function() {
      var out = [];
      repl.rli.history.forEach(function(v, k) {
        out.push(v);
      });
      repl.outputStream.write(out.reverse().join('\n') + '\n');
      repl.displayPrompt();
    }
  };
}
```

### 对行内内容进行特殊处理

```
repl.rli.addListener('line', function(code) {
  if (code && code !== '.history') {
    fs.write(fd, code + '\n');
  } else {
    repl.rli.historyIndex++;
    repl.rli.history.pop();
  }
});
```

这样就可以干很多很多坏事了

### 代码

https://github.com/moajs/moa-console

## 官方推荐2个小例子

- https://gist.github.com/TooTallNate/2209310
- https://gist.github.com/TooTallNate/2053342
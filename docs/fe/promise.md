# Promise
>JavaScript 解决异步编程有两种主要方式：事件模型和回调函数。但是随着业务越来越复杂，这两种方式已经不能满足开发者的需求了，Promise 可以解决这方面的问题。

>为了更好的理解 Promise 是如何工作的，我们先来了解一下传统的异步编程的方式。

# 异步编程的方式
#### 1. 事件模型：

```
let button = document.getElementId("my-btn");
button.onclick = function() {
  console.log("Hello");
}
```

任务的执行不取决于代码的顺序，而取决于某个事件是否发生。上面代码中，console.log("Hello") 直到 button 被点击后才会被执行。当 button 被点击，赋值给 onclick 的函数就被添加到作业队列的尾部，并在队列前部所有任务结束之后再执行。

事件模型适用于处理简单的交互，若将多个独立的异步调用连接在一起，必须跟踪每个事件的事件目标，会使程序更加复杂，运行流程会变得很不清晰。

#### 2. 回调函数
我们来看一下比较经典的使用 jsonp 解决跨域问题的示例：

```
function callback (res) {
  document.getElementById('d1').innerHTML = res.result.address
  console.log('Your public IP address is: ', res)
}
function jsonp (lat, lng) {
  let src = `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=yourKey&output=jsonp&callback=callback`
  let script = document.createElement('script')
  script.setAttribute("type","text/javascript")
  script.src = src;
  document.body.appendChild(script)
}
jsonp(39.92, 116.43)
```

初看这种模式运作得相当好，简单、容易理解，但你可能会迅速的发现这样的模式不利于代码的阅读和维护，各个部分之间耦合度太高，容易陷入回调地狱。就像这样：

```
method1(function(err, result) {
  if (err) {
    throw err
  }

  method2(function(err, result) {
    if (err) {
      throw err
    }

    method3(function(err, result) {
      if (err) {
        throw err
      }

      method4(function(err, result) {
        if (err) {
          throw err
        }

        method5(result)
      })
    })
  })
})
```
Promise 能大幅度改善这种情况。我们来看下Promise 是如何实现的：
```
let promise = new Promise((resolve, reject) => {
  // ... method 1 some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})
promise.then((value) => {
  // method 2 some code
}).then((value) => {
  // method 3 some code
}).then((value) => {
  // method 4 some code
}).then((value) => {
  // method 5 some code
}).catch((err) => {
  // some err code
})
```
是不是清晰很多？是不是很神奇？接下来一起来学习一下 Promise 吧！

# Promise 相关知识

## 1. Promise 的基础知识
我们先来看下 Promise 的方法有哪些：

>Promise.Prototype.then()
Promise.Prototype.catch()
Promise.Prototype.finally()
Promise.all()
Promise.race()
Promise.resolve()
Promise.reject()
Promise.try()

Promise 函数的执行，都是依赖于状态的改变，这三种状态要记牢哦：
>
Pending：进行中
Fulfilled：已成功
Rejected：已失败

Promise 优点：
>
1）对象的状态不受外界影响。
2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。
3）将异步操作以同步操作的流程表达出来，避免了层层嵌套回调函数。
4）提供统一的接口，使得控制异步操作更加容易。

Promise 缺点：
>
1）无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
2）如果不设置回调函数，Promise 内部抛出的错误，不会反映到外部。
3）当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

了解了 Promise 的方法，3种状态以及特点和优缺点之后，接下来我们来看一下 Promise 是怎么使用的。

## 2. Promise 的基本用法

我们来创造一个读取文件的 Promise 实例：
```
const fs = require('fs')
const path = require('path')

function readFile (filename) {
  return new Promise (function (resolve, reject) {
    // reject(new Error('err'))
    //触发异步操作
    fs.readFile(filename, {encoding: 'utf8'}, function (err, contents) {

      // 检查错误
      if (err) {
        reject(err)
        return
      }

      //读取成功
      resolve(contents)
    })
  })
}
let promise = readFile(path.resolve(__dirname, '../json/a.json'))
```

上述实例中 resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

#### 2.1 Promise.Prototype.then()

Promise 实例生成以后，就可以用 then 方法来分别指定 resolved 状态和 rejected 状态的回调函数了。
```
promise.then(function (contents) {
  // 完成
  console.log(contents)
  return(contents)
}, function (err) {
  // 失败
  console.log(err.message)
})
```
我们可以看到，then 方法接受两个回调函数作为参数；
第一个回调函数在 Promise 对象的状态变为 resolved 时调用；
第二个回调函数在 Promise 对象的状态变为 rejected 时调用；
其中，第二个函数是可选的。这两个函数都接受 Promise 对象传出的值作为参数。

Promise.then 方法每次调用，都返回一个新的 Promise 对象，所以支持链式写法。

```
let taskA = (value) => {
  console.log("Task A")
  console.log(value)
  return value
}

let taskB = (value) => {
  console.log("Task B")
  console.log(value)
}

promise
.then(taskA)
.then(taskB)
.catch((err) => {
  console.log(err.message)
})

```

#### 2.2 Promise.Prototype.catch()
Promise.prototype.catch 方法是 .then(null, rejection) 的别名，相当于 then 函数的第一个参数传入 null，第二个参数传入发生错误时的回调函数。
```
promise.then(function(value) {
  // 成功
  console.log(value)
}).catch(function (err) {
  // 失败
  console.log(err.message)
})
```

#### 2.3 Promise.Prototype.finally()
finally 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的，目前大部分浏览器还不支持，不过可以自己实现。

finally 方法的实现：
```
Promise.prototype.finally = function (callback) {
  let P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
```

finally 方法的使用：

```
promise
.then((contents) => {
  console.log(contents)
  return contents
})
.catch((err) => {
  console.log(err.message)
})
.finally(() => {
  console.log('finally')
})
```

#### 2.4 Promise.all()
Promise.all 方法可以将多个 Promise 实例，包装成一个新的 Promise 实例。
```
const p = Promise.all([p1, p2, p3]);
```
新的 Promise p 的状态由 p1、p2、p3 决定，只有当 p1、p2、p3 的状态都变成了 fulfilled，p 的状态才会变成 fulfilled；只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成了 rejected。

注意，如果作为参数的 Promise 实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发Promise.all()的 catch 方法的。

如果 p2 有自己的 catch 方法，就不会调用 Promise.all() 的 catch 方法。

```
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```

如果 p2 没有自己的 catch 方法，就会调用 Promise.all() 的 catch 方法。

```
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错了
```

#### 2.5 Promise.race()
Promise.race 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。
```
const p = Promise.race([p1, p2, p3]);
```
新的Promise p，只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 p 的回调函数。

```
function timerPromisefy(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(delay)
    }, delay)
  })
}

Promise.race([
  timerPromisefy(10),
  timerPromisefy(20),
  timerPromisefy(30)
]).then(function (values) {
  console.log(values) // 10
})

```

#### 2.6 Promise.resolve()

有时需要将现有对象转为 Promise 对象，Promise.resolve 方法就起到这个作用，返回一个 fulfilled 状态的 Promise 对象。
```
const promise = Promise.resolve('hello');
promise.then(function(value){
    console.log(value);
});

// 相当于
const promise = new Promise(resolve => {
   resolve('hello');
});
promise.then((value) => {
  console.log(value)
})

```

#### 2.7 Promise.reject()

Promise.reject(reason) 方法也会返回一个新的 Promise 实例，该实例的状态为 rejected。
```
const p = Promise.reject('出错了');
p.then(null, (value) => {
  console.log(value)
})

// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
p.then(null, (value) => {
  console.log(value)
})

```

#### 2.8 Promise.try()

让同步函数同步执行，异步函数异步执行。
```
const f = () => console.log('now');
Promise.try(f);
console.log('next');
// now
// next
```

# 应用

### 异步加载图片
实现方法：
```
function loadImageAsync(url) {
  return new Promise(function(resolve, reject) {
    const image = new Image()

    image.onload = function() {
      resolve(image)
    }

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url))
    }

    image.src = url
  })
}
```
调用：
```
loadImageAsync('图片路径').then((value) => {
  document.getElementById('d1').appendChild(value)
}).catch((err) => {
  console.log(err.message)
})
```
### 异步加载 js
实现方法：
```
let loadScript = function () {
  return function _loadScript(url, callBack) {
    return new Promise(function (resolve) {
      let script = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {
        // 兼容IE的script加载事件
        script.onreadystatechange = function () {
          // loaded ： 下载完毕 complete： 数据准备完毕。这两个状态ie可能同时出现或者只出现一个
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            // 防止加载两次
            script.onreadystatechange = null
            callBack()
            // 把函数传递下去，保证能顺序加载js
            resolve(_loadScript)
          }
        }
      } else {
        script.onload = function () {
          callBack()
          resolve(_loadScript)
        }
      }
      script.src = url
      document.head.appendChild(script)
    })
  }
}()
```
调用：
```
loadScript('http://code.jquery.com/jquery-3.2.1.min.js ', () => {})
    .then(() => {
      $("#d1").on('click', () => {alert(1)})
    }).catch((err) => {
      console.log(err)
    })
```

### request 请求的封装
```
import axios from './axios'
import qs from 'qs'

const config = {
  time: +new Date() + '',
  timeout: 6000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    time: new Date().getTime()
  }
}

function checkResponse (response, notice) {
  return new Promise((resolve, reject) => {
    let code = Number(response.code)
    if (code === 0 || code === 200 || code === 2000 || code === 1 || code === 2 || code === '0' || code === 109) {
      resolve(response)
    } else {
      if (notice) {
        // 提示信息
        console.log('response-notice', notice)
      }
      reject(response)
    }
  })
}

function fixURL (url, type) {
  let result = ''
  switch (type) {
    case 'r':
      result += `/api/v2${url}`
      break
  }
  return result
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {object} [options]         The options we want to pass to axios
 * @param  {string} [options.url]     请求的url地址（必须）
 * @param  {string} [options.method]  请求方式， get or post，默认post
 * @param  {object} [options.data]    请求参数
 * @param  {number} [options.timeout] 请求超时时间
 * @param  {boolean} [options.notice] 请求失败是否显示提示，默认true
 * @return {object}                   promise对象
 */
function request (options = {}) {
  let {
    url,
    method,
    data,
    timeout,
    headers,
    type,
    notice
  } = options

  method = method || 'post'
  data = data || {}
  type = type || 't'
  timeout = timeout || config.timeout
  headers = Object.assign({}, config.headers, headers)
  notice = notice === undefined ? true : notice

  let result = {}
  if (method === 'get') {
    result = new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: fixURL(url, type),
        params: data,
        timeout,
        headers
      })
        .then((res) => {
          checkResponse(res.data, notice).then((data) => {
            resolve(data)
          })
            .catch((data) => {
              reject(data)
            })
        })
        .catch((data) => {
          reject(data)
        })
    })
  } else if (method === 'post') {
    result = new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: fixURL(url, type),
        data: headers['Content-Type'] === 'application/x-www-form-urlencoded' ? qs.stringify(data) : data,
        timeout,
        headers
      })
        .then((res) => {
          checkResponse(res.data, notice).then((data) => {
            resolve(data)
          })
            .catch((data) => {
              reject(data)
            })
        })
        .catch((data) => {
          reject(data)
        })
    })
  }
  return result
}

export default request

```

## 附 Promise 代码实现
```
// 判断变量否为function
const isFunction = variable => typeof variable === 'function'
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor (handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    // 添加状态
    this._status = PENDING
    // 添加状态
    this._value = undefined
    // 添加成功回调函数队列
    this._fulfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueues = []
    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this)) 
    } catch (err) {
      this._reject(err)
    }
  }
  // 添加resovle时执行的函数
  _resolve (val) {
    const run = () => {
      if (this._status !== PENDING) return
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while (cb = this._fulfilledQueues.shift()) {
          cb(value)
        }
      }
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while (cb = this._rejectedQueues.shift()) {
          cb(error)
        }
      }
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
        当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */
      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value
          this._status = FULFILLED
          runFulfilled(value)
        }, err => {
          this._value = err
          this._status = REJECTED
          runRejected(err)
        })
      } else {
        this._value = val
        this._status = FULFILLED
        runFulfilled(val)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  // 添加reject时执行的函数
  _reject (err) { 
    if (this._status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED
      this._value = err
      let cb;
      while (cb = this._rejectedQueues.shift()) {
        cb(err)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  // 添加then方法
  then (onFulfilled, onRejected) {
    const { _value, _status } = this
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      // 封装一个成功时执行的函数
      let fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value)
          } else {
            let res =  onFulfilled(value);
            if (res instanceof MyPromise) {
              // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      // 封装一个失败时执行的函数
      let rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
              let res = onRejected(error);
              if (res instanceof MyPromise) {
                // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                res.then(onFulfilledNext, onRejectedNext)
              } else {
                //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                onFulfilledNext(res)
              }
          }
        } catch (err) {
          // 如果函数执行出错，新的Promise对象的状态为失败
          onRejectedNext(err)
        }
      }
      switch (_status) {
        // 当状态为pending时，将then方法回调函数加入执行队列等待执行
        case PENDING:
          this._fulfilledQueues.push(fulfilled)
          this._rejectedQueues.push(rejected)
          break
        // 当状态已经改变时，立即执行对应的回调函数
        case FULFILLED:
          fulfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
  // 添加catch方法
  catch (onRejected) {
    return this.then(undefined, onRejected)
  }
  // 添加静态resolve方法
  static resolve (value) {
    // 如果参数是MyPromise实例，直接返回这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
  // 添加静态reject方法
  static reject (value) {
    return new MyPromise((resolve ,reject) => reject(value))
  }
  // 添加静态all方法
  static all (list) {
    return new MyPromise((resolve, reject) => {
      /**
       * 返回值的集合
       */
      let values = []
      let count = 0
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(res => {
          values[i] = res
          count++
          // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
          if (count === list.length) resolve(values)
        }, err => {
          // 有一个被rejected时返回的MyPromise状态就变成rejected
          reject(err)
        })
      }
    })
  }
  // 添加静态race方法
  static race (list) {
    return new MyPromise((resolve, reject) => {
      for (let p of list) {
        // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
        this.resolve(p).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      }
    })
  }
  finally (cb) {
    return this.then(
      value  => MyPromise.resolve(cb()).then(() => value),
      reason => MyPromise.resolve(cb()).then(() => { throw reason })
    );
  }
}


```
参考文章
[Promise 官网](https://www.promisejs.org/)
[ECMAScript 6 入门](http://es6.ruanyifeng.com/?search=promise&x=0&y=0#docs/promise)
[Promise 源码详解](https://juejin.im/post/5b32f552f265da59991155f0)
[Promise 实现原理（附源码）](https://juejin.im/post/5b83cb5ae51d4538cc3ec354)
[es6-promise-try npm](https://www.npmjs.com/package/es6-promise-try)
[JavaScript Promise：简介](https://developers.google.com/web/fundamentals/primers/promises)
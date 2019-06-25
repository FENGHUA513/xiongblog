# 柯里化函数的理解与应用
## 1.先看一个最简单的例子
```js
function add (x, y) {
  return x + y
}

var result = add(1, 2)
console.log(result) // 3
// 改造一下（柯里化）
function curryAdd (x) {
	return function(y) {
  	return x + y
  }
}
var curryResult = curryAdd(1)(2)
console.log(curryResult) // 3
```
改造后curryAdd()实际上就是把add函数的x，y两个参数变成了先用一个函数接收x然后返回一个函数去处理y参数，就是只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

## 2.函数柯里化的好处---参数复用      代码实例

```js
// 封装一个简单的ajax
function ajax(type, url) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send({});
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com')
ajax('POST', 'www.test2.com')
ajax('POST', 'www.test3.com')

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com');

//curry 的这种用途可以理解为：参数复用。

```
## 3. 实现curry

```js
// 第一版（bind 的实现也是函数柯里化的应用， 区别是 bind 改变了this指向）
Function.prototype.bind2 = function(context = window) {
	if (typeof(this) !== 'function') {
		throw new TypeError('error')
	}
	var that = this // this指调用bind的函数 
	var args = [...arguments].slice(1) // bind参数
	return function() {
		that.apply(context, args.concat([...arguments]))
	}
}

//  bind的简单实现仅供参考 对比一下curry初级版本
var curry = function (fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat([].slice.call(arguments));
        return fn.apply(this, newArgs);
    };
};
// 应用
function add(a, b) {
    return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry() // 3
//或者
var addCurry = curry(add, 1);
addCurry(2) // 3
//或者
var addCurry = curry(add);
addCurry(1, 2) // 3
addCurry(2)(1) // 报错
```
上述第一个版本已经能简单实现curry的功能了 但是这样使用会失败   addCurry(2)(1) // 报错

## 4.升级版本
```js
function curry (fn) {
  var length = fn.length
  var args = [].slice.call(arguments, 1)
  args = args.length == 1 && args[0].constructor == Array ? args[0] : args
  return function (..._args) {
    _args = args.concat(_args)
    // debugger
    if (_args.length < length) {
    	return curry.call(this, fn, _args)
    } else {
    	return fn.apply(this, _args)
    }
  }
}

// 应用
var add  = curry(function(a, b, c) {
	return a + b + c
})
var result = add(1)(2)(3)  // 6
var result = add(1,2,3)  // 6
var result = add(1)(2, 3) // 6

// 还可以这么写
var add  = curry(function(a, b, c) {
	return a + b + c
}, 1)
var result = add(2)(3)  // 6
var result = add(2, 3)  // 6


// 用这个实现上述 ajax 函数柯里化的效果
var ajaxCurry = curry(function(type, url){
	var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send({});
}, 'POST');

// 以 POST 类型请求数据
var result = ajaxCurry('www.test.com');
var result1 = ajaxCurry('www.test.com1');
// 或者将 post 这么传
var ajaxCurry = curry(function(type, url){
	var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send({});
});
var post = ajaxCurry('POST')
var result = post('www.test.com')  等价于  var result = ajaxCurry("POST")('www.test.com')
var result1 = post('www.test.com1'); 等价于  var result1 = ajaxCurry("POST")('www.test.com1')

```
## 5. 一道经典面试题 

```js
// 实现一个 add 方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;

// 根据柯里化函数的特性（参数收集）结合 reduce 方法实现
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = [].slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function() {
    _args.push(...arguments);
    return _adder;
  };

  // 利用 toString 隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
    	return a + b;
    }, 0);
  }
  return _adder;
}

// 不考虑柯里化 另一种方法实现
function add(num){
    var sum=num,    
    tmp=function(v){
      sum+=v;
      return tmp
    };
    tmp.toString=function(){
       return sum
    };   
    return tmp
}

```
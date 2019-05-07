# js面试题
## 实现new
```js
function New (f) {
  var obj = {'__proto__': f.prototype}
  f.call(obj)  // 将构造函数的this指向obj
  return obj
}
function F () {
  this.name = 'meili',
  this.sayHellow = function() {
  	console.log('hellow')
  }
}
var f = New (F)
console.log(f.name) // meili
f.sayHellow() // hellow


```
## 实现call

```js
Function.prototype.call2 = function(context = window) {
	if (typeof(this) !== 'function') {
		throw new TypeError('error')
	}
	context.fn = this
	var args = [...arguments].slice(1)
	var result = context.fn(...args)
	delete context.fn
	return result
}
```
## 实现apply

```js
Function.prototype.apply2 = function(context = window) {
	if (typeof(this) !== 'function') {
		throw new TypeError('error')
	}
	context.fn = this
	let result
	if (arguments[1]){
		result = context.fn(...arguments[1])
	} else {
		result = context.fn()
	}
	return result
}
```
## 实现bind
```js
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
```
## 实现深度拷贝
```js
function deepcopy (obj) {
	var result;
	if (typeof(obj) == 'object') {
		result = obj.constructor == Array ? [] : {}
		for (let i in obj) {
			result[i] = typeof(obj[i]) == 'object' ? deepcopy(obj[i]) : obj[i]
		}
	} else {
		result = obj
	}
	return result
}
```
## 柯里化 curry
```js
// 柯里化
add(1,2,3)
var addCurry = curry(add)
addCurry(1, 2, 3)
addCurry(1, 2)(3)
addCurry(1)(2)(3)
```

```js
function curry (fn, args) {
    var length = fn.length
    var args = args || []
    return function (..._args) {
        _args = args.concat(_args)
        if (_args.length < length) {
            return curry.call(this, fn, _args)
        } else {
            return fn.apply(this, _args)
        }
    }
}
```
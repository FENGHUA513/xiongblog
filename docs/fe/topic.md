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
console.log(f.sayHellow) // hellow


```
## 实现call

```js
Function.prototype.call2 = function(context = window) {
	context.fn = this
	var args = [...arguments].slice(1)
	var result = context.fn(...args)
	delete concontexttent.fn
	return result
}
```
## 实现apply

```js
Function.prototype.apply2 = function(context = window) {
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
# promise 兼容低版本浏览器

## 方法一： 不需要安装依赖
```js
    if (typeof Promise === 'undefined') {
        require('promise/lib/rejection-tracking').enable();
        window.Promise = require('promise/lib/es6-extensions.js');
    }
```

## 方法二： 安装 babel-polyfill 与 es6-promise 依赖

```js
    if (typeof Promise === 'undefined') {
        require('babel-polyfill')
        var Promise = require('es6-promise')
        Promise.polyfill()
    }    

```
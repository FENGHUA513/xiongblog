# TypeScript

> typescript简介 -> 项目搭建(react)

## 前言

为什么要用TypeScript：ts是js的超集，具有非常好用的静态类型检查功能，降低维护成本，在大型项目中尤其好用。

为什么不使用现成的脚手架：脚手架配置的东西较多，不喜欢直接用脚手架，希望从零开始配置慢慢添加扩展，可以学到更多。


## 一、typescript 简单介绍

关于 TypeScript 是什么（摘自知乎）
> 
TypeScript 是 JavaScript 的强类型版本。然后在编译期去掉类型和特有语法，生成纯粹的 JavaScript 代码。由于最终在浏览器中运行的仍然是 JavaScript，所以 TypeScript 并不依赖于浏览器的支持，也并不会带来兼容性问题。

TypeScript最被看重的就是静态类型检查功能  那么静态类型检查的作用如何（摘自知乎）
> 静态类型检查可以避免很多不必要的错误, 不用在调试的时候才发现问题 (其实有的时候根本调试不出问题, 只是默默地把坑挖了, 说不定埋的就是个炸弹, 之前用 TypeScript 重写应用的服务器端程序, 写完之后就发现了不少暂时没有影响到运行的严重问题).

#### ts静态类型检查的使用

**部分基础类型**

```ts
let isDone: boolean = false;
let decLiteral: number = 6;
let name: string = "abc";
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
let u: undefined = undefined;
let n: null = null;
```
**元组 Tuple**
元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string和number类型的元组。

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

**枚举 enum**
enum类型是对JavaScript标准数据类型的一个补充，枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```ts
enum Color {Red = 1, Green = 2, Blue}
let colorName: string = Color[2];

alert(colorName);  // 显示'Green'因为上面代码里它的值是2
```

**Any**
有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any类型来标记这些变量：

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

**Void**
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void

```ts
function warnUser(): void {
    alert("This is my warning message");
}
```

**类型断言**
有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你，程序员，已经进行了必须的检查。

类型断言有两种形式。 其一是“尖括号”语法：

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```
另一个为as语法：
```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

**类型断言**
TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

下面通过一个简单示例来观察接口是如何工作的：

```ts
function printLabel(labelledObj: { label: string }) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

类型检查器会查看printLabel的调用。 printLabel有一个参数，并要求这个对象参数有一个名为label类型为string的属性。 需要注意的是，我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。 然而，有些时候TypeScript却并不会这么宽松，我们下面会稍做讲解。

下面我们重写上面的例子，这次使用接口来描述：必须包含一个label属性且类型为string：

```ts
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```
LabelledValue接口就好比一个名字，用来描述上面例子里的要求。 它代表了有一个 label属性且类型为string的对象。 需要注意的是，我们在这里并不能像在其它语言里一样，说传给 printLabel的对象实现了这个接口。我们只会去关注值的外形。 只要传入的对象满足上面提到的必要条件，那么它就是被允许的。

还有一点值得提的是，类型检查器不会去检查属性的顺序，只要相应的属性存在并且类型也是对的就可以。

**函数**
某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void

```ts
function add(x, y) {
    return x + y;
}

function add(x: number, y: number): number {
    return x + y;
}
```

我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。

```ts
// 可选参数
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right


// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
TypeScript类型检查的使用暂且介绍这些，基本够用，具体参看文档(https://www.tslang.cn/docs/home.html)


## 二、搭建一个 react + ts 的 Demo

**1、安装最新的webpack**

```js
npm install -D webpack
```

这里我们还需要安装webpack-cli, 
(这是webpack4.+的，这里不做详解，有兴趣的可以到webpack官网学习https://webpack.docschina.org/)
```js
npm install -D webpack-cli
```

**2、接着安装react和其他相关的依赖**
```js
npm install -g typescript
npm install --save-dev react react-dom @types/react @types/react-dom
npm install --save-dev ts-loader
npm link typescript
npm install --save-dev webpack-dev-server
npm install -D "babel-loader@^8.0.0-beta" @babel/core @babel/preset-react
```
**3、生成typescript的配置文件**

```js
tsc --init
```
```json
{
  "compilerOptions": {
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es5",
    "jsx": "react"
  }
}
```

**4、创建src目录，以及在src目录下创建components目录，并且创建文件**
- src/index.tsx 和 src/components/Ant.tsx

index.tsx代码如下：
```tsx
import * as React from "react"
import * as ReactDOM from "react-dom"

import { Ant } from "./components/Ant"

ReactDOM.render(
  <Ant name="XXX" company="mobike" />,
  document.getElementById("app")
)
```

Ant.tsx代码如下：：
```tsx
import * as React from "react"

export interface AntProps {
  name: string
  company: string
}

export class Ant extends React.Component<AntProps, {}> {
  render() {
    return (
      <h1>
        Hello, I am {this.props.name}, I in {this.props.company} now!
      </h1>
    )
  }
}
```

**5、根目录下创建webpack.config.js和index.html:**

webpack.config.js配置如下：
```js
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    //入口文件的路径
    entry: "./src/index.tsx",
    output: {
        //打包的输出路径
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    // 添加需要解析的文件格式
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: '蚂蚁',
            template: './index.html',
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
    },
    // 启用sourceMap
    devtool: "source-map",
}
```
index.html代码如下：

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello Ant</title>
    </head>
    
    <body>
        <div id="app"></div>
    </body>
</html>
```
接着直接运行webpack-dev-server, 在浏览器直接访问localhost:8080,这里已经配置了实时更新了。
项目具体见（https://mobike.io/mobike-fe/react-ts-demo）

## 三、Demo升级

具体步骤较多，且调试过程较繁琐，此处只介绍大致过程与其中部分踩坑点。具体参见项目（https://mobike.io/mobike-fe/react-ts-kit）

### 开发环境优化
- webpack-dev-server 替换为 middleware
- webpack配置拆分
- 保持热更新
- 添加 自动打开浏览器
- 添加 打包分析

根目录下新建 build 文件夹
```js
// webpack.config.base.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //入口文件的路径
    entry: {
        app: [path.resolve(__dirname, '../src/index.tsx')]
    },
    output: {
        //打包的输出路径
        path: path.resolve(__dirname, "../dist"),
        publicPath: '/',
        filename: "[name].js",
        chunkFilename: '[name].[chunkhash:8].js'
    },
    // 添加需要解析的文件格式
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
        modules: [
            path.join(__dirname, '../src'),
            'node_modules'
        ],
        alias: {
            "components": path.resolve(__dirname, "../src/components"),
            "utils": path.resolve(__dirname, "../src/utils"),
            "pages": path.resolve(__dirname, "../src/pages")
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../src')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {}
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Demo',
            template: './index.html',
        })
    ]
}
```

```js
// webpack.config.dev.js
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    entry:{
        app: [
            // 'eventsource-polyfill',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=100000&reload=true',
            'webpack/hot/only-dev-server'
        ]
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: ["style-loader", "css-loader",
            {
                loader: 'less-loader',
                query: {
                    javascriptEnabled: true
                }
            }]
        }]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new BrowserSyncPlugin({
            host: '127.0.0.1',
            port: 9090,
            proxy: 'http://127.0.0.1:3336/',
            logConnections: false,
            notify: false
        }, {
            reload: false
        })
    ]
})
```

```js
// webpack.config.prod.js
const webpack = require('webpack'),
    path = require("path"),
    merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.config.base'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ["css-loader", {
                    loader: 'less-loader',
                    query: {
                        javascriptEnabled: true
                    }
                }]
            }) 
        }]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {
            root: path.resolve(__dirname, '..'),
            verbose: false
        }),
        new CopyWebpackPlugin([ // 复制高度静态资源
            {
                context: path.join(__dirname, 'src/lib'),
                from: '**/*',
                ignore: ['*.md']
            }
        ]),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 30000
        }),
        new ExtractTextPlugin('[name].css', {
            allChunks: true // 若要按需加载 CSS 则请注释掉该行
        }),
        new BundleAnalyzerPlugin()
    ],
    //压缩js
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                mangle: {
                  safari10: true
                }
              },
              cache: true,
              parallel: true
            }),
        ]
    }
})

```

```js
// dev.js
const webpack = require('webpack')
const express = require('express')
const app = express();

const config = require('./webpack.config.dev.js')
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    stats: {
        colors: true,
        chunks: false
    }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.listen(3336, "localhost", function(err) {
    err && console.log(err);
});

```

```js

// prod.js
const fs = require('fs'),
    path = require('path'),
    webpack = require('webpack'),
    config = require('./webpack.config.prod');

webpack(config, function(err, stats) {
    // show build info to console
    console.log(stats.toString({ chunks: false, color: true }))

    // save build info to file
    fs.writeFile(
        path.join(__dirname, '../dist/__build_info__'),
        stats.toString({ color: false })
    );
});
```

**踩坑点**
- error TS1005: ';' expected： 更新为最新版的typescript
- 路径错误： 根据错误提示修改

### 添加路由 react-router-dom ^4.xx
- 安装依赖
- src下新建pages 文件夹，并创建几个页面
- 配置路由



```tsx
import * as React from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import {Test} from './pages';

export interface SiderLayoutStates {
    collapsed: Boolean
}

class SiderLayout extends React.Component<{}, SiderLayoutStates> {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        return (
            <Router basename='view'>
                <div className='bzw-layout'>
                    <div class='menu'>
                       <Link to="/"><Icon type="pie-chart" /><span>home</span></Link>
                       <Link to="/about"><Icon type="desktop" /><span>About</span></Link>
                       <Link to="/topics"><Icon type="inbox" /><span>Topics</span></Link>
              
                    </div>
                    <div class='content' >
                        <Route exact path="/" component={Test.Home}/>
                        <Route path="/about" component={Test.About}/>
                        <Route path="/topics" component={Test.Topics}/>
                    </div>
                </div>
            </Router>
        );
    }
}    

export default SiderLayout
```
**踩坑点**
原地刷新 Cannot Get（404）
原因：这个问题一般是两方面原因造成：
- react-router路前端由配置；
- webpack-dev-server服务配置；
即：路由是在前端定义的，但是服务是node起的。所以在开发环境中 路由找不到node服务上对应的文件。
解决过程： webpack-dev-server提供historyApiFallback配置解决此问题，但是我们已经更新为 middleware
此方案不可用。最终更改 dev.js

```js
app.use('*', (req, res, next) => {
    const filename = path.resolve(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
});
```

### 引入antd

样式引入时出现了问题，不生效。此解决比较耗时，起初没有找到靠谱的资料，antd官网只有基于现有脚手架的，因非ts项目中一般借由babel引入，所以在https://github.com/ant-design/babel-plugin-import/issues/113 中找到了方法。
然后根据 ts-import-plugin 文档 配合awesome-typescript-loader进行了配置。

```js
{
    test: /\.tsx?$/,
    loader: 'awesome-typescript-loader',
    options: {
        getCustomTransformers: () => ({
        before: [ tsImportPluginFactory({
            libraryName: 'antd',
            libraryDirectory: 'lib',
            style: true
        }) ]
        }),
        exclude: /node_modules/
    }
}
```
其后解析less报错  javascriptEnabled
查找文档 并改用webpack最新写法解决
```js
{
    test: /\.(less|css)$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ["css-loader", {
            loader: 'less-loader',
            query: {
                javascriptEnabled: true
            }
        }]
    }) 
}
```

### 添加本地mock 并支持 测试环境切换
添加文件夹
更新 dev.js
if (proxyConf.MOCK) {
    for (const name in mockRoutes) {
        const s = name.split(' ')
        const method = s[0].toLowerCase()
        const url = s[1]
        const mockFile = mockRoutes[name]
        app[method](url, (function (mockFile) {
            return function (req, res) {
                res.setHeader('Content-Type', 'application/json')
                res.send(fs.readFileSync(path.join(__dirname, '../mock/', mockFile)))
            }
        })(mockFile))
    }
} else {
    const { HOST  = '线上地址' } = proxyConf
    app.use('/api', proxy(HOST));
}

**踩坑**
因之前解决路由问题时 
```js
app.use('*', (req, res, next) => {
    // 一些处理
});
```
拦截了 api到mock的转发
简单处理方法，将mock的转发放在路由处理的前面，但是感觉不太好。
最终方案：路由添加前缀
```html
<Router basename='view'></Router>
```

```js
app.use('/view', (req, res, next) => {
    // 一些处理
});
```

### 添加 SplitChunksPlugin axios
详细见项目中

## 四、总结

本文对typescript特性进行了简单的介绍，并以react + typescript进行了简单的项目搭建已经升级，增进了对 typescript 一些了解。

~全文完，文中如有不妥之处，欢迎批评指正~


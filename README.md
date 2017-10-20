## 更新内容

* 修复上传时图片不能收缩的 BUG

* 增加 php 自动编译版本

* 增加 jsp 自动编译版本

* 增加 asp 自动编译版本

* 增加 .net 自动编译版本

* 修复其他 BUG


### 关于 HTTPS

ueditor 是不支持 https 的，我们也做了不少修改，由于百度表情，音乐不支持https 接口，所以使用了 [又拍云CDN](https://console.upyun.com/register/?invite=r17EYO3BW) 给大家提供服务，（希望大家能够从此链接注册认证，延长CDN使用时间）
如果有需要，也可将下面域名改成自己的。
```
imgbaidu.b0.upaiyun.com
tingapi.b0.upaiyun.com
```
Neditor 是我们团队基于 Ueditor 的一款富文本编辑器。
不论从功能还是从其它各方面来讲， Ueditor 都是一款无以替代的编辑器产品。
只是已经不符合现代化样式的需求，于是我们修改它的样式，实现了这样的效果：

![image](https://www.notadd.com/src/neditor.webp)

Demo:  https://demo.neditor.notadd.com/

## 入门部署和体验 ##

### 第一步：下载编辑器并用 Grunt 进行项目构建 ###

请确保已安装 grunt-cli 库。

```shell
git clone 仓库地址
npm install
grunt neditor
```

### 第二步：在浏览器打开 index.html ###

进入到目录 dist/utf8-php , 使用浏览器打开文件 index.html 。

如果看到了下面这样的编辑器，恭喜你，初次部署成功！

![部署成功](https://www.notadd.com/src/neditor-demo.webp)

### 编译其他语言为服务端的版本

Neditor 默认以 PHP 为后端语言，但是同时也支持其他的后端语言，例如 jsp，.net。

编译其他后端语言的方法为，为 grunt 命令添加 server 参数，例如，编译 jsp 为后端语言的版本的命令为：

```bash
grunt neditor --server=jsp
```

执行该命令后，则会在目录 dist 中生成对应的目录 utf8-jsp，目录包含了对应版本的文件。

### 自定义的参数

编辑器有很多可自定义的参数项，在实例化的时候可以传入给编辑器：

```javascript
var ue = UE.getEditor('container', {
    autoHeight: false
});
```

配置项也可以通过 neditor.config.js 文件修改，具体的配置方法请看[前端配置项说明](http://fex.baidu.com/ueditor/#start-config1.4 前端配置项说明.md)

### 设置和读取编辑器的内容

通 getContent 和 setContent 方法可以设置和读取编辑器的内容

```javascript
var ue = UE.getContent();
ue.ready(function(){
    //设置编辑器的内容
    ue.setContent('hello');
    //获取html内容，返回: <p>hello</p>
    var html = ue.getContent();
    //获取纯文本内容，返回: hello
    var txt = ue.getContentTxt();
});
```

Ueditor 的更多API请看[API 文档](http://ueditor.baidu.com/doc "ueditor API 文档")

##  下载地址

Neditor 码云： [http://gitee.com/notadd/neditor](http://gitee.com/notadd/neditor "Neditor github 地址")

Neditor github 地址：[http://github.com/notadd/neditor](http://github.com/notadd/neditor "Neditor github 地址")

## 相关链接 

Ueditor 官网：[http://ueditor.baidu.com](http://ueditor.baidu.com "ueditor 官网")

Ueditor API 文档：[http://ueditor.baidu.com/doc](http://ueditor.baidu.com/doc "ueditor API 文档")

Ueditor github 地址：[http://github.com/fex-team/ueditor](http://github.com/fex-team/ueditor "ueditor github 地址")



## 详细文档

Ueditor 文档：[http://fex.baidu.com/ueditor/](http://fex.baidu.com/ueditor/)

注: 对IE8以下版本不再承诺兼容

## 联系我们 ##

QQ 群： 321735506

[issue](http://github.com/notadd/neditor/issues)

[论坛交流](https://bbs.notadd.com/category/13 "Neditor 论坛")

## 捐赠 


[捐赠](https://git.oschina.net/notadd/notadd?donate=true)
 
## 其他项目：Notadd

https://github.com/notadd/notadd

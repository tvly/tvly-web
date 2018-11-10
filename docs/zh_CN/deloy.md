# 部署

## 配置

网站中有一些内容是可以配置的，在开始部署之前需要修改这些配置。

见[配置](config.md)。

## 编译

### 环境需求

经测试可以编译 tvly 的环境包括：

1. ArchLinux
2. MacOS
3. WSL

经测试编译有问题的平台包括：

1. Termux on Android（安装 node-sass 时会发现官方没有发布安卓平台的预编译文件）

（感谢 @heretp 的测试）

**注意上述环境要求是针对编译的，编译好的文件可以复制到任意平台上，通过任意web服务器提供服务。**

### Node.js 与 npm

在开始部署之前需要先[安装 Node.js 与 npm ](https://nodejs.org/en/download/)，这
主要是为了安装依赖以及在本地根据你的配置对 tvly 进行定制编译。

虽然 tvly 对编译所使用的 Node.js 没有要求，但是由于最新版本的 Nodejs 容易遇到
依赖冲突的问题，建议使用 LTS 版本。

### 安装依赖

```bash
~> npm install
```

### 编译

```bash
~> npm run build
```

## 服务

编译好之后会在项目根目录下生成`/dist/`目录，这个目录中包含了编译生成的静态文件，
将这个目录复制到 web 服务器的目录，并通过 http(s) 服务出去即可。

需要注意的是，由于使用 [html5 history mode](https://router.vuejs.org/guide/essentials/history-mode.html)，我们需要保证，当 web 服务器收到不认识的 url 时，返回 index 文件。

以 nginx 为例，一个最简单的配置如下：

```nginx
server {
  ...

  root /path/to/dist/;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

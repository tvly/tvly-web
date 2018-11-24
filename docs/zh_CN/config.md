# 配置

# 基本配置

关于 tvly 的配置，我们需要在项目根目录下创建 `config.json5` 这个文件，将配置写
到里面。可以参考这个[例子](../example/config.json5)。

**注意基本配置需要在编译时配置好，而其他配置都是在用户访问页面时请求的。**

这是一个 [json5](https://json5.org/) 文件，有比 json 更宽松的语法。

一些重要字段的介绍如下：

1. `name`: 站点的名字。
2. `shortName`: 站点可以作为一个 web 应用安装到手机上，这个应用的名字。
3. `description`: 出现在 web 应用或网页的描述中，普通用户通常见不到。
4. `baseUrl`: 如果 tvly 不是服务在域名的根目录下，需要相应地修改这个字段，必须以 '/' 结尾。
5. `authUrl`: 当用户加载资源失败时会提示跳转到 authUrl（考虑移除，用其他方式实现）。
6. `logoutUrl`: 当用户类型为登录用户时显示按钮，当用户点击时会主动 GET 该 url，用于清除 cookie（考虑移除，用其他方式实现）。
7. `legacyUrl`：设置后会显示返回旧版（考虑移除，用其他方式实现）。
8. `sponsorLogoUrl`：显示在菜单顶部的图片的链接。
9. `userInfoUrl`: 用于获取用户信息（可选）。
10. `channelsUrlList`: 用于配置[节目列表](#节目列表)。
11. `epgUrlList`: 用于配置[电子节目单](#电子节目单)。（留空禁用）
12. `defaultHlsUrlTemplate`, `defaultSnapshotUrlTemplate`：见[节目列表](#节目列表)。
如果节目列表中已经做好了配置，没有 fallback 的情况，这里可以留空。
13. `channelViewersUrl`: 用于[实时观看数量](#实时观看数量)。（留空禁用）

# 用户信息

通过基本配置里的 `userInfoUrl` 配置，用户加载 tvly 的时候会请求这一 URL，用于
判断用户的身份，显示用户信息，格式如下：

```
<type>:<content>
```

其中 type 为 `ip` 时认为用户是通过 ip 通过认证，显示IPv6用户或校内用户（IPv4)，
否则认为用户为登录通过认证，显示登录用户，并在界面上显示登出按钮，按钮的行为
见基本配置中的 `logoutUrl`。

`content` 会直接在页面上显示，对于 ip 登录用户会用于判断 IPv4 用户或 IPv6
用户。

# 节目列表

tvly 支持多个节目列表来源，方便分别管理或脚本生成，电子节目单的配置由基本配置
中的 `channelsUrlList` 配置。

关于节目列表的格式见[样例](../config/channels.json)。

具体来说，节目（Channel）被分为不同的类别（Category），而一个节目单中支持多个
类别。

对节目来说，有四个重要的属性：

1. Name: 显示的名字
2. Vid: 模板的参数
3. SnapshotUrlTemplate: 内容截图的链接，可以是一个模板，`{}`所包括的变量会被
替换成对应的值。
4. HlsUrlTemplate: 播放内容的链接，当前必须是一个 m3u8 文件，会被当成一个直播
流播放，同样可以是一个模板。

其中 `SnapshotUrlTemplate` 和 `HlsUrlTemplate` 遵循如下的原则：

1. 如果 channel 里设置了，则取 channel 里的值，否则
2. 如果 category 里设置了，则取 category 里的值，否则
3. 如果内容列表的根节点中设置了，则取根节点中的值，否则
4. 使用基本列表中的 `defaultSnapshotUrlTemplate` 或 `defaultHlsUrlTemplate` 中
的值。

# 电子节目单

类似节目列表，支持配置多个节目单。由基本配置中的 `epgUrlList` 来确定。

电子节目单的格式见[样例](../config/epg.json)。

用 channel 的 Vid 索引节目，时间的起止使用 [unix 时间](https://en.wikipedia.org/wiki/Unix_time)。

# 实时观看数量

由基本配置中的 `channelViewersUrl` 来确定，用户访问过程中会实时刷新。

格式见[样例](../config/status.txt)。

这个文件中的每一行都应该是如下格式:

```
<viewers> <Vid>
```

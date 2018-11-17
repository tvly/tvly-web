# 配置

# 基本配置

关于 tvly 的配置，我们需要在项目根目录下创建 `config.json5` 这个文件，将配置写
到里面。可以参考这个[例子](../example/config.json5)。

这是一个 [json5](https://json5.org/) 文件，有比 json 更宽松的语法。

一些字段的介绍如下：

1. name: 站点的名字。
2. shortName: 站点可以作为一个 web 应用安装到手机上，这个应用的名字。
3. description: 出现在 web 应用或网页的描述中，普通用户通常见不到。
4. srcCredit: 用于致谢视频源。
5. sponsor: 出现在页脚。
6. baseUrl: 如果 tvly 不是服务在域名的根目录下，需要相应地修改这个字段，必须以 '/' 结尾。
7. mailbox, wechat, telegram: 显示在联系方式里。
8. authUrl: 当用户加载资源失败时会提示跳转到 authUrl。
9. logoutUrl: 当用户类型为登录用户时显示按钮，当用户点击时会主动 GET 该 url，用于清除 cookie。
10. legacyUrl：设置后会显示返回旧版（未来会考虑移除这一配置，用其他方式实现）。
11. sponsorLogoUrl：显示在菜单顶部的图片。

# 节目列表

# 电子节目单

# 节目播放数量

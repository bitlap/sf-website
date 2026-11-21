# SnapFlow 幻兔官网

独立于 Flutter App 的官方网站。线上域名：**https://dreamylost.com** 。

## 功能

- 产品介绍、内容类型切换、相册／创作／私信与互动展示；帮助页说明已读隐私、注销入口和数据处理范围。
- iOS、Android、微信小程序入口：官方链接尚未开放时提供明确状态；链接配置后直接跳转；小程序支持展示官方小程序码。
- 完整中英文切换，URL 参数 `?lang=en` 可分享，浏览器记住语言偏好；帮助页与弹窗同步切换。
- 帮助与支持、邮件联系、GitHub 问题反馈、官方双语隐私政策。
- 手机菜单、键盘导航、内容标签页方向键、可关闭对话框、减少动态效果设置。
- 自托管字体／图片、社交分享元信息、favicon、canonical、robots、sitemap、自定义 404。
- 不接入广告和分析脚本，不提供注册或个人数据提交表单。

## 开发与检查

Node.js 20 或更新版本、Python 3（政策页生成与检查），无需安装第三方依赖。

```sh
npm run dev     # http://127.0.0.1:4174
npm run check   # JS 语法、所有本地链接与锚点、域名与下载配置检查
npm run build   # 检查后输出独立的 dist/ 静态发布目录
```

页面可直接由任意静态服务器托管。`index.html` 为中文基础页面；`locales/en.js` 是英文词典，`i18n.js` 负责语言状态。新增文案时同步补充词典。

## 正式入口配置

只修改 `site-config.js` 中的公开配置，不填写任何密钥：

```js
platforms: {
  ios: { url: 'https://apps.apple.com/…' },
  android: { url: 'https://你的官方安装包地址.apk' },
  mini: { url: null, qrImage: 'assets/官方小程序码.png' }
}
```

保持 `null` 即显示待开放提示。没有伪造 TestFlight 邀请、安装包或小程序码。手机概念界面与图文数据是视觉演示，不是实际用户数据。

## GitHub Pages 发布

仓库：**https://github.com/bitlap/sf-website** 。

在 Settings → Pages 设置 **Deploy from a branch → main → / (root)**。根目录的 `.nojekyll` 禁用 Jekyll，`CNAME` 保留自定义域名。GitHub Pages 会随 `main` 的推送自动发布；本项目不依赖付费的自定义 Actions runner。请在每次推送前运行 `npm run build`。

自定义域名设为 `dreamylost.com`。如 GitHub 要求域名验证，在组织 Settings → Pages 中验证域名：添加 `_github-pages-challenge-bitlap` TXT 记录，值使用 GitHub 验证页面提供的代码，并完成 Verify。验证后绑定域名；DNS 生效且 GitHub 签发证书后启用 **Enforce HTTPS**。

DNSPod 记录（普通解析，不修改 `m` 等其他子域名）：

| 主机 | 类型 | 值 |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `bitlap.github.io` |

如果根域已有冲突的 A、AAAA 或 CNAME，请核对后替换为 GitHub Pages 的记录。`www` 由 Pages 重定向到根域。可选 IPv6 配置与证书要求参见 [GitHub 官方说明](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

## 资源

- 品牌标识来自 SnapFlow App，由项目所有者提供。
- 展示摄影来自 Unsplash；原始图片 URL 记录于 [assets/README.md](assets/README.md)。
- Manrope 字体按 SIL Open Font License 自托管，许可证见 `assets/fonts/OFL.txt`；中文使用系统字体。
- `docs/previews/` 保存首版原型参考，不属于构建输出。

## App 隐私政策

- 双语入口：https://dreamylost.com/privacy/
- 中文：https://dreamylost.com/privacy/zh-CN.html
- English：https://dreamylost.com/privacy/en.html

2026-11-19 从原 `sf-app-privacy` 仓库迁入政策时，正文保持逐字一致；迁移基线见[迁移记录](docs/migrations/privacy-policy.md)。当前政策以 `policies/zh-CN.json` 和 `policies/en.json` 为准，随实际功能更新，保留 12 个章节。编辑中英文 JSON 后运行 `npm run privacy:build` 生成三页，再运行 `npm run check`。生成器会检查两种语言的章节 ID 和段落数，验证脚本检查每段原文、目录锚点及页面链接。

政策页共用官网字体、品牌标识、配色与导航，使用静态 HTML 和原生语言链接，不加载官网 JavaScript，不通过 Cookie 或 localStorage 记住语言。字体和样式自行托管。打印样式隐藏导航和目录，方便保存政策正文。

旧 `https://bitlap.org/sf-app-privacy/` 地址的兼容跳转由组织主站 `bitlap.github.io` 的 `public/sf-app-privacy/` 维护；Pages 发布分支同时保留对应文件。旧仓库 `bitlap/sf-app-privacy` 已归档为只读并停用 Pages；已发布 App 和商店里的旧入口仍可跳至本网站。

2026-11-21 更新：官网同步 iOS 0.1.0（58）内部 TestFlight 测试状态。外部公测尚未开放，公开入口保持 `null`；不发布内部测试链接或审核账号资料。App 目前主要为简体中文界面，官网的双语功能不代表 App 已国际化。发布准备与剩余验收统一维护于[公测 #89](https://github.com/bitlap/sf-app/issues/89)。

自助注销与清理已在生产开启；配套 App 需声明当前注销说明版本 1，旧包需升级。官网帮助页与政策统一使用“设置 → 账号与安全 → 注销账号／注销进度”。关联数据通常在 7 天内处理：清理已确认上传归属的原件及共享引用，保留他人独立副本与归属不明的历史资源。接口开放不代表真实注销和清理验收已完成。

本次文档核对已同步构建 58 的统计状态和已读隐私规则：该构建未启用第一方功能事件统计，但服务端业务日志和必要业务记录仍存在；已读公开默认开启，关闭不停止本人阅读位置同步，重新开启会公开当前累计已读。政策生成页由 JSON 生成，不手工修改。

## 服务条款与游客说明

双语服务条款入口`https://dreamylost.com/terms/`，正文位于`policies/terms-zh-CN.json`和`terms-en.json`；`npm run terms:build`生成三页，`npm run check`核对完整段落、双语结构、链接及锚点。App登录／注册页与关于提供服务条款和隐私政策链接。隐私政策补充游客不创建账号、不记录账号级推荐历史，但仍有必要IP／时间和限流日志。仅描述实际功能，不承诺外部公测已开放。

关联[官网#13](https://github.com/bitlap/sf-website/issues/13)、[App#199](https://github.com/bitlap/sf-app/issues/199)、[后端#158](https://github.com/bitlap/snapflow/issues/158)。先发布Pages和后端公开只读接口，再发布App，避免登录条款链接或游客内容接口不可用。

构建56配套状态：公开只读接口已部署，官网中英文服务条款与隐私页面已上线。游客推荐为时间倒序公开列表，不基于设备画像；登录后使用原推荐链路。App构建56的Apple处理及内测状态以[发布记录](https://github.com/bitlap/sf-app/blob/master/docs/testflight-0.1.0-56.md)为准；不将内部测试等同外部公测开放。

构建57同步登录布局和游客设置入口：未登录时隐藏通知设置、隐私设置与推荐偏好，登录后恢复；登录页条款使用紧凑底部排版，Apple登录仍位于更多方式。内部测试状态以[构建57记录](https://github.com/bitlap/sf-app/blob/master/docs/testflight-0.1.0-57.md)为准，外部公测保持未开放。

构建58支持游客分享公开作品链接、复制和保存分享卡片，并修复随听空列表或失败时无法下拉刷新。游客分享不创建账号或分享回执、不增加账号分享计数，作品可见性在每次访问时重新校验；相册分享及互动仍要求登录。发布证据见[构建58记录](https://github.com/bitlap/sf-app/blob/master/docs/testflight-0.1.0-58.md)，关联[App#209](https://github.com/bitlap/sf-app/issues/209)、[App#211](https://github.com/bitlap/sf-app/issues/211)，外部公测仍未开放。

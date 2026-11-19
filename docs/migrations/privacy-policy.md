# 隐私政策迁移

2026-11-19 将独立政策站迁入官网，由本仓库统一维护与发布。

## 新入口

- https://dreamylost.com/privacy/
- https://dreamylost.com/privacy/zh-CN.html
- https://dreamylost.com/privacy/en.html

原政策版本为 `8eb8ab22df72fba4cd4ab3e3b17c10a90bc7e955`。两份 JSON 按字节完整迁移，不改变政策正文、生效／更新信息、章节或段落。

| 文件 | SHA-256 |
| --- | --- |
| `policies/zh-CN.json` | `10b9de21ee570f15ad9b4e808edca966c227ccbfc78432c055f55fc69600a2ba` |
| `policies/en.json` | `50493cb58cae11fed7c3cd939833c79650dcee1768fdf5c0023a8aee9d7689c4` |

适配内容为官网品牌导航、配色、自托管字体、桌面侧栏目录、手机折叠目录、语言链接和打印样式。政策页不加载脚本、不使用 Cookie 或 localStorage，继续符合原政策对网页行为的说明。首页与帮助页的语言偏好功能独立于政策页。

## 旧入口兼容

组织主站 `bitlap/bitlap.github.io` 的源目录 `public/sf-app-privacy/` 和实际发布分支 `gh-pages` 中的 `sf-app-privacy/`，都保留 `index.html`、`zh-CN.html`、`en.html` 三个跳转文件。它们承接已发布 App 和既有 App Store 配置中的旧链接，不保存另一份政策正文。以后只在本仓库维护政策。

App 源码中的统一入口同步更新到官网；已有安装包不因此发生二进制更新，仍由旧地址兼容跳转承接。没有发布新 App 构建或提交审核。

## 检查

`npm run build` 包含完整 HTML 一致性、中英文 12 节及每一段原文、章节 ID、目录锚点、资源路径及政策页无脚本检查。另核对桌面／390px 手机阅读、双语切换、目录展开与章节跳转，以及公开 HTTPS 页面。

## 上线验证结果

官网域名已签发证书并强制 HTTPS；双语入口和两篇正文均 HTTP 200，与生成源码逐字一致。旧政策仓库的 Pages 已停用，三个旧 URL 均由组织主站返回指向官网的跳转页面（HTTP 200）；浏览器实测旧中文链接落地 `https://dreamylost.com/privacy/zh-CN.html`。App 隐私入口的 5 项既有回归测试通过。

原仓库完整 Git 历史 bundle 和 Issues 数据保存在本地官网 checkout 的 `.git/migration-backups/`，不部署到公开网页。仓库本体的移除以 GitHub 返回状态为准。

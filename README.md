# YIGEER / LOG

一个面向个人知识库的赛博风格静态主页，适合直接部署到 GitHub Pages。

## 使用

- 网站启动时会读取 `markdown/manifest.json`，再加载清单中的所有 `.md` 文件。
- 文章标题、日期、标签和摘要可以写在 Markdown 顶部的 YAML front matter 中；没有填写时会从正文推断。
- 新增文章时，把 `.md` 文件放入 `markdown/`，并把文件名加入 `markdown/manifest.json`。
- 点击文章卡片会在新标签页打开独立阅读页，支持标题、列表、引用、代码块、链接、粗体和斜体。

## 部署

这是纯静态站点，不需要安装依赖。将仓库发布为 GitHub Pages 后即可访问。

需要注意：这是 GitHub Pages 静态站点，浏览器无法直接枚举目录，所以必须维护 `manifest.json`。其中包含数据库账号密码等敏感信息的 Markdown 不应加入清单或发布到公网。

## 文件

- `index.html`：页面结构与文案
- `css/`：赛博终端视觉与响应式布局
- `js/`：文章读取、搜索、标签筛选和 Markdown 渲染
- `html/article.html`：独立文章阅读页
- `markdown/`：公开知识库内容和文件清单

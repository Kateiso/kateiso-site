# 项目简介（Astro SSG）

`kateiso-site` 采用 Astro 静态站点生成（SSG），保持原有 URL 结构（`/index.html`、`/blog/index.html`、`/blog/posts/<slug>.html`）。
目标：更易写作（Markdown）、更好 SEO/可维护性，并支持站内搜索、RSS、站点地图与后续动态能力。

## 本地开发

- 依赖：Node.js ≥ 18，npm ≥ 9
- 安装：`npm i`
- 开发：`npm run dev`
- 构建：`npm run build`
- 预览构建产物：`npm run preview`

## 目录结构

- `src/pages/index.astro`：主页
- `src/pages/about.astro`：关于页面（纳入站内搜索）
- `src/pages/blog/index.astro`：博客索引页
- `src/pages/blog/posts/[slug].astro`：文章路由
- `src/content/posts/*.md`：Markdown 文章（Frontmatter 管理元信息）
- `src/pages/assets/data/search.json.ts`：搜索索引（构建时生成静态 JSON）
- `src/pages/rss.xml.ts`：RSS 输出
- `public/assets/`：样式、脚本与图片（从原 `assets/` 迁移）
- `public/CNAME`：`kateiso.dev`
- `inbox/`：媒体收集文件夹（投放原始图片/Live Photo）
 - `templates/post.md`：Markdown 文章模板（放入 inbox 后自动转为正式文章）

## 写作（Markdown）

新建 `src/content/posts/<slug>.md`，Frontmatter 字段：

- `title`（≤60，页面 `<title>` 结尾自动加 “ · Kateiso”）
- `description`（140–160）
- `type`（Essay/Note/Case/Lab/Guide/Field note/Toolkit）
- `date`（ISO 日期）
- `summary`（卡片摘要）
- `cover`（可选，例：`assets/media/posts/<slug>/cover.webp`）
- `tags`（数组）

图片请放在 `public/assets/media/posts/<slug>/`，并补全 `alt` 文案。

## 图片收集（Inbox 工作流）

- 将照片放入仓库根目录的 `inbox/` 文件夹。支持：`.jpg/.jpeg/.png/.webp/.heic`，以及与之同名的 `.mov`（Apple Live Photo）。
- 运行 `npm run media:inbox`（或执行 `npm run build` 时自动运行），脚本会：
  - 优先读取 EXIF 拍摄时间作为展示日期（若缺失才回退到文件创建时间）；
  - 将文件移动到 `public/assets/media/gallery/` 并按 `YYYY-MM-DD_<slug>.<ext>` 重新命名；
  - 生成 `public/assets/data/gallery.json` 作为首页相册数据源；
  - 如果存在同名的图片+`.mov`，会自动配对为“动图”（静态封面+静音视频）。
  - 标题/说明来自源文件文件名（不含扩展名），会在站点上展示。
- 注意：若拷贝行为改变了创建时间，可后续扩展为读取 EXIF 时间。

## Inbox 接收文章（Markdown）

- 使用模板：`templates/post.md`（含必要 Frontmatter 字段）。
- 将写好的 `.md` 放到 `inbox/` 或 `inbox/posts/`。
- 运行 `npm run media:inbox`（或构建时自动），脚本会把符合要求的文章移动到 `src/content/posts/<slug>.md`，`<slug>` 来自文件名（kebab-case）。

## 照片页与筛选

- `/photos/` 页面使用与首页相同的数据源（manifest）。
- 支持按年份筛选（`?year=YYYY`）。
- 点击图片/动图可放大查看（Lightbox）。

## 搜索 / RSS / 站点地图 / 统计

- 搜索：构建时生成 `/assets/data/search.json`，博客页前端完成检索，包含 About 页面。
- RSS：`/rss.xml`
- 站点地图：`@astrojs/sitemap` 使用 `https://kateiso.dev`
- 统计：内置 Plausible 脚本（可改为 GA4）

## 发布（GitHub Pages）

- 推送后由 GitHub Actions 构建并部署（工作流将随后添加或按需启用）
- 需要 `public/CNAME`（内容 `kateiso.dev`）

## 规范

- BEM 类名；颜色/间距集中在 `public/assets/css/styles.css` 的 `:root` 变量
- 不调整 `public/assets/` 与博客路由层级，保持链接稳定
 - 设计方向：偏苹果式极简美学——简洁排版、适度留白、柔和层级、平滑且不打扰的动效（200–250ms，ease-in-out），遵循系统的“减少动态效果”偏好

## 常见问题

- 图片建议 ≤1600px、优先 webp、补全 alt
- 可择期开启：标签页、分页、进一步统计分析

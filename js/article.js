const articleId = new URLSearchParams(window.location.search).get('id');
const articleContent = document.querySelector('#articleContent');

async function loadArticle() {
  try {
    const manifestResponse = await fetch('../markdown/manifest.json');
    const filenames = await manifestResponse.json();
    const filename = filenames.find((item) => item.replace(/\.md$/i, '') === articleId);

    if (!filename) throw new Error('article not found');

    const markdownBasePath = getMarkdownBasePath('../markdown');
    const response = await fetch(`${markdownBasePath}/${encodeURIComponent(filename)}`);
    if (!response.ok) throw new Error('article unavailable');

    const content = await response.text();
    const article = parseMarkdownMetadata(content, filename, 0);
    document.title = `${article.title} // YIGEER`;
    articleContent.innerHTML = `
      <div class="reader-meta">${escapeHTML(article.date)} / #${escapeHTML(article.tag)} / NOTE ${escapeHTML(article.id)}</div>
      ${markdownToHTML(article.content)}
    `;
  } catch (error) {
    console.error(error);
    articleContent.innerHTML = `
      <div class="reader-meta">404 / SIGNAL NOT FOUND</div>
      <h1>这篇文章不在当前节点。</h1>
      <p>它可能已经被移动，或者这个阅读页的链接不完整。</p>
      <a class="text-cta" href="../index.html#archive">返回文章库 <span>→</span></a>
    `;
  }
}

loadArticle();

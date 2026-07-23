const state = {
  articles: [],
  activeTag: '全部',
};

const $ = (selector) => document.querySelector(selector);

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderTags() {
  const tags = ['全部', ...new Set(state.articles.map((article) => article.tag))];
  $('#tagFilters').innerHTML = tags.map((tag) => `
    <button class="tag-filter ${tag === state.activeTag ? 'active' : ''}" data-tag="${escapeHTML(tag)}">
      ${escapeHTML(tag)}
    </button>
  `).join('');

  document.querySelectorAll('.tag-filter').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeTag = button.dataset.tag;
      renderTags();
      renderArticles();
    });
  });
}

function openArticle(id) {
  window.open(`html/article.html?id=${encodeURIComponent(id)}`, '_blank');
}

function renderArticles() {
  const query = $('#searchInput').value.trim().toLowerCase();
  const articles = state.articles.filter((article) => {
    const matchesTag = state.activeTag === '全部' || article.tag === state.activeTag;
    const searchableText = `${article.title} ${article.tag} ${article.summary}`.toLowerCase();
    return matchesTag && (!query || searchableText.includes(query));
  });

  $('#totalNotes').textContent = String(state.articles.length).padStart(2, '0');
  $('#articleGrid').innerHTML = articles.map((article, index) => `
    <article class="article-card" data-id="${escapeHTML(article.id)}" tabindex="0" role="link">
      <div class="card-meta">
        <span class="card-index">${article.id || String(index + 1).padStart(2, '0')} / NOTE</span>
        <span>${escapeHTML(article.date)}</span>
      </div>
      <h3>${escapeHTML(article.title)}</h3>
      <p>${escapeHTML(article.summary)}</p>
      <div class="card-bottom">
        <span class="card-tag"># ${escapeHTML(article.tag)}</span>
        <span class="read-more">OPEN ↗</span>
      </div>
    </article>
  `).join('');

  $('#emptyState').hidden = articles.length > 0;
  document.querySelectorAll('.article-card').forEach((card) => {
    const open = () => openArticle(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') open();
    });
  });
}

async function loadKnowledgeBase() {
  try {
    const manifestResponse = await fetch('markdown/manifest.json');
    console.log(manifestResponse)
    console.log(manifestResponse.ok)
    if (!manifestResponse.ok) throw new Error('manifest unavailable');

    const filenames = await manifestResponse.json();
    state.articles = await Promise.all(filenames.map(async (filename, index) => {
      const response = await fetch(`markdown/${encodeURIComponent(filename)}`);
      if (!response.ok) throw new Error(`${filename} unavailable`);
      const content = await response.text();
      return parseMarkdownMetadata(content, filename, index);
    }));

    renderTags();
    renderArticles();
  } catch (error) {
    console.error(error);
    $('#articleGrid').hidden = true;
    $('#emptyState').hidden = false;
    $('#emptyState').textContent = '知识库读取失败，请检查 markdown/manifest.json 和 Markdown 文件路径。';
    showToast('知识库读取失败');
  }
}

$('#searchInput').addEventListener('input', renderArticles);
loadKnowledgeBase();

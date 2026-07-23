function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]));
}

function getMarkdownBasePath(localPath) {
  const isProduction = window.location.hostname === 'chenyigeer.github.io';
  return isProduction
    ? 'https://raw.githubusercontent.com/ChenYiGeEr/chenyigeer.github.io/main/' + localPath
    : localPath;
}

function parseMarkdownMetadata(content, filename, index) {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontMatter = frontMatterMatch ? frontMatterMatch[1] : '';
  const markdown = frontMatterMatch ? content.slice(frontMatterMatch[0].length) : content;
  const getValue = (key, fallback) => frontMatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || fallback;
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1] || filename.replace(/\.md$/i, '');
  const firstParagraph = markdown.replace(/^#.*$/m, '').trim().split(/\n\s*\n/)[0];

  return {
    id: filename.replace(/\.md$/i, ''),
    date: getValue('date', '未标注日期'),
    title: getValue('title', heading),
    tag: getValue('tag', '未分类'),
    summary: getValue('summary', firstParagraph.replace(/[#>*`]/g, '').trim().slice(0, 140)),
    content: markdown,
    index,
  };
}

function markdownToHTML(markdown) {
  let html = escapeHTML(markdown)
    .replace(/^###### (.*)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.*)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>')
    .replace(/(?:<li>.*<\/li>\n?)+/g, (list) => `<ul>${list}</ul>`)
    .replace(/\n{2,}/g, '</p><p>');

  html = html.replace(/<p>(<(?:h[1-6]|blockquote|pre|ul)>)/g, '$1');
  html = html.replace(/(<\/(?:h[1-6]|blockquote|pre|ul)>)<\/p>/g, '$1');
  return `<p>${html}</p>`;
}

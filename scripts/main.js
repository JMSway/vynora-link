// Deep link helper: try native app first, fall back to web after 500ms.
// See CLAUDE.md §13.
function openExternalLink(webUrl, deepLinkUrl) {
  if (deepLinkUrl) {
    window.location.href = deepLinkUrl;
    setTimeout(() => {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }, 500);
  } else {
    window.open(webUrl, '_blank', 'noopener,noreferrer');
  }
}

window.openExternalLink = openExternalLink;

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduced-motion');
}

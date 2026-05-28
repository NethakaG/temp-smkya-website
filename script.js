// SMKYA - Shared JS
document.addEventListener('DOMContentLoaded', () => {
  // ===== Hamburger nav =====
  const burger = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      burger.setAttribute('aria-expanded', expanded);
    });
    // Close menu when a link is tapped (mobile UX)
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (a.classList.contains('dropdown-toggle')) return;
        if (window.innerWidth <= 900) {
          links.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ===== Scroll reveal =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // ===== Form feedback =====
  document.querySelectorAll('form[data-feedback]').forEach((f) => {
    f.addEventListener('submit', () => {
      const btn = f.querySelector('button[type="submit"]');
      if (btn) btn.textContent = 'Opening your email...';
    });
  });

  // ===== Toast helper =====
  let toastTimer;
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // ===== Article actions: Like / Share / Copy =====
  document.querySelectorAll('.article-actions').forEach((actions) => {
    const postId = actions.dataset.postId || location.pathname;
    const likeBtn = actions.querySelector('.js-like');
    const shareBtn = actions.querySelector('.js-share');
    const copyBtn = actions.querySelector('.js-copy');

    // Like button — persistent via localStorage
    if (likeBtn) {
      const storageKey = `smkya_like_${postId}`;
      const countKey = `smkya_likecount_${postId}`;
      const countEl = likeBtn.querySelector('.action-count');
      const liked = localStorage.getItem(storageKey) === '1';
      // Use a small base count so it doesn't feel dead; persist incremental session bumps
      let count = parseInt(localStorage.getItem(countKey) || '0', 10);
      if (liked) likeBtn.classList.add('liked');
      if (countEl) countEl.textContent = count;

      likeBtn.addEventListener('click', () => {
        const isLiked = likeBtn.classList.toggle('liked');
        if (isLiked) {
          count += 1;
          localStorage.setItem(storageKey, '1');
        } else {
          count = Math.max(0, count - 1);
          localStorage.removeItem(storageKey);
        }
        localStorage.setItem(countKey, String(count));
        if (countEl) countEl.textContent = count;
        if (isLiked) showToast('Thanks for the love!');
      });
    }

    // Share button — uses Web Share API on mobile, falls back to copy
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const shareData = {
          title: document.title,
          text: 'Read this from SMKYA:',
          url: window.location.href,
        };
        if (navigator.share) {
          try {
            await navigator.share(shareData);
            showToast('Thanks for sharing!');
          } catch (err) {
            // User cancelled share - silent
          }
        } else {
          // Fallback: copy URL
          try {
            await navigator.clipboard.writeText(window.location.href);
            shareBtn.classList.add('shared');
            showToast('Link copied - paste it anywhere');
            setTimeout(() => shareBtn.classList.remove('shared'), 1800);
          } catch (err) {
            showToast('Could not share');
          }
        }
      });
    }

    // Copy link button
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.classList.add('copied');
          const label = copyBtn.querySelector('.action-label');
          const original = label ? label.textContent : null;
          if (label) label.textContent = 'Copied!';
          showToast('Link copied to clipboard');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            if (label && original) label.textContent = original;
          }, 1800);
        } catch (err) {
          // Fallback for older browsers
          const tmp = document.createElement('textarea');
          tmp.value = window.location.href;
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand('copy'); showToast('Link copied'); }
          catch (_) { showToast('Could not copy link'); }
          document.body.removeChild(tmp);
        }
      });
    }
  });
});

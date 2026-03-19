// BountyChecklist Popup
(function() {
  const categories = [
    { id: 'rce', name: 'RCE', icon: '💥' },
    { id: 'sql-injection', name: 'SQLi', icon: '🗄️' },
    { id: 'rxss', name: 'XSS', icon: '⚡' },
    { id: 'ssrf-techniques', name: 'SSRF', icon: '🌐' },
    { id: 'idor-vulnerability', name: 'IDOR', icon: '🔓' },
    { id: 'ssti-techniques', name: 'SSTI', icon: '📝' },
    { id: 'xxe-vulnerabilities', name: 'XXE', icon: '📄' },
    { id: 'command-injection', name: 'CMD', icon: '💻' }
  ];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadTheme();
    renderCategories();
    setupEvents();
  }

  function loadTheme() {
    chrome.runtime.sendMessage({ type: 'GET_THEME' }, function(res) {
      const theme = res.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      updateThemeIcon(theme);
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    chrome.runtime.sendMessage({ type: 'SET_THEME', theme: next });
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      if (theme === 'dark') {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
      }
    }
  }

  function renderCategories() {
    const grid = document.getElementById('categories');
    if (!grid) return;
    const cats = categories.map(function(c) {
      return '<div class="cat-item" data-id="' + c.id + '"><span class="cat-icon">' + c.icon + '</span><span>' + c.name + '</span></div>';
    }).join('');
    grid.innerHTML = cats;

    grid.querySelectorAll('.cat-item').forEach(function(item) {
      item.addEventListener('click', function() {
        openSidepanel();
      });
    });
  }

  function openSidepanel() {
    chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' }, function() {
      window.close();
    });
  }

  function setupEvents() {
    const openBtn = document.getElementById('openSidebar');
    if (openBtn) {
      openBtn.addEventListener('click', openSidepanel);
    }

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    const randomBtn = document.getElementById('randomBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', openSidepanel);
    }
  }
})();

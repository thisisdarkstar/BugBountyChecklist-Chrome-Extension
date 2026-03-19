// BountyChecklist Sidebar
(function() {
  let data = null;
  let currentCat = null;
  let favorites = [];

  const sidebarRoot = document.getElementById('sidebarRoot');
  const categoriesEl = document.getElementById('categories');
  const mainPanel = document.getElementById('mainPanel');
  const welcome = document.getElementById('welcome');
  const quickTags = document.getElementById('quickTags');
  const searchInput = document.getElementById('searchInput');
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const headersBtn = document.getElementById('headersBtn');
  const favsBtn = document.getElementById('favsBtn');
  const randomBtn = document.getElementById('randomBtn');
  const toast = document.getElementById('toast');
  const fontSm = document.getElementById('fontSm');
  const fontMd = document.getElementById('fontMd');
  const fontLg = document.getElementById('fontLg');

  const fontSizes = { small: 11, medium: 13, large: 16 };
  let currentSize = 'medium';

  init();

  function init() {
    loadSettings(function() {
      loadTheme(function() {
        loadFavorites(function() {
          loadData();
          setupEvents();
        });
      });
    });
  }

  function loadSettings(callback) {
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, function(res) {
      currentSize = res.fontSize || 'medium';
      document.documentElement.style.fontSize = fontSizes[currentSize] + 'px';
      updateFontButtons();
      if (callback) callback();
    });
  }

  function updateFontButtons() {
    [fontSm, fontMd, fontLg].forEach(function(btn) { btn.classList.remove('active'); });
    if (currentSize === 'small') fontSm.classList.add('active');
    else if (currentSize === 'medium') fontMd.classList.add('active');
    else fontLg.classList.add('active');
  }

  function saveSettings() {
    chrome.runtime.sendMessage({ type: 'SET_SETTINGS', fontSize: currentSize });
  }

  function loadTheme(callback) {
    chrome.runtime.sendMessage({ type: 'GET_THEME' }, function(res) {
      const theme = res.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      updateThemeIcon(theme);
      if (callback) callback();
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
    if (theme === 'dark') {
      themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
  }

  function loadFavorites(callback) {
    chrome.runtime.sendMessage({ type: 'GET_FAVORITES' }, function(res) {
      favorites = res.favorites || [];
      if (callback) callback();
    });
  }

  function saveFavorites() {
    chrome.runtime.sendMessage({ type: 'SET_FAVORITES', favorites: favorites });
  }

  function loadData() {
    fetch(chrome.runtime.getURL('assets/data/vulnerabilities.json'))
      .then(function(r) { return r.json(); })
      .then(function(d) {
        data = d;
        renderCategories();
        renderQuickTags();
      });
  }

  function renderCategories() {
    if (!data) return;
    var html = '';
    for (var i = 0; i < data.categories.length; i++) {
      var cat = data.categories[i];
      var active = currentCat && currentCat.id === cat.id ? ' active' : '';
      html += '<div class="cat-item' + active + '" data-id="' + cat.id + '">' +
        '<span class="cat-icon">' + cat.icon + '</span>' +
        '<span class="cat-name">' + cat.name + '</span></div>';
    }
    categoriesEl.innerHTML = html;

    var items = categoriesEl.querySelectorAll('.cat-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', (function(id) {
        return function() {
          for (var k = 0; k < data.categories.length; k++) {
            if (data.categories[k].id === id) {
              currentCat = data.categories[k];
              renderCategories();
              renderContent();
              break;
            }
          }
        };
      })(items[j].dataset.id));
    }
  }

  function renderQuickTags() {
    if (!data) return;
    var html = '';
    for (var i = 0; i < Math.min(8, data.categories.length); i++) {
      var cat = data.categories[i];
      html += '<span class="tag" data-id="' + cat.id + '">' + cat.icon + ' ' + cat.name + '</span>';
    }
    quickTags.innerHTML = html;

    var tags = quickTags.querySelectorAll('.tag');
    for (var j = 0; j < tags.length; j++) {
      tags[j].addEventListener('click', (function(id) {
        return function() {
          for (var k = 0; k < data.categories.length; k++) {
            if (data.categories[k].id === id) {
              currentCat = data.categories[k];
              renderCategories();
              renderContent();
              break;
            }
          }
        };
      })(tags[j].dataset.id));
    }
  }

  function renderContent() {
    if (!currentCat) {
      welcome.style.display = 'flex';
      return;
    }
    welcome.style.display = 'none';

    var item = currentCat.items[0];
    if (!item) return;

    if (item.type === 'payloads') {
      renderPayloads(item);
    } else {
      renderList(item);
    }
  }

  function renderPayloads(item) {
    var html = '<div class="content-header"><div class="content-title">' + item.name + '</div>' +
      '<div class="content-subtitle">' + item.payloads.length + ' payloads</div></div>' +
      '<div class="payload-grid">';
    for (var i = 0; i < item.payloads.length; i++) {
      html += '<div class="payload-item" data-payload="' + encodeURIComponent(item.payloads[i]) + '">' + esc(item.payloads[i]) + '</div>';
    }
    html += '</div>';
    mainPanel.innerHTML = html;

    var items = mainPanel.querySelectorAll('.payload-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', (function(el) {
        return function() { copy(decodeURIComponent(el.dataset.payload)); };
      })(items[j]));
    }
  }

  function renderList(item) {
    var content = item.content || [];
    var html = '<div class="content-header"><div class="content-title">' + item.name + '</div>' +
      '<div class="content-subtitle">' + currentCat.name + '</div></div><div class="content-body">';

    var techNum = 0;
    for (var i = 0; i < content.length; i++) {
      var block = content[i];
      switch (block.type) {
        case 'header':
          html += '<div class="section-title" style="margin-top:16px">' + esc(block.text) + '</div>';
          break;
        case 'checklist':
          var isFav = false;
          for (var f = 0; f < favorites.length; f++) {
            if (favorites[f].key === currentCat.id + '-' + block.text) { isFav = true; break; }
          }
          var favClass = isFav ? ' active' : '';
          var favFill = isFav ? 'currentColor' : 'none';
          html += '<div class="check-item"><div class="checkbox"><svg viewBox="0 0 24 24" width="12" height="12"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="opacity:0"/></svg></div><span class="check-text">' + esc(block.text) + '</span>' +
            '<button class="fav-btn' + favClass + '" data-text="' + esc(block.text) + '">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + favFill + '" stroke="currentColor" stroke-width="2">' +
            '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
            '</svg></button></div>';
          break;
        case 'technique':
          techNum++;
          html += '<div class="section"><div class="section-title"><span class="section-num">' + techNum + '</span>' + esc(block.title) + '</div>';
          if (block.description) html += '<p class="desc">' + esc(block.description) + '</p>';
          if (block.payloads) {
            for (var p = 0; p < block.payloads.length; p++) {
              html += '<div class="code-block"><div class="code-header"><span class="code-label">' + (block.payloads[p].lang || 'Code') + '</span>' +
                '<button class="copy-btn" data-code="' + esc(block.payloads[p].code) + '">Copy</button></div>' +
                '<pre class="code-content">' + esc(block.payloads[p].code) + '</pre></div>';
            }
          }
          if (block.links) {
            for (var l = 0; l < block.links.length; l++) {
              html += '<a href="' + esc(block.links[l].url) + '" target="_blank" class="link-item">' + esc(block.links[l].text || block.links[l].url) + '</a>';
            }
          }
          html += '</div>';
          break;
        case 'code':
          html += '<div class="code-block"><div class="code-header"><span class="code-label">' + (block.lang || 'Code') + '</span>' +
            '<button class="copy-btn" data-code="' + esc(block.code) + '">Copy</button></div>' +
            '<pre class="code-content">' + esc(block.code) + '</pre></div>';
          break;
        case 'links':
          for (var u = 0; u < block.urls.length; u++) {
            html += '<a href="' + esc(block.urls[u]) + '" target="_blank" class="link-item">' + esc(block.urls[u]) + '</a>';
          }
          break;
        case 'text':
          html += '<p class="desc">' + esc(block.text) + '</p>';
          break;
        case 'list':
          html += '<div class="check-item"><span style="width:8px;height:8px;background:var(--text3);border-radius:50%;flex-shrink:0;margin-top:6px"></span><span class="check-text">' + esc(block.text) + '</span></div>';
          break;
      }
    }

    html += '</div>';
    mainPanel.innerHTML = html;
    setupContentEvents();
  }

  function setupContentEvents() {
    var copyBtns = mainPanel.querySelectorAll('.copy-btn');
    for (var i = 0; i < copyBtns.length; i++) {
      copyBtns[i].addEventListener('click', (function(btn) {
        return function(e) { e.stopPropagation(); copy(btn.dataset.code); };
      })(copyBtns[i]));
    }

    var checkboxes = mainPanel.querySelectorAll('.checkbox');
    for (var j = 0; j < checkboxes.length; j++) {
      checkboxes[j].addEventListener('click', function() { this.classList.toggle('checked'); });
    }

    var favBtns = mainPanel.querySelectorAll('.fav-btn');
    for (var k = 0; k < favBtns.length; k++) {
      favBtns[k].addEventListener('click', (function(btn) {
        return function() {
          var text = btn.dataset.text;
          var key = currentCat.id + '-' + text;
          var idx = -1;
          for (var m = 0; m < favorites.length; m++) {
            if (favorites[m].key === key) { idx = m; break; }
          }
          if (idx > -1) {
            favorites.splice(idx, 1);
            btn.classList.remove('active');
            btn.querySelector('svg').setAttribute('fill', 'none');
            showToast('Removed from favorites');
          } else {
            favorites.push({ key: key, categoryId: currentCat.id, title: text, content: '' });
            btn.classList.add('active');
            btn.querySelector('svg').setAttribute('fill', 'currentColor');
            showToast('Added to favorites');
          }
          saveFavorites();
        };
      })(favBtns[k]));
    }
  }

  function search(query) {
    if (!query.trim() || !data) { renderContent(); return; }
    var q = query.toLowerCase();
    var results = [];

    for (var c = 0; c < data.categories.length; c++) {
      var cat = data.categories[c];
      for (var i = 0; i < cat.items.length; i++) {
        var item = cat.items[i];
        if (item.type === 'payloads') {
          for (var p = 0; p < item.payloads.length; p++) {
            if (item.payloads[p].toLowerCase().indexOf(q) !== -1) {
              results.push({ cat: cat, item: item, content: item.payloads[p] });
            }
          }
        } else if (item.content) {
          for (var b = 0; b < item.content.length; b++) {
            var block = item.content[b];
            var searchable = block.text || block.title || block.code || '';
            if (searchable.toLowerCase().indexOf(q) !== -1) {
              results.push({ cat: cat, item: item, content: block });
            }
          }
        }
      }
    }

    renderSearchResults(results.slice(0, 20));
  }

  function renderSearchResults(results) {
    if (results.length === 0) {
      mainPanel.innerHTML = '<div class="welcome"><div class="welcome-icon">🔍</div><h2>No results found</h2><p>Try different keywords</p></div>';
      return;
    }

    var html = '<div class="content-header"><div class="content-title">Search Results</div><div class="content-subtitle">' + results.length + ' found</div></div>';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      html += '<div class="check-item" style="cursor:pointer" data-idx="' + i + '">' +
        '<span class="cat-icon">' + r.cat.icon + '</span>' +
        '<span class="check-text"><strong>' + esc(r.cat.name) + '</strong> - ' + esc(r.item.name) + '</span></div>';
    }
    mainPanel.innerHTML = html;

    var items = mainPanel.querySelectorAll('.check-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', (function(idx) {
        return function() {
          var r = results[parseInt(this.dataset.idx)];
          currentCat = r.cat;
          renderCategories();
          renderContent();
        };
      })(j));
    }
  }

  function showHeaders() {
    var headers = 'X-Forwarded-For: 127.0.0.1\nX-Real-IP: 127.0.0.1\nX-Client-IP: 127.0.0.1\nX-Forwarded-Host: 127.0.0.1\nX-Original-URL: 127.0.0.1\nClient-IP: 127.0.0.1\nCF-Connecting-IP: 127.0.0.1';
    var auth = 'Authorization: Bearer <token>\nAuthorization: Basic <base64>\nCookie: session=value';

    mainPanel.innerHTML = '<div class="content-header"><div class="content-title">📋 Common Headers</div><div class="content-subtitle">Useful for testing</div></div>' +
      '<div class="section"><div class="section-title">🔒 IP/Host Headers</div>' +
      '<div class="code-block"><div class="code-header"><span class="code-label">Headers</span><button class="copy-btn" data-code="' + esc(headers) + '">Copy All</button></div>' +
      '<pre class="code-content">' + esc(headers) + '</pre></div></div>' +
      '<div class="section"><div class="section-title">🎭 Authentication</div>' +
      '<div class="code-block"><div class="code-header"><span class="code-label">Headers</span><button class="copy-btn" data-code="' + esc(auth) + '">Copy All</button></div>' +
      '<pre class="code-content">' + esc(auth) + '</pre></div></div>';

    setupContentEvents();
  }

  function showFavorites() {
    if (favorites.length === 0) {
      mainPanel.innerHTML = '<div class="welcome"><div class="welcome-icon">❤️</div><h2>No favorites yet</h2><p>Click the heart on any item to save it here</p></div>';
      return;
    }

    var html = '<div class="content-header"><div class="content-title">❤️ Favorites</div><div class="content-subtitle">' + favorites.length + ' saved</div></div>';
    for (var i = 0; i < favorites.length; i++) {
      var f = favorites[i];
      html += '<div class="check-item"><span class="cat-icon">📌</span><span class="check-text"><strong>' + esc(f.categoryId) + '</strong> - ' + esc(f.title) + '</span></div>';
    }
    mainPanel.innerHTML = html;
  }

  function showRandom() {
    if (!data) return;
    var payloads = [];
    for (var c = 0; c < data.categories.length; c++) {
      var cat = data.categories[c];
      for (var i = 0; i < cat.items.length; i++) {
        var item = cat.items[i];
        if (item.type === 'payloads') {
          for (var p = 0; p < item.payloads.length; p++) {
            payloads.push({ cat: cat, payload: item.payloads[p] });
          }
        }
      }
    }

    if (payloads.length === 0) return;
    var r = payloads[Math.floor(Math.random() * payloads.length)];

    mainPanel.innerHTML = '<div class="content-header"><div class="content-title">🎲 Random Payload</div><div class="content-subtitle">' + r.cat.icon + ' ' + r.cat.name + '</div></div>' +
      '<div class="code-block"><div class="code-header"><span class="code-label">Payload</span><button class="copy-btn" data-code="' + esc(r.payload) + '">Copy</button></div>' +
      '<pre class="code-content">' + esc(r.payload) + '</pre></div>';

    setupContentEvents();
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() { showToast('Copied!'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied!');
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2000);
  }

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function setupEvents() {
    themeBtn.addEventListener('click', toggleTheme);
    headersBtn.addEventListener('click', showHeaders);
    favsBtn.addEventListener('click', showFavorites);
    randomBtn.addEventListener('click', showRandom);

    fontSm.addEventListener('click', function() {
      currentSize = 'small';
      document.documentElement.style.fontSize = fontSizes.small + 'px';
      updateFontButtons();
      saveSettings();
    });

    fontMd.addEventListener('click', function() {
      currentSize = 'medium';
      document.documentElement.style.fontSize = fontSizes.medium + 'px';
      updateFontButtons();
      saveSettings();
    });

    fontLg.addEventListener('click', function() {
      currentSize = 'large';
      document.documentElement.style.fontSize = fontSizes.large + 'px';
      updateFontButtons();
      saveSettings();
    });

    var searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() { search(searchInput.value); }, 200);
    });

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }
})();

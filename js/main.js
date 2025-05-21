// Carregamento otimizado de imagens
const lazyLoad = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  io.observe(target);
};

// Tema escuro/claro
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const setTheme = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

// Verificar preferências do usuário
const currentTheme = localStorage.getItem('theme') || 
                    (prefersDark.matches ? 'dark' : 'light');
setTheme(currentTheme === 'dark');

// Alternar tema
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
  setTheme(isDark);
});

// Carregar mangás com cache
let mangasCache = null;

async function loadMangas() {
  if (mangasCache) return mangasCache;
  
  try {
    const response = await fetch('data/mangas.json');
    if (!response.ok) throw new Error('Falha ao carregar');
    
    mangasCache = await response.json();
    return mangasCache;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

// Renderização otimizada
function renderMangaList(mangas) {
  const container = document.getElementById('manga-list');
  container.innerHTML = '';

  if (!mangas.length) {
    container.innerHTML = '<p class="no-results">Nenhum mangá encontrado</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  
  mangas.forEach(manga => {
    const card = document.createElement('article');
    card.className = 'manga-card';
    card.innerHTML = `
      <img data-src="${manga.coverImage}" alt="${manga.title}" class="manga-cover">
      <div class="card-body">
        <h3>${escapeHtml(manga.title)}</h3>
        <p>${escapeHtml(manga.author || 'Autor desconhecido')}</p>
      </div>
    `;
    fragment.appendChild(card);
    lazyLoad(card.querySelector('img'));
  });

  container.appendChild(fragment);
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  const mangas = await loadMangas();
  renderMangaList(mangas);
  
  // Busca
  document.getElementById('search-btn').addEventListener('click', searchMangas);
  document.getElementById('search-input').addEventListener('input', searchMangas);
});

function searchMangas() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const results = mangasCache.filter(manga => 
    manga.title.toLowerCase().includes(query) || 
    (manga.tags && manga.tags.some(tag => tag.toLowerCase().includes(query)))
  );
  renderMangaList(results);
}

// Segurança XSS
function escapeHtml(unsafe) {
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
// Carrega os dados dos mangás
let mangas = [];

async function loadMangas() {
  try {
    const response = await fetch('/data/mangas.json');
    mangas = await response.json();
    renderMangaList(mangas);
  } catch (error) {
    console.error('Erro ao carregar mangás:', error);
    document.getElementById('manga-list').innerHTML = 
      '<div class="error">Erro ao carregar a lista de mangás</div>';
  }
}

// Renderiza a lista de mangás
function renderMangaList(mangasToRender) {
  const container = document.getElementById('manga-list');
  
  if (!mangasToRender.length) {
    container.innerHTML = '<div class="no-results">Nenhum mangá encontrado</div>';
    return;
  }

  container.innerHTML = mangasToRender.map(manga => `
    <article class="manga-card" data-id="${manga.id}">
      <img src="${manga.coverImage || '/images/default-cover.jpg'}" alt="${manga.title}">
      <h3>${escapeHtml(manga.title)}</h3>
      <p>${escapeHtml(manga.author || 'Autor desconhecido')}</p>
    </article>
  `).join('');

  // Adiciona event listeners
  document.querySelectorAll('.manga-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `/manga.html?id=${card.dataset.id}`;
    });
  });
}

// Função de segurança contra XSS
function escapeHtml(unsafe) {
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Inicialização
document.addEventListener('DOMContentLoaded', loadMangas);

// Busca
document.getElementById('search-btn').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.toLowerCase();
  const results = mangas.filter(manga => 
    manga.title.toLowerCase().includes(query) || 
    (manga.tags && manga.tags.some(tag => tag.toLowerCase().includes(query)))
  );
  renderMangaList(results);
});
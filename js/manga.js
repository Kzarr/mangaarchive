// js/manga.js
class MangaViewer {
  constructor() {
    this.mangaId = new URLSearchParams(window.location.search).get('id');
    this.init();
  }

  async init() {
    await this.loadMangaData();
    this.renderChapters();
  }

  async loadMangaData() {
    const response = await fetch('/data/mangas.json');
    const mangas = await response.json();
    this.manga = mangas.find(m => m.id === this.mangaId);
    document.title = `${this.manga.title} - Arquivo de Mangás`;
    // Atualize outros elementos da página...
  }

  renderChapters() {
    const container = document.getElementById('chapters-list');
    container.innerHTML = this.manga.chapters.map(chapter => `
      <li>
        <a href="/chapter.html?manga=${this.mangaId}&chapter=${chapter.number}">
          Capítulo ${chapter.number}: ${chapter.title || ''}
        </a>
      </li>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MangaViewer();
});
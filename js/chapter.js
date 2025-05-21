class ChapterViewer {
  constructor() {
    this.mangaId = new URLSearchParams(window.location.search).get('manga');
    this.chapterNumber = parseInt(new URLSearchParams(window.location.search).get('chapter'));
    this.mangaData = null;
    this.chapterData = null;
    
    this.init();
  }

  async init() {
    await this.loadMangaData();
    this.setupUI();
    this.setupEventListeners();
    this.loadChapter();
  }

  async loadMangaData() {
    try {
      const response = await fetch('/data/mangas.json');
      const mangas = await response.json();
      this.mangaData = mangas.find(m => m.id === this.mangaId);
      
      if (!this.mangaData) {
        throw new Error('Mangá não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar o mangá');
      window.location.href = '/';
    }
  }

  loadChapter() {
    this.chapterData = this.mangaData.chapters.find(c => c.number === this.chapterNumber);
    
    if (!this.chapterData) {
      alert('Capítulo não encontrado');
      window.location.href = `/manga.html?id=${this.mangaId}`;
      return;
    }

    document.getElementById('manga-title').textContent = this.mangaData.title;
    document.getElementById('chapter-title').textContent = 
      `Capítulo ${this.chapterData.number}: ${this.chapterData.title || ''}`;
    
    this.renderPages();
    this.updateNavigation();
  }

  renderPages() {
    const container = document.getElementById('pages-container');
    container.innerHTML = '';
    
    this.chapterData.pages.forEach(page => {
      const img = document.createElement('img');
      img.src = page;
      img.alt = `Página ${this.chapterData.pages.indexOf(page) + 1}`;
      img.className = 'manga-page';
      container.appendChild(img);
    });
  }

  updateNavigation() {
    const hasPrev = this.chapterNumber > 1;
    const hasNext = !!this.mangaData.chapters.find(c => c.number === this.chapterNumber + 1);
    
    document.getElementById('prev-chapter').disabled = !hasPrev;
    document.getElementById('prev-chapter-bottom').disabled = !hasPrev;
    document.getElementById('next-chapter').disabled = !hasNext;
    document.getElementById('next-chapter-bottom').disabled = !hasNext;
  }

  setupUI() {
    document.getElementById('back-btn').href = `/manga.html?id=${this.mangaId}`;
  }

  setupEventListeners() {
    document.getElementById('prev-chapter').addEventListener('click', () => this.navigate(-1));
    document.getElementById('next-chapter').addEventListener('click', () => this.navigate(1));
    document.getElementById('prev-chapter-bottom').addEventListener('click', () => this.navigate(-1));
    document.getElementById('next-chapter-bottom').addEventListener('click', () => this.navigate(1));
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });
  }

  navigate(direction) {
    const newChapter = this.chapterNumber + direction;
    window.location.href = `/chapter.html?manga=${this.mangaId}&chapter=${newChapter}`;
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new ChapterViewer();
});
import AudioManager from './audio-manager.js';
import SynthKeyboard from './synth-keyboard.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Gerenciador de Áudios e Sintetizador
  const audioManager = new AudioManager();
  const synthKeyboard = new SynthKeyboard();

  // 2. Modo Alto Contraste
  const contrastToggleBtn = document.getElementById('contrast-toggle');
  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHigh = document.body.classList.contains('high-contrast');
      contrastToggleBtn.setAttribute('aria-pressed', isHigh ? 'true' : 'false');
      contrastToggleBtn.textContent = isHigh ? '☀️ Modo Normal' : '👁️ Alto Contraste';
    });
  }

  // 3. Tamanho de Fonte (Acessibilidade)
  let fontScale = 1;
  const btnFontIncrease = document.getElementById('font-increase');
  const btnFontReset = document.getElementById('font-reset');
  const btnFontDecrease = document.getElementById('font-decrease');

  const updateFontSize = () => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  };

  if (btnFontIncrease) {
    btnFontIncrease.addEventListener('click', () => {
      if (fontScale < 1.4) {
        fontScale += 0.1;
        updateFontSize();
      }
    });
  }

  if (btnFontDecrease) {
    btnFontDecrease.addEventListener('click', () => {
      if (fontScale > 0.8) {
        fontScale -= 0.1;
        updateFontSize();
      }
    });
  }

  if (btnFontReset) {
    btnFontReset.addEventListener('click', () => {
      fontScale = 1;
      updateFontSize();
    });
  }

  // 4. Atalhos Globais pelo Teclado (Alt + 1, Alt + 2, ...)
  window.addEventListener('keydown', (e) => {
    if (e.altKey) {
      switch (e.key) {
        case '1':
          scrollToSection('hero');
          break;
        case '2':
          scrollToSection('sobre');
          break;
        case '3':
          scrollToSection('como-funciona');
          break;
        case '4':
          scrollToSection('escala-do');
          break;
        case '5':
          scrollToSection('impressao-3d');
          break;
        case '6':
          scrollToSection('beneficios');
          break;
        case '7':
          scrollToSection('publico-alvo');
          break;
      }
    }
  });

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.focus();
    }
  }

  // 5. Modal de Download do Arquivo 3D (STL)
  const modalStl = document.getElementById('modal-stl');
  const openModalBtn = document.getElementById('btn-open-stl');
  const closeModalBtn = document.getElementById('btn-close-stl');

  if (openModalBtn && modalStl) {
    openModalBtn.addEventListener('click', () => {
      modalStl.classList.add('active');
    });
  }

  if (closeModalBtn && modalStl) {
    closeModalBtn.addEventListener('click', () => {
      modalStl.classList.remove('active');
    });
  }

  // Fechar modal ao clicar fora
  if (modalStl) {
    modalStl.addEventListener('click', (e) => {
      if (e.target === modalStl) {
        modalStl.classList.remove('active');
      }
    });
  }

  // 6. Formulário de Contato
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('input-name').value;
      
      if (formFeedback) {
        formFeedback.style.display = 'block';
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada para a equipe de "Música Além da Visão".`;
      }
      contactForm.reset();
    });
  }
});

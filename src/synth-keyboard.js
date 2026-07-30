/**
 * Sintetizador de Teclado Musical Interativo com Braille (Web Audio API)
 * Projeto Música Além da Visão
 */

class SynthKeyboard {
  constructor() {
    this.audioCtx = null;
    this.voiceAnnouncement = true;
    
    // Dados das notas da Escala de Dó com Musicografia Braille oficial (d, e, f, g, h, i, j)
    this.notesData = {
      'C4': { name: 'Dó', freq: 261.63, key: 'A', brailleSymbol: '⠙', brailleDots: 'Pontos 1-4-5', description: 'Nota Dó (C4)' },
      'D4': { name: 'Ré', freq: 293.66, key: 'S', brailleSymbol: '⠑', brailleDots: 'Pontos 1-5', description: 'Nota Ré (D4)' },
      'E4': { name: 'Mi', freq: 329.63, key: 'D', brailleSymbol: '⠋', brailleDots: 'Pontos 1-2-4', description: 'Nota Mi (E4)' },
      'F4': { name: 'Fá', freq: 349.23, key: 'F', brailleSymbol: '⠛', brailleDots: 'Pontos 1-2-4-5', description: 'Nota Fá (F4)' },
      'G4': { name: 'Sol', freq: 392.00, key: 'G', brailleSymbol: '⠓', brailleDots: 'Pontos 1-2-5', description: 'Nota Sol (G4)' },
      'A4': { name: 'Lá', freq: 440.00, key: 'H', brailleSymbol: '⠌', brailleDots: 'Pontos 2-4', description: 'Nota Lá (A4)' },
      'B4': { name: 'Si', freq: 493.88, key: 'J', brailleSymbol: '⠚', brailleDots: 'Pontos 2-4-5', description: 'Nota Si (B4)' },
    };

    this.initKeyboard();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initKeyboard() {
    document.querySelectorAll('.piano-key').forEach(keyEl => {
      const noteId = keyEl.getAttribute('data-note');
      
      const playHandler = (e) => {
        e.preventDefault();
        this.playNote(noteId);
      };

      keyEl.addEventListener('mousedown', playHandler);
      keyEl.addEventListener('touchstart', playHandler, { passive: false });
    });

    const keyMap = {
      'a': 'C4', 'A': 'C4',
      's': 'D4', 'S': 'D4',
      'd': 'E4', 'D': 'E4',
      'f': 'F4', 'F': 'F4',
      'g': 'G4', 'G': 'G4',
      'h': 'A4', 'H': 'A4',
      'j': 'B4', 'J': 'B4',
    };

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      
      const noteId = keyMap[e.key];
      if (noteId && !e.repeat) {
        this.playNote(noteId);
      }
    });

    const announceToggle = document.getElementById('toggle-voice-note');
    if (announceToggle) {
      announceToggle.addEventListener('change', (e) => {
        this.voiceAnnouncement = e.target.checked;
      });
    }
  }

  playNote(noteId) {
    const data = this.notesData[noteId];
    if (!data) return;

    this.initAudioContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(data.freq, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    const keyEl = document.querySelector(`.piano-key[data-note="${noteId}"]`);
    if (keyEl) {
      keyEl.classList.add('active');
      setTimeout(() => keyEl.classList.remove('active'), 300);
    }

    this.updateDisplay(data);

    if (this.voiceAnnouncement && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`${data.name}, ${data.brailleDots}`);
      msg.lang = 'pt-BR';
      msg.rate = 1.2;
      window.speechSynthesis.speak(msg);
    }
  }

  updateDisplay(data) {
    const noteNameEl = document.getElementById('display-note-name');
    const brailleSymbolEl = document.getElementById('display-braille-symbol');
    const brailleDotsEl = document.getElementById('display-braille-dots');

    if (noteNameEl) noteNameEl.textContent = `${data.name} (${data.description})`;
    if (brailleSymbolEl) brailleSymbolEl.textContent = data.brailleSymbol;
    if (brailleDotsEl) brailleDotsEl.textContent = data.brailleDots;
  }
}

export default SynthKeyboard;

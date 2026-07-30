/**
 * Audio Manager para o Projeto Música Além da Visão
 * Transcrições 100% fiéis dos 6 áudios gravados para o curso.
 */

class AudioManager {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.currentAudioElement = null;
    this.playingAudioId = null;

    // Mapeamento dos arquivos MP3 reais na pasta public/audios/
    this.audioPaths = {
      'audio-1': '/audios/audio_01_oque_e_musicografia.mp3',
      'audio-2': '/audios/audio_02_conhecendo_cela.mp3',
      'audio-3': '/audios/audio_03_celulas_do_re_mi.mp3',
      'audio-4': '/audios/audio_04_celulas_fa_sol.mp3',
      'audio-5': '/audios/audio_05_celulas_la_si.mp3',
      'audio-6': '/audios/audio_06_treino_da_aula.mp3',
    };

    // Transcrições literais extraídas dos áudios do curso
    this.transcriptions = {
      'audio-1': 'Bem-vindo! Neste curso você aprenderá a identificar as notas musicais utilizando a Musicografia Braille. A Musicografia Braille é um sistema de escrita musical baseado na célula Braille, formada por seis pontos. Cada combinação de pontos representa um símbolo musical. Neste treinamento você aprenderá primeiro a reconhecer os símbolos pelo tato e em seguida a localizar as notas no teclado adaptado.',
      'audio-2': 'Antes de aprender a Musicografia Braille, é importante conhecer a célula Braille. A célula Braille é a estrutura básica utilizada para representar letras, números, sinais e também os símbolos musicais. Ela é formada por seis posições organizadas em duas colunas. Na coluna da esquerda ficam os pontos 1, 2 e 3. Na coluna da direita ficam os pontos 4, 5 e 6. Imagine duas colunas verticais: na coluna da esquerda, de cima para baixo, estão os pontos 1, 2 e 3. Na coluna da direita, também de cima para baixo, estão os pontos 4, 5 e 6. Cada símbolo é formado pela combinação de alguns desses pontos em relevo. Nem todos os seis pontos aparecem ao mesmo tempo em cada símbolo, apenas alguns pontos ficam elevados enquanto os demais permanecem sem relevo. Para facilitar o aprendizado, vamos conhecer cada posição individualmente: localize o ponto 1: ele está no canto superior esquerdo da célula. Agora localize o ponto 2: ele fica logo abaixo do ponto 1, no centro da coluna à esquerda. Em seguida, encontre o ponto 3: ele está na parte inferior da coluna esquerda. Passe agora para a coluna da direita: o ponto 4 está no canto superior direito. O ponto 5 fica logo abaixo do ponto 4. O ponto 6 está na parte inferior da coluna direita. Explore essas posições lentamente com a ponta do dedo indicador. Repita esse movimento até conseguir identificar cada uma delas sem dificuldade. A partir da próxima aula você aprenderá como essas posições são combinadas para formar os símbolos da Musicografia Braille utilizados nas notas musicais. Reconhecer corretamente cada ponto da célula Braille é o primeiro passo para aprender a ler música pelo tato.',
      'audio-3': 'Vamos detalhar exatamente como são formadas as células Braille para as notas Dó, Ré e Mi conforme o guia visual. Lembre-se: a célula Braille padrão tem seis pontos numerados de 1 a 3 na coluna da esquerda e de 4 a 6 na coluna da direita. Vamos ver como cada nota ocupa esses pontos: Para a nota Dó os pontos ativados são 1, 4 e 5. Isso significa que o primeiro ponto da coluna esquerda está preenchido e os dois primeiros pontos da coluna direita também estão preenchidos. Para a nota Ré utilizamos os pontos 1 e 5. Aqui temos o primeiro ponto da coluna esquerda e o segundo ponto na coluna da direita. Por fim, para a nota Mi, os pontos ativados são 1, 2 e 4. Nesta formação temos os dois primeiros pontos da coluna esquerda e apenas o primeiro ponto da coluna direita.',
      'audio-4': 'Para a nota Fá os pontos ativados são 1, 2, 4 e 5. Isso significa que o primeiro e o segundo ponto da coluna esquerda estão preenchidos, assim como o primeiro e o segundo ponto da coluna direita. Agora para a nota Sol os pontos ativados são 1, 2 e 5. Nesta formação temos o primeiro e o segundo ponto da coluna esquerda preenchidos e o segundo ponto da coluna da direita ativado. Conclusão: essa é a organização exata dos pontos na célula Braille para a leitura das notas Fá e Sol.',
      'audio-5': 'Para a nota Lá os pontos ativados são 2 e 4. Isso significa que o segundo ponto da coluna esquerda está preenchido e apenas o primeiro ponto da coluna direita está ativo. Por fim, para a nota Si os pontos ativados são 2, 4 e 5. Nesta formação temos o segundo ponto da coluna da esquerda ativado e os dois primeiros pontos da coluna da direita ativados. Conclusão: com isso completamos toda a sequência das sete notas na tabela, mantendo a clareza e a lógica da escrita em Braille.',
      'audio-6': 'Vamos fazer um treino de leitura tátil usando apenas o dedo indicador. Primeiro vamos subir a escala nota por nota e depois voltar até o começo. Mantenha o toque leve e acompanhe o ritmo. Subindo a escala, deslize o indicador para a primeira célula: Dó... Ré... Mi... Fá... Sol... Lá... Si... Muito bem! Agora faça o caminho inverso com o mesmo dedo descendo a escala: Si... Lá... Sol... Fá... Mi... Ré... Dó... Parabéns! Você conseguiu executar o treino da aula.'
    };

    this.initPlayers();
  }

  initPlayers() {
    document.querySelectorAll('.btn-play-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audioId = btn.getAttribute('data-audio-id');
        this.toggleAudio(audioId, btn);
      });
    });

    document.querySelectorAll('.speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.getAttribute('data-speed'));
        const parent = btn.closest('.audio-lesson-card');
        
        if (parent) {
          parent.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');

        if (this.currentAudioElement) {
          this.currentAudioElement.playbackRate = rate;
        }
      });
    });
  }

  stopAll() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }

    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }

    document.querySelectorAll('.btn-play-audio').forEach(btn => {
      btn.classList.remove('playing');
      const icon = btn.querySelector('.icon');
      const text = btn.querySelector('.text');
      if (icon) icon.textContent = '▶️';
      if (text) text.textContent = 'Ouvir Aula em Áudio';
    });

    this.playingAudioId = null;
  }

  toggleAudio(audioId, btnElement) {
    if (this.playingAudioId === audioId) {
      this.stopAll();
      return;
    }

    this.stopAll();

    this.playingAudioId = audioId;
    this.updateUI(btnElement, true, 'Carregando...');

    const mp3Path = this.audioPaths[audioId];
    const audioEl = new Audio(mp3Path);

    const card = btnElement.closest('.audio-lesson-card');
    const activeSpeedBtn = card ? card.querySelector('.speed-btn.active') : null;
    const speed = activeSpeedBtn ? parseFloat(activeSpeedBtn.getAttribute('data-speed')) : 1.0;

    audioEl.addEventListener('canplaythrough', () => {
      this.currentAudioElement = audioEl;
      this.currentAudioElement.playbackRate = speed;
      audioEl.play().then(() => {
        this.updateUI(btnElement, true, 'Pausar Áudio');
      }).catch(err => {
        console.warn('Fallback para voz sintetizada:', err);
        this.playSpeechFallback(audioId, btnElement);
      });
    });

    audioEl.addEventListener('error', () => {
      this.playSpeechFallback(audioId, btnElement);
    });

    audioEl.addEventListener('ended', () => {
      this.stopAll();
    });
  }

  playSpeechFallback(audioId, btnElement) {
    const textToRead = this.transcriptions[audioId];
    if (!textToRead || !this.synth) {
      alert('Áudio não disponível.');
      this.stopAll();
      return;
    }

    this.currentUtterance = new SpeechSynthesisUtterance(textToRead);
    this.currentUtterance.lang = 'pt-BR';
    this.currentUtterance.rate = 1.0;

    this.currentUtterance.onstart = () => {
      this.updateUI(btnElement, true, 'Pausar Narração (Voz)');
    };

    this.currentUtterance.onend = () => {
      this.stopAll();
    };

    this.currentUtterance.onerror = () => {
      this.stopAll();
    };

    this.synth.speak(this.currentUtterance);
  }

  updateUI(btn, isPlaying, textLabel) {
    if (!btn) return;
    const icon = btn.querySelector('.icon');
    const text = btn.querySelector('.text');

    if (isPlaying) {
      btn.classList.add('playing');
      if (icon) icon.textContent = '⏸️';
      if (text) text.textContent = textLabel || 'Pausar Áudio';
    } else {
      btn.classList.remove('playing');
      if (icon) icon.textContent = '▶️';
      if (text) text.textContent = 'Ouvir Aula em Áudio';
    }
  }
}

export default AudioManager;

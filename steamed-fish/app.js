const pageContainer = document.querySelector('.page-container');
const scenes = document.querySelectorAll('.scene');
const navDots = document.querySelectorAll('.nav-dot');
const sizzleBtn = document.getElementById('sizzleBtn');
const sizzleText = document.getElementById('sizzleText');
const restartBtn = document.getElementById('restartBtn');
const progressBar = document.getElementById('cookingProgress');
const progressPercent = document.getElementById('progressPercent');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = musicBtn.querySelector('.music-icon');

let currentSceneIndex = 0;
let isScrolling = false;
let cookingProgressInterval = null;

// Audio System
let audioContext = null;
let isPlaying = false;
let isInitialized = false;
let mainGainNode = null;
let arpeggioGainNode = null;
let bassGainNode = null;
let melodyGainNode = null;
let nextNoteTime = 0;
let currentBeat = 0;
let timerID = null;

const TEMPO = 90;
const TONE_DURATION = 0.2;
const ARPEGGIO_NOTES = [523.25, 659.25, 783.99, 659.25]; // C5, E5, G5, E5
const MELODY_NOTES = [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25, 659.25];
const BASS_NOTES = [130.81, 196.00, 130.81, 196.00];

const progressTexts = [
    { percent: 15, text: '热传导中...' },
    { percent: 30, text: '蛋白质变性...' },
    { percent: 70, text: '鱼肉将熟' },
    { percent: 100, text: '出锅!' }
];

function updateScene(index) {
    if (index < 0 || index >= scenes.length) return;
    
    currentSceneIndex = index;
    
    scenes.forEach((scene, i) => {
        scene.classList.remove('active');
        if (i === currentSceneIndex) {
            scene.classList.add('active');
        }
    });
    
    navDots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === currentSceneIndex) {
            dot.classList.add('active');
        }
    });
    
    if (currentSceneIndex === 3) {
        startCookingProgress();
    } else {
        stopCookingProgress();
    }
}

function startCookingProgress() {
    let currentProgress = 0;
    let currentTextIndex = 0;
    progressPercent.textContent = '0%';
    progressBar.style.width = '0%';
    
    if (cookingProgressInterval) {
        clearInterval(cookingProgressInterval);
    }
    
    cookingProgressInterval = setInterval(() => {
        currentProgress += 1;
        progressBar.style.width = `${currentProgress}%`;
        progressPercent.textContent = `${currentProgress}%`;
        
        while (currentTextIndex < progressTexts.length && 
               currentProgress >= progressTexts[currentTextIndex].percent) {
            const statusEl = progressPercent.nextElementSibling;
            if (statusEl && statusEl.classList.contains('progress-status')) {
                statusEl.textContent = progressTexts[currentTextIndex].text;
            }
            currentTextIndex++;
        }
        
        if (currentProgress >= 100) {
            stopCookingProgress();
        }
    }, 80);
}

function stopCookingProgress() {
    if (cookingProgressInterval) {
        clearInterval(cookingProgressInterval);
        cookingProgressInterval = null;
    }
}

// Audio Functions
function initAudio() {
    if (isInitialized) return;
    
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    mainGainNode = audioContext.createGain();
    mainGainNode.connect(audioContext.destination);
    mainGainNode.gain.value = 0.15;
    
    arpeggioGainNode = audioContext.createGain();
    arpeggioGainNode.connect(mainGainNode);
    arpeggioGainNode.gain.value = 0.4;
    
    bassGainNode = audioContext.createGain();
    bassGainNode.connect(mainGainNode);
    bassGainNode.gain.value = 0.3;
    
    melodyGainNode = audioContext.createGain();
    melodyGainNode.connect(mainGainNode);
    melodyGainNode.gain.value = 0.3;
    
    isInitialized = true;
}

function createOscillator(frequency, startTime, endTime, gainNode, waveType = 'sine') {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = waveType;
    osc.frequency.value = frequency;
    
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(1, startTime, 0.02);
    gain.gain.setTargetAtTime(0, endTime, 0.1);
    
    osc.connect(gain);
    gain.connect(gainNode);
    
    osc.start(startTime);
    osc.stop(endTime + 0.1);
}

function playNote(frequency, time, duration, gainNode, waveType = 'sine') {
    const endTime = time + duration;
    createOscillator(frequency, time, endTime, gainNode, waveType);
}

function scheduleArpeggio(time, beat) {
    const noteIndex = beat % ARPEGGIO_NOTES.length;
    playNote(ARPEGGIO_NOTES[noteIndex], time, TONE_DURATION, arpeggioGainNode, 'triangle');
}

function scheduleBass(time, beat) {
    const noteIndex = Math.floor(beat / 2) % BASS_NOTES.length;
    if (beat % 2 === 0) {
        playNote(BASS_NOTES[noteIndex], time, TONE_DURATION * 2, bassGainNode, 'sine');
    }
}

function scheduleMelody(time, beat) {
    if (beat % 4 === 0) {
        const noteIndex = Math.floor(beat / 4) % MELODY_NOTES.length;
        playNote(MELODY_NOTES[noteIndex], time, TONE_DURATION * 3, melodyGainNode, 'triangle');
    }
}

function scheduleNextNotes() {
    const secondsPerBeat = 60.0 / TEMPO;
    
    while (nextNoteTime < audioContext.currentTime + 0.1) {
        scheduleArpeggio(nextNoteTime, currentBeat);
        scheduleBass(nextNoteTime, currentBeat);
        scheduleMelody(nextNoteTime, currentBeat);
        
        nextNoteTime += secondsPerBeat;
        currentBeat++;
    }
}

function schedulerLoop() {
    if (!isPlaying) return;
    scheduleNextNotes();
    timerID = setTimeout(schedulerLoop, 25);
}

function startMusic() {
    if (!isInitialized) {
        initAudio();
    }
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isPlaying = true;
    nextNoteTime = audioContext.currentTime + 0.05;
    currentBeat = 0;
    schedulerLoop();
    
    musicIcon.textContent = '🎵';
    musicIcon.classList.add('playing');
}

function stopMusic() {
    isPlaying = false;
    if (timerID) {
        clearTimeout(timerID);
        timerID = null;
    }
    
    musicIcon.textContent = '🔇';
    musicIcon.classList.remove('playing');
}

function toggleMusic() {
    if (!isInitialized) {
        startMusic();
    } else if (isPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

musicBtn.addEventListener('click', toggleMusic);

navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        scenes[index].scrollIntoView({ behavior: 'smooth' });
    });
});

pageContainer.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    const scrollPosition = pageContainer.scrollTop + pageContainer.clientHeight / 2;
    
    scenes.forEach((scene, i) => {
        const sceneTop = scene.offsetTop;
        const sceneBottom = sceneTop + scene.clientHeight;
        
        if (scrollPosition >= sceneTop && scrollPosition < sceneBottom) {
            if (currentSceneIndex !== i) {
                updateScene(i);
            }
        }
    });
    
    setTimeout(() => {
        isScrolling = false;
    }, 100);
});

sizzleBtn.addEventListener('click', () => {
    sizzleText.classList.add('active');
    setTimeout(() => {
        sizzleText.classList.remove('active');
    }, 1000);
});

restartBtn.addEventListener('click', () => {
    scenes[0].scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = Math.min(currentSceneIndex + 1, scenes.length - 1);
        scenes[nextIndex].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = Math.max(currentSceneIndex - 1, 0);
        scenes[prevIndex].scrollIntoView({ behavior: 'smooth' });
    }
});

updateScene(0);

const style = document.createElement('style');
style.textContent = `
@keyframes drift {
    0% { transform: translateX(-100px) translateY(80px); }
    100% { transform: translateX(100px) translateY(80px); }
}
`;
document.head.appendChild(style);

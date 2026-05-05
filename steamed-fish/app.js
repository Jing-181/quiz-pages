const pageContainer = document.querySelector('.page-container');
const scenes = document.querySelectorAll('.scene');
const navDots = document.querySelectorAll('.nav-dot');
const sizzleBtn = document.getElementById('sizzleBtn');
const sizzleText = document.getElementById('sizzleText');
const restartBtn = document.getElementById('restartBtn');
const progressBar = document.getElementById('cookingProgress');
const progressPercent = document.getElementById('progressPercent');

let currentSceneIndex = 0;
let isScrolling = false;
let cookingProgressInterval = null;

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

navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        scenes[index].scrollIntoView({ behavior: 'smooth' });
    });
});

pageContainer.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    isScrolling = true;
    
    const scrollPosition = pageContainer.scrollTop + pageContainer.clientHeight / 2;
    
    scenes.forEach((scene, index) => {
        const sceneTop = scene.offsetTop;
        const sceneBottom = sceneTop + scene.clientHeight;
        
        if (scrollPosition >= sceneTop && scrollPosition < sceneBottom) {
            if (currentSceneIndex !== index) {
                updateScene(index);
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

document.addEventListener('DOMContentLoaded', () => {
    const cloud1 = document.querySelector('.scene-hero .cloud:first-of-type');
    const cloud2 = document.querySelector('.scene-hero .cloud:last-of-type');
    
    if (cloud1) {
        cloud1.style.animation = 'drift 30s linear infinite';
    }
    if (cloud2) {
        cloud2.style.animation = 'drift 25s linear infinite reverse';
    }
});

const style = document.createElement('style');
style.textContent = `
@keyframes drift {
    0% { transform: translateX(-100px) translateY(80px); }
    100% { transform: translateX(100px) translateY(80px); }
}
`;
document.head.appendChild(style);

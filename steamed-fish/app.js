const scenes = document.querySelectorAll('.scene');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sceneCounter = document.getElementById('sceneCounter');
const progressBar = document.getElementById('progressBar');
const sizzleBtn = document.getElementById('sizzleBtn');
const sizzleText = document.getElementById('sizzleText');

let currentScene = 0;
let typewriterTimeouts = [];

const sceneContent = {
    1: `> Input Params:

  - 主料: 鲈鱼 x 1 条

  - 辅料: 葱 x 2 根 | 姜 x 1 块

  - 调料: 蒸鱼豉油 x 1 勺 | 油 x 5g`,
    2: `> 预处理...

  鱼身划刀 -> OK
  塞入姜片 -> OK
  装盘待蒸 -> OK`,
    3: `[蒸煮进程]

██░░░░░░░░ 15%  |  热传导中...
████░░░░░░ 30%  |  蛋白质变性...
████████░░ 70%  |  鱼肉将熟
██████████ 100% | 出锅`,
    5: `> return {
    蛋白质:   33g,
    脂肪:      8g,
    碳水:      0g,
    耗时:     16min,
    满足感:   9/10
  };`
};

function initScene() {
    scenes.forEach((scene, index) => {
        scene.classList.remove('active');
        if (index === currentScene) {
            scene.classList.add('active');
        }
    });
    updateButtons();
    updateCounter();
    updateProgressBar();
    
    if (currentScene === 1) {
        typewriter('scene1-text', sceneContent[1]);
    } else if (currentScene === 2) {
        typewriter('scene2-text', sceneContent[2]);
    } else if (currentScene === 3) {
        showCookingProgress();
    } else if (currentScene === 5) {
        typewriter('scene5-text', sceneContent[5]);
    }
}

function updateButtons() {
    prevBtn.disabled = currentScene === 0;
    nextBtn.disabled = currentScene === scenes.length - 1;
}

function updateCounter() {
    sceneCounter.textContent = `${currentScene + 1} / ${scenes.length}`;
}

function updateProgressBar() {
    const progress = ((currentScene + 1) / scenes.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function clearTypewriter() {
    typewriterTimeouts.forEach(timeout => clearTimeout(timeout));
    typewriterTimeouts = [];
}

function typewriter(elementId, text) {
    clearTypewriter();
    const element = document.getElementById(elementId);
    element.innerHTML = '';
    let index = 0;

    function type() {
        if (index <= text.length) {
            element.innerHTML = `<pre>${text.slice(0, index)}<span class="cursor"></span></pre>`;
            index++;
            typewriterTimeouts.push(setTimeout(type, 50));
        } else {
            element.innerHTML = `<pre>${text}</pre>`;
        }
    }

    type();
}

function showCookingProgress() {
    const element = document.getElementById('scene3-text');
    const lines = sceneContent[3].split('\n');
    element.innerHTML = '';
    let lineIndex = 0;

    function showLine() {
        if (lineIndex < lines.length) {
            const currentText = lines.slice(0, lineIndex + 1).join('\n');
            element.innerHTML = `<pre>${currentText}</pre>`;
            lineIndex++;
            typewriterTimeouts.push(setTimeout(showLine, 1000));
        }
    }

    showLine();
}

prevBtn.addEventListener('click', () => {
    if (currentScene > 0) {
        clearTypewriter();
        currentScene--;
        initScene();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentScene < scenes.length - 1) {
        clearTypewriter();
        currentScene++;
        initScene();
    }
});

sizzleBtn.addEventListener('click', () => {
    sizzleText.classList.add('active');
    setTimeout(() => {
        sizzleText.classList.remove('active');
    }, 1000);
});

const uploadOverlays = document.querySelectorAll('.upload-overlay');
uploadOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        const ingredient = overlay.dataset.ingredient;
        alert(`您可以上传 ${getIngredientName(ingredient)} 的图片到 images/${ingredient}.jpg`);
    });
});

function getIngredientName(key) {
    const names = {
        'fish': '鲈鱼',
        'scallion': '葱',
        'ginger': '姜',
        'soy-sauce': '蒸鱼豉油',
        'oil': '食用油'
    };
    return names[key] || key;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        nextBtn.click();
    }
});

initScene();
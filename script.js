// --- AUDIO VISUALIZER ENGINE ---
const audio = document.getElementById('myAudio');
const canvas = document.getElementById('visualizer');
const playBtn = document.getElementById('playBtn');

if (audio && canvas && playBtn) {
    const ctx = canvas.getContext('2d');
    let audioCtx, analyser, source, dataArray;

    playBtn.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = 256; 
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }

        if (audio.paused) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            audio.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            draw();
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });

    function draw() {
        if (audio.paused) return;
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / dataArray.length) * 1.2;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            let barHeight = (dataArray[i] / 255) * canvas.height;
            let alpha = dataArray[i] / 255;
            if (alpha < 0.15) alpha = 0.15; 

            ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
}

// --- AUTOMATIC ACTIVE NAV-LINK SYSTEM ---
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.nav-links li a');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
        link.parentElement.classList.add('active');
    } else {
        link.parentElement.classList.remove('active');
    }
});

if (currentPage === "" || currentPage === "index.html") {
    const homeLink = document.querySelector('.nav-links a[href="index.html"]');
    if (homeLink) homeLink.parentElement.classList.add('active');
}

// --- THEME TOGGLE ENGINE ---
const themeBtn = document.getElementById('themeBtn');
let isDark = true;

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        isDark = !isDark;
        if(!isDark) {
            document.documentElement.style.setProperty('--bg-color', '#f8fafc');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--inner-card-bg', '#f1f5f9');
            document.documentElement.style.setProperty('--text-color', '#475569');
            document.documentElement.style.setProperty('--text-white', '#0f172a');
            document.documentElement.style.setProperty('--border-color', '#e2e8f0');
            themeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
        } else {
            document.documentElement.style.setProperty('--bg-color', '#0f172a');
            document.documentElement.style.setProperty('--card-bg', '#1e293b');
            document.documentElement.style.setProperty('--inner-card-bg', '#0f172a');
            document.documentElement.style.setProperty('--text-color', '#cbd5e1');
            document.documentElement.style.setProperty('--text-white', '#ffffff');
            document.documentElement.style.setProperty('--border-color', '#334155');
            themeBtn.innerHTML = '<i class="fa-regular fa-sun"></i>';
        }
    });
}

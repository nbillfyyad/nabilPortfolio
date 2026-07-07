const audio = document.getElementById('myAudio');
const canvas = document.getElementById('visualizer');
const playBtn = document.getElementById('playBtn');
const ctx = canvas.getContext('2d');

let audioCtx, analyser, source, dataArray;

playBtn.addEventListener('click', () => {
    // Membuat AudioContext setelah interaksi pengguna
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        
        // Menghubungkan element audio ke script analyser
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        // 256 menghasilkan sekitar 128 bar frekuensi (lebih padat)
        analyser.fftSize = 256; 
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audio.paused) {
        // Memastikan AudioContext aktif kembali jika sempat tertidur (suspend)
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
    
    // Menghitung lebar bar secara dinamis sesuai ukuran canvas
    const barWidth = (canvas.width / dataArray.length) * 1.2;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        // Skala tinggi bar agar proporsional dengan tinggi canvas
        let barHeight = (dataArray[i] / 255) * canvas.height;
        
        // Hitung persentase tinggi (0 sampai 1) untuk opacity dinamis
        let alpha = dataArray[i] / 255;
        // Batasi opacity paling rendah agar bar tidak hilang sepenuhnya saat diam (min: 0.15)
        if (alpha < 0.15) alpha = 0.15; 

        // Set warna menggunakan RGBA (Tema Cyan: r=6, g=182, b=212)
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        
        // Gambar bar dari bawah ke atas
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        // Jarak antar bar kecil saja (1px) agar terlihat rapat dan mulus
        x += barWidth + 1;
    }
}


// Mengatur menu aktif ketika di-klik
const navItems = document.querySelectorAll('.nav-links li');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Hapus kelas 'active' dari semua menu
        navItems.forEach(nav => nav.classList.remove('active'));
        // Tambahkan ke menu yang baru di-klik
        this.classList.add('active');
    });
});

// Fitur ganti tema (Dark/Light mode) sederhana
const themeBtn = document.getElementById('themeBtn');
let isDark = true;

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

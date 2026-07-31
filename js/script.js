// Audio Chanting Simulation
let isPlaying = false;
const playBtn = document.getElementById('play-btn');
const playerCard = document.querySelector('.mantra-player-card');
const trackTitle = document.getElementById('current-mantra-name');

// Web Audio API Synth to create a real chanting "Om" sound frequency
let audioCtx;
let oscillator;
let gainNode;

function toggleAudio() {
    if (!isPlaying) {
        startChantingSound();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playerCard.classList.add('playing');
        isPlaying = true;
    } else {
        stopChantingSound();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playerCard.classList.remove('playing');
        isPlaying = false;
    }
}

function startChantingSound() {
    // Create soft ambient drone sound (136.1 Hz - Om Frequency)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(136.1, audioCtx.currentTime); // C# / Om sound frequency
    
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
}

function stopChantingSound() {
    if (audioCtx) {
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
            if (oscillator) oscillator.stop();
            if (audioCtx) audioCtx.close();
        }, 500);
    }
}

playBtn.addEventListener('click', toggleAudio);

// Playlist Click Handler
function playMantra(mantraName) {
    trackTitle.innerText = mantraName;
    
    // Update active UI track item
    const tracks = document.querySelectorAll('.playlist .track');
    tracks.forEach(track => {
        const text = track.querySelector('span').innerText;
        const icon = track.querySelector('i');
        
        if (text === mantraName) {
            track.classList.add('active');
            icon.className = 'fa-solid fa-volume-high';
        } else {
            track.classList.remove('active');
            icon.className = 'fa-solid fa-play';
        }
    });

    if (!isPlaying) {
        toggleAudio();
    }
}

// Deity Selection Handler
function selectDeity(deityName) {
    const cards = document.querySelectorAll('.deity-card');
    cards.forEach(card => card.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    console.log(`Switched view to ${deityName}`);
}

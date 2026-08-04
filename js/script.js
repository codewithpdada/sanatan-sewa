// Audio Track Data Setup
const lakkhaSongs = [
    { 
        title: "Pyara Saja Hai Tera Dwar", 
        deity: "Durga Maa", 
        file: "audio/pyara_saja_hai.mp3" 
    },
    { 
        title: "Ram Na Milenge Hanuman Ke Bina", 
        deity: "Shri Hanuman", 
        file: "audio/ram_na_milenge.mp3" 
    },
    { 
        title: "Keejo Kesari Ke Laal", 
        deity: "Shri Hanuman", 
        file: "audio/keejo_kesari.mp3" 
    },
    { 
        title: "Bholenath Ka Damru Bol Raha Hai", 
        deity: "Shri Shiva", 
        file: "audio/bholenath_damru.mp3" 
    },
    { 
        title: "Maiya Ka Chola Hai Rangla", 
        deity: "Durga Maa", 
        file: "audio/maiya_ka_chola.mp3" 
    },
    { 
        title: "Shri Hanuman Chalisa", 
        deity: "Shri Hanuman", 
        file: "audio/hanuman_chalisa.mp3" 
    },
    { 
        title: "Are Dwaar Paalo Kanhaiya Se Keh Do", 
        deity: "Shri Ram", 
        file: "audio/are_dwaar_paalo.mp3" 
    }
];

// Deity Content Configurations
const deityConfig = {
    "Shri Shiva": {
        quote: '"Om Namah Shivaya — Embracing the infinite inner light and eternal calm."',
        image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=1200&auto=format&fit=crop"
    },
    "Shri Hanuman": {
        quote: '"Sankat Mochan Mahabali Hanuman — The embodiment of devotion, courage, and selfless service."',
        image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=1200&auto=format&fit=crop"
    },
    "Shri Ram": {
        quote: '"Maryada Purushottam Shri Ram — Eternal embodiment of righteousness, truth, and compassion."',
        image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1200&auto=format&fit=crop"
    },
    "Durga Maa": {
        quote: '"Jai Mata Di — Supreme Shakti, radiating eternal strength, love, and divine grace."',
        image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop"
    }
};

let currentTrackIndex = 0;
let isPlaying = false;

// DOM Element References
const audioPlayer = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const trackTitleElem = document.getElementById('current-mantra-name');
const trackArtistElem = document.getElementById('current-track-artist');
const visualizer = document.getElementById('visualizer');
const playlistContainer = document.getElementById('playlist-container');

// Initialize Website Features
document.addEventListener('DOMContentLoaded', () => {
    renderPlaylist();
    setupAudioListeners();
});

// Render Dynamic Playlist UI
function renderPlaylist() {
    playlistContainer.innerHTML = '';
    lakkhaSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = `track ${index === currentTrackIndex ? 'active' : ''}`;
        li.onclick = () => playMantra(index);

        li.innerHTML = `
            <div class="track-info">
                <strong>${song.title}</strong>
                <small>${song.deity} Bhajan</small>
            </div>
            <i class="${index === currentTrackIndex && isPlaying ? 'fa-solid fa-volume-high' : 'fa-solid fa-play'}"></i>
        `;
        playlistContainer.appendChild(li);
    });
}

// Play Selected Mantra Track
function playMantra(index) {
    currentTrackIndex = index;
    const song = lakkhaSongs[currentTrackIndex];
    
    trackTitleElem.textContent = song.title;
    trackArtistElem.textContent = `Lakhbir Singh Lakkha • ${song.deity}`;
    
    audioPlayer.src = song.file;
    
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayerUI();
    }).catch(err => {
        console.warn("Audio waiting for user click interaction or source file missing:", err);
        isPlaying = false;
        updatePlayerUI();
    });

    renderPlaylist();
}

// Play / Pause Toggle
function togglePlay() {
    if (!audioPlayer.src) {
        playMantra(currentTrackIndex);
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            isPlaying = true;
        }).catch(err => console.log("Playback error:", err));
    }
    updatePlayerUI();
}

// Next / Previous Controls
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % lakkhaSongs.length;
    playMantra(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + lakkhaSongs.length) % lakkhaSongs.length;
    playMantra(currentTrackIndex);
}

// Volume Slider Handler
function changeVolume(value) {
    audioPlayer.volume = value;
}

// Sync Audio Player UI Elements
function updatePlayerUI() {
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
        if (visualizer) visualizer.classList.add('playing');
    } else {
        icon.className = 'fa-solid fa-play';
        if (visualizer) visualizer.classList.remove('playing');
    }
    renderPlaylist();
}

// Setup Automatic Song Transition when track ends
function setupAudioListeners() {
    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });
}

// Select Deity and Update Hero Cards + Active Songs
function selectDeity(deityName) {
    // 1. Update Hero Card Image & Quote
    const heroTitle = document.getElementById('hero-deity-title');
    const heroQuote = document.getElementById('hero-deity-quote');
    const heroImg = document.getElementById('hero-img');

    if (deityConfig[deityName]) {
        heroTitle.textContent = deityName;
        heroQuote.textContent = deityConfig[deityName].quote;
        heroImg.src = deityConfig[deityName].image;
    }

    // 2. Highlight active deity button
    const buttons = document.querySelectorAll('.deity-card');
    buttons.forEach(btn => {
        const text = btn.querySelector('span').textContent;
        if (text === deityName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 3. Play first song matching deity selection
    const songIdx = lakkhaSongs.findIndex(s => s.deity === deityName);
    if (songIdx !== -1) {
        playMantra(songIdx);
    }
}

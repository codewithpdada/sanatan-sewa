// Track list configuration
const lakkhaSongs = [
    { title: "Pyara Saja Hai Tera Dwar", deity: "Durga Maa", file: "audio/pyara_saja_hai.mp3" },
    { title: "Ram Na Milenge Hanuman Ke Bina", deity: "Shri Hanuman", file: "audio/ram_na_milenge.mp3" },
    { title: "Keejo Kesari Ke Laal", deity: "Shri Hanuman", file: "audio/keejo_kesari.mp3" },
    { title: "Bholenath Ka Damru Bol Raha Hai", deity: "Shri Shiva", file: "audio/bholenath_damru.mp3" },
    { title: "Maiya Ka Chola Hai Rangla", deity: "Durga Maa", file: "audio/maiya_ka_chola.mp3" },
    { title: "Shri Hanuman Chalisa", deity: "Shri Hanuman", file: "audio/hanuman_chalisa.mp3" },
    { title: "Are Dwaar Paalo Kanhaiya Se Keh Do", deity: "Shri Krishna", file: "audio/are_dwaar_paalo.mp3" }
];

let currentTrackIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const trackTitleElem = document.getElementById('current-mantra-name');
const trackArtistElem = document.getElementById('current-track-artist');
const visualizer = document.getElementById('visualizer');
const playlistItems = document.querySelectorAll('#playlist-container li');

function playMantra(index) {
    currentTrackIndex = index;
    const song = lakkhaSongs[currentTrackIndex];
    
    trackTitleElem.textContent = song.title;
    trackArtistElem.textContent = `Lakhbir Singh Lakkha • ${song.deity}`;
    
    // Set Audio Source (ensure MP3 files exist in audio/ folder or link remote URL)
    audioPlayer.src = song.file;
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayerUI();
    }).catch(err => {
        console.log("Audio file playback waiting for user action or file missing:", err);
        isPlaying = false;
        updatePlayerUI();
    });

    updatePlaylistActiveState();
}

function togglePlay() {
    if (!audioPlayer.src) {
        playMantra(currentTrackIndex);
        return;
    }

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    updatePlayerUI();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % lakkhaSongs.length;
    playMantra(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + lakkhaSongs.length) % lakkhaSongs.length;
    playMantra(currentTrackIndex);
}

function updatePlayerUI() {
    const icon = playBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
        if (visualizer) visualizer.classList.add('playing');
    } else {
        icon.className = 'fa-solid fa-play';
        if (visualizer) visualizer.classList.remove('playing');
    }
}

function updatePlaylistActiveState() {
    playlistItems.forEach((item, i) => {
        const icon = item.querySelector('i');
        if (i === currentTrackIndex) {
            item.classList.add('active');
            icon.className = isPlaying ? 'fa-solid fa-volume-high' : 'fa-solid fa-play';
        } else {
            item.classList.remove('active');
            icon.className = 'fa-solid fa-play';
        }
    });
}

function selectDeity(deityName) {
    const heroTitle = document.getElementById('hero-deity-title');
    const heroQuote = document.getElementById('hero-deity-quote');
    const heroImg = document.getElementById('hero-img');

    heroTitle.textContent = deityName;
    
    // Quick filter to play first matching song by deity if available
    const songIdx = lakkhaSongs.findIndex(s => s.deity === deityName);
    if (songIdx !== -1) {
        playMantra(songIdx);
    }
}

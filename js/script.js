// --- Track list configuration (Lakhbir Singh Lakkha Hits) ---
const bhaktiSongs = [
    { title: "Pyara Saja Hai Tera Dwar", artist: "Lakhbir Singh Lakkha", deity: "Durga Maa", file: "audio/pyara_saja_hai.mp3" },
    { title: "Ram Na Milenge Hanuman Ke Bina", artist: "Lakhbir Singh Lakkha", deity: "Shri Hanuman", file: "audio/ram_na_milenge.mp3" },
    { title: "Keejo Kesari Ke Laal", artist: "Lakhbir Singh Lakkha", deity: "Shri Hanuman", file: "audio/keejo_kesari.mp3" },
    { title: "Bholenath Ka Damru Bol Raha Hai", artist: "Lakhbir Singh Lakkha", deity: "Shri Shiva", file: "audio/bholenath_damru.mp3" },
    { title: "Maiya Ka Chola Hai Rangla", artist: "Lakhbir Singh Lakkha", deity: "Durga Maa", file: "audio/maiya_ka_chola.mp3" },
    { title: "Shri Hanuman Chalisa", artist: "T-Series Bhakti", deity: "Shri Hanuman", file: "audio/hanuman_chalisa.mp3" }, // Fixed Artist
    { title: "Are Dwaar Paalo Kanhaiya Se Keh Do", artist: "Lakhbir Singh Lakkha", deity: "Shri Krishna", file: "audio/are_dwaar_paalo.mp3" }
];

// --- Readings Database (Placeholders for demonstration) ---
const sacredTexts = {
    shiv_tandav: `<h4>Shiva Tandava Stotram</h4><p>Jatatavigalajjala pravahapavitasthale<br>Galeavalambya lambitam bhujangatungamalikam...</p><p>(This is a magnificent stotram describing Lord Shiva's power... full text coming soon.)</p>`,
    hanuman_chalisa: `<h4>Shri Hanuman Chalisa</h4><p>Shri Guru Charan Saroj Raj<br>Nij Manu Mukur Sudhari<br>Barnau Raghuvar Bimal Jasu<br>Jo Dayaku Phal Chari...</p><p>(The complete 40 verses of praise and devotion to Lord Hanuman.)</p>`,
    durga_chalisa: `<h4>Durga Chalisa</h4><p>Namo Namo Durge Sukh karni<br>Namo Namo Ambe Dukh harni...<br>Nirankar hai jyoti tumhari<br>Tihun lok pheli ujiyari...</p><p>(The sacred verses invoking the power of Goddess Durga.)</p>`
};

// --- Initialization & State Management ---
let currentTrackIndex = 0;
let isPlaying = false;
let currentJapaCount = 0;

const audioPlayer = document.getElementById('main-audio-player');
const playBtn = document.getElementById('play-btn');
const trackTitleElem = document.getElementById('current-mantra-name');
const trackArtistElem = document.getElementById('current-track-artist');
const visualizer = document.getElementById('visualizer');
const playlistContainer = document.getElementById('playlist-container');

// Run on page load
window.onload = function() {
    populatePlaylist();
    updateJapaDisplay();
};

// --- Panel Navigation System ---
function showPanel(panelId, navButton) {
    // 1. Hide all panels
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // 2. Show the selected panel
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // 3. Update active nav button state
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    if (navButton) {
        navButton.classList.add('active');
    }
}

// --- Bhakti Audio System ---

// Populate the decoupled playlist UI
function populatePlaylist() {
    playlistContainer.innerHTML = ''; // Clear existing
    bhaktiSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'track' + (index === 0 ? ' active' : '');
        li.onclick = () => playMantra(index);

        li.innerHTML = `
            <div class="track-info">
                <strong>${song.title}</strong>
                <small>${song.artist} • ${song.deity}</small>
            </div>
            <i class="fa-solid fa-play"></i>
        `;
        playlistContainer.appendChild(li);
    });
}

function playMantra(index) {
    currentTrackIndex = index;
    const song = bhaktiSongs[currentTrackIndex];
    
    trackTitleElem.textContent = song.title;
    trackArtistElem.textContent = `${song.artist} • ${song.deity}`;
    
    // Set Audio Source (ensure files exist in audio/ folder)
    audioPlayer.src = song.file;
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayerUI();
    }).catch(err => {
        console.log("Playback waiting for user action or file missing:", err);
        isPlaying = false;
        updatePlayerUI();
    });

    updatePlaylistActiveState();
}

// (TogglePlay, NextTrack, PrevTrack, UpdatePlayerUI, UpdatePlaylistActiveState remains similar to image_0.png script, just referencing the refined playlist structure.)
function togglePlay() {
    if (!audioPlayer.src) { playMantra(currentTrackIndex); return; }
    if (isPlaying) { audioPlayer.pause(); isPlaying = false; }
    else { audioPlayer.play(); isPlaying = true; }
    updatePlayerUI();
    updatePlaylistActiveState();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % bhaktiSongs.length;
    playMantra(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + bhaktiSongs.length) % bhaktiSongs.length;
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
    const playlistItems = document.querySelectorAll('#playlist-container li');
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

// --- Filter Audio by Deity (from Nav dropdown) ---
function filterAudioByDeity(deityName) {
    showPanel('audio-panel'); // Ensure audio panel is open
    // Find the first track matching the deity
    const index = bhaktiSongs.findIndex(song => song.deity === deityName);
    if (index !== -1) {
        playMantra(index);
    }
}

// --- Readings System (Stotras & Chalisa) ---
function showReading(textKey, navButton) {
    showPanel('readings-panel'); // Ensure readings panel is open
    const contentArea = document.getElementById('reading-content-area');
    
    // 1. Populate text
    if (sacredTexts[textKey]) {
        contentArea.innerHTML = sacredTexts[textKey];
    } else {
        contentArea.innerHTML = '<p class="error-text">Text not found.</p>';
    }

    // 2. Handle active state in reading sub-nav
    if (navButton) {
        const readNavButtons = document.querySelectorAll('.read-nav-btn');
        readNavButtons.forEach(btn => btn.classList.remove('active'));
        navButton.classList.add('active');
    }
}

// --- Mantra Japa Counter System ---
function incrementJapa() {
    currentJapaCount++;
    updateJapaDisplay();
}

function resetJapa() {
    if (confirm("Reset the Japa count to zero?")) {
        currentJapaCount = 0;
        updateJapaDisplay();
    }
}

function updateJapaDisplay() {
    const countDisplay = document.getElementById('japa-count');
    if (countDisplay) {
        countDisplay.textContent = currentJapaCount;
    }
}

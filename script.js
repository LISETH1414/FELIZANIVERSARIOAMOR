// Variables globales
let moments = [];
let dateEvents = [];
let loveLetters = [];
let wishes = [];
const STORAGE_KEY = 'momentosEspeciales';
const DATE_STORAGE_KEY = 'fechaAniversario';
const EVENTS_STORAGE_KEY = 'eventos';
const LETTERS_STORAGE_KEY = 'cartasDeAmor';
const WISHES_STORAGE_KEY = 'deseos';
const STATS_STORAGE_KEY = 'estadisticas';

// Cargar datos del localStorage al iniciar
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        moments = JSON.parse(saved);
    }

    const savedDate = localStorage.getItem(DATE_STORAGE_KEY);
    if (savedDate) {
        document.getElementById('anniversaryDate').value = savedDate;
        startCounter(savedDate);
    }

    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEvents) {
        dateEvents = JSON.parse(savedEvents);
        renderTimeline();
    }

    const savedLetters = localStorage.getItem(LETTERS_STORAGE_KEY);
    if (savedLetters) {
        loveLetters = JSON.parse(savedLetters);
        renderLoveLetters();
    }

    const savedWishes = localStorage.getItem(WISHES_STORAGE_KEY);
    if (savedWishes) {
        wishes = JSON.parse(savedWishes);
        renderWishes();
    }

    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    if (savedStats) {
        const stats = JSON.parse(savedStats);
        document.getElementById('hugsCount').value = stats.hugs || 0;
        document.getElementById('kissesCount').value = stats.kisses || 0;
        document.getElementById('moviesCount').value = stats.movies || 0;
        document.getElementById('tripsCount').value = stats.trips || 0;
    }

    renderMoments();
}

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
}

function saveEvents() {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(dateEvents));
}

function saveLetters() {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(loveLetters));
}

function saveWishes() {
    localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
}

function saveStats() {
    const stats = {
        hugs: parseInt(document.getElementById('hugsCount').value) || 0,
        kisses: parseInt(document.getElementById('kissesCount').value) || 0,
        movies: parseInt(document.getElementById('moviesCount').value) || 0,
        trips: parseInt(document.getElementById('tripsCount').value) || 0
    };
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}

// ==================== MÚSICA ====================
let isPlaying = false;
const audio = document.getElementById('backgroundMusic');

function toggleMusic() {
    const btn = document.getElementById('musicBtn');
    if (isPlaying) {
        audio.pause();
        btn.textContent = '🎵 Activar Música';
        btn.classList.remove('active');
        isPlaying = false;
    } else {
        audio.play().catch(err => {
            console.log('No se puede reproducir la música automáticamente:', err);
            alert('Haz clic en el botón para reproducir la música 🎵');
        });
        btn.textContent = '⏸️ Pausar Música';
        btn.classList.add('active');
        isPlaying = true;
    }
}

function changeVolume(value) {
    audio.volume = value / 100;
}

// ==================== CONTADOR PRINCIPAL ====================
function setupDate() {
    const date = document.getElementById('anniversaryDate').value;
    if (!date) {
        alert('Por favor selecciona una fecha 📅');
        return;
    }
    
    localStorage.setItem(DATE_STORAGE_KEY, date);
    startCounter(date);
    alert('¡Fecha guardada! 💕 El contador ha comenzado...');
}

function startCounter(dateString) {
    function updateCounter() {
        const target = new Date(dateString).getTime();
        const now = new Date().getTime();
        const distance = now - target;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
}

// ==================== TIMELINE / FECHAS ESPECIALES ====================
function addDateModal() {
    document.getElementById('dateModal').style.display = 'block';
}

function closeDateModal() {
    document.getElementById('dateModal').style.display = 'none';
    document.getElementById('dateForm').reset();
}

document.getElementById('dateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const event = {
        id: Date.now(),
        date: document.getElementById('dateEventDate').value,
        title: document.getElementById('dateEventTitle').value,
        description: document.getElementById('dateEventDescription').value,
        type: document.getElementById('dateEventType').value
    };

    dateEvents.push(event);
    dateEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveEvents();
    renderTimeline();
    closeDateModal();
    alert('¡Salida/Fecha especial agregada! 🎉');
});

function renderTimeline() {
    const container = document.getElementById('timelineContainer');

    if (dateEvents.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay fechas especiales aún. ¡Agrega la primera! ✨</p>';
        return;
    }

    const typeEmojis = {
        cita: '💑',
        viaje: '✈️',
        celebracion: '🎉',
        aniversario: '🎂',
        otro: '✨'
    };

    container.innerHTML = dateEvents.map(event => `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(event.date)}</div>
            <div class="timeline-type">${typeEmojis[event.type]} ${event.type}</div>
            <div class="timeline-title">${event.title}</div>
            ${event.description ? `<div class="timeline-description">${event.description}</div>` : ''}
            <div class="timeline-actions">
                <button class="btn-delete" onclick="deleteEvent(${event.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function deleteEvent(id) {
    if (confirm('¿Seguro que quieres eliminar esta fecha?')) {
        dateEvents = dateEvents.filter(e => e.id !== id);
        saveEvents();
        renderTimeline();
        alert('Fecha eliminada 💔');
    }
}

// ==================== MOMENTOS ESPECIALES ====================
function addMoment(event) {
    event.preventDefault();

    const moment = {
        id: Date.now(),
        date: document.getElementById('momentDate').value,
        title: document.getElementById('momentTitle').value,
        description: document.getElementById('momentDescription').value,
        image: document.getElementById('momentImage').value || null,
        emoji: document.getElementById('momentEmoji').value || '💕',
        isTop: document.getElementById('momentImportance').checked
    };

    moments.unshift(moment);
    saveData();
    renderMoments();
    
    document.getElementById('momentForm').reset();
    document.getElementById('momentEmoji').value = '💕';
    
    alert('¡Momento especial guardado! 💕');
}

function renderMoments() {
    const topMoments = moments.filter(m => m.isTop);
    const allMoments = moments;

    // Renderizar top moments
    const topContainer = document.getElementById('topMomentsList');
    if (topMoments.length === 0) {
        topContainer.innerHTML = '<p class="empty-message">Aún no hay momentos TOP. ¡Marca algunos como especiales! ⭐</p>';
    } else {
        topContainer.innerHTML = topMoments.map(moment => renderMomentCard(moment, true)).join('');
    }

    // Renderizar todos los momentos
    const allContainer = document.getElementById('allMomentsList');
    if (allMoments.length === 0) {
        allContainer.innerHTML = '<p class="empty-message">Aún no hay momentos. ¡Agrega el primero! 💕</p>';
    } else {
        allContainer.innerHTML = allMoments.map(moment => renderMomentCard(moment, false)).join('');
    }

    // Renderizar galería
    renderGallery();
}

function renderMomentCard(moment, isTop) {
    return `
        <div class="moment-card ${isTop ? 'top-moment' : ''}">
            <div class="moment-image">
                ${moment.image ? `<img src="${moment.image}" alt="${moment.title}" onerror="this.parentElement.textContent='${moment.emoji}'">` : moment.emoji}
            </div>
            <div class="moment-content">
                <div class="moment-date">${formatDate(moment.date)}</div>
                <div class="moment-title">
                    <span class="moment-emoji">${moment.emoji}</span>
                    ${moment.title}
                    ${isTop ? '<span class="top-badge">⭐ TOP</span>' : ''}
                </div>
                ${moment.description ? `<div class="moment-description">${moment.description}</div>` : ''}
                <div class="moment-actions">
                    <button class="btn-delete" onclick="deleteMoment(${moment.id})">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

function deleteMoment(id) {
    if (confirm('¿Seguro que quieres eliminar este momento?')) {
        moments = moments.filter(m => m.id !== id);
        saveData();
        renderMoments();
        alert('Momento eliminado 💔');
    }
}

// ==================== GALERÍA DE FOTOS ====================
function renderGallery() {
    const container = document.getElementById('galleryContainer');
    const photosWithImages = moments.filter(m => m.image && m.image.trim() !== '');

    if (photosWithImages.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay fotos aún. ¡Agrega fotos a tus momentos! 📷</p>';
        return;
    }

    container.innerHTML = photosWithImages.map(moment => `
        <div class="gallery-item">
            <img src="${moment.image}" alt="${moment.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2224%22%3E${moment.emoji}%3C/text%3E%3C/svg%3E'">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 10px; text-align: center; font-size: 0.9em;">${moment.title}</div>
        </div>
    `).join('');
}

// ==================== CARTAS DE AMOR ====================
function saveLoveLetter() {
    const text = document.getElementById('loveLetterText').value.trim();
    const author = document.getElementById('letterAuthor').value.trim();

    if (!text) {
        alert('Por favor escribe un mensaje 💌');
        return;
    }

    const letter = {
        id: Date.now(),
        text: text,
        author: author || 'Tu amor 💕',
        date: new Date().toLocaleDateString('es-ES')
    };

    loveLetters.unshift(letter);
    saveLetters();
    renderLoveLetters();
    
    document.getElementById('loveLetterText').value = '';
    document.getElementById('letterAuthor').value = '';
    alert('¡Carta de amor guardada! 💌');
}

function renderLoveLetters() {
    const container = document.getElementById('loveLettersList');

    if (loveLetters.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay cartas aún. ¡Escribe una! 💕</p>';
        return;
    }

    container.innerHTML = loveLetters.map(letter => `
        <div class="love-letter-card">
            <div class="love-letter-text">"${letter.text}"</div>
            <div class="love-letter-author">— ${letter.author}</div>
            <div style="font-size: 0.85em; color: #999; margin-top: 8px;">${letter.date}</div>
            <button class="btn-delete" onclick="deleteLoveLetter(${letter.id})" style="margin-top: 10px;">Eliminar</button>
        </div>
    `).join('');
}

function deleteLoveLetter(id) {
    if (confirm('¿Eliminar esta carta?')) {
        loveLetters = loveLetters.filter(l => l.id !== id);
        saveLetters();
        renderLoveLetters();
    }
}

// ==================== ESTADÍSTICAS DIVERTIDAS ====================
function updateStat(stat) {
    const inputs = {
        hugs: 'hugsCount',
        kisses: 'kissesCount',
        movies: 'moviesCount',
        trips: 'tripsCount'
    };

    const input = document.getElementById(inputs[stat]);
    input.value = parseInt(input.value || 0) + 1;
    saveStats();

    const messages = {
        hugs: '¡Abrazo registrado! 🤗',
        kisses: '¡Beso registrado! 😘',
        movies: '¡Película registrada! 🍿',
        trips: '¡Viaje registrado! 🚗'
    };

    alert(messages[stat]);
}

// ==================== DESEOS ====================
document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const text = document.getElementById('wishText').value.trim();
    if (!text) {
        alert('Por favor escribe un deseo 🌟');
        return;
    }

    const wish = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('es-ES')
    };

    wishes.unshift(wish);
    saveWishes();
    renderWishes();
    document.getElementById('wishText').value = '';
    alert('¡Deseo guardado! 🌟');
});

function renderWishes() {
    const container = document.getElementById('wishesList');

    if (wishes.length === 0) {
        container.innerHTML = '<p class="empty-message">No hay deseos aún. ¡Sueña grande! 🌟</p>';
        return;
    }

    container.innerHTML = wishes.map(wish => `
        <div class="wish-card">
            <div class="wish-text">"${wish.text}"</div>
            <div style="font-size: 0.9em; color: #999; margin-top: 10px;">${wish.date}</div>
            <div class="wish-delete" onclick="deleteWish(${wish.id})">Eliminar ✕</div>
        </div>
    `).join('');
}

function deleteWish(id) {
    if (confirm('¿Eliminar este deseo?')) {
        wishes = wishes.filter(w => w.id !== id);
        saveWishes();
        renderWishes();
    }
}

// ==================== UTILIDADES ====================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', options);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('dateModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// ==================== EVENT LISTENERS ====================
document.getElementById('momentForm').addEventListener('submit', addMoment);

window.addEventListener('DOMContentLoaded', loadData);

// Cambiar volumen automático a 50%
window.addEventListener('load', function() {
    audio.volume = 0.5;
});

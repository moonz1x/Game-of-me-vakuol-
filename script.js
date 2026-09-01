// ==========================================
// 1. СОСТОЯНИЕ ИГРЫ И НАСТРОЙКА КЕЙСОВ
// ==========================================
let gameState = {
    coins: 0,
    clickPower: 1,
    upgradeCost: 50,
    inventory: [],
    level: 1,
    xp: 0,
    xpNeeded: 100,
    clickCount: 0
};

// СТОИМОСТЬ ОТКРЫТИЯ КЕЙСА В МАГАЗИНЕ
const caseCost = 250;

// ТВОЯ БАЗА ПЕРСОНАЖЕЙ (МЕНЯЙ ТУТ ИМЕНА, ДОХОД И ЦЕНУ ПРОДАЖИ!)
const youtubersDatabase = [
    { id: "mrbeast", name: "Мистер Бист", rarity: "legendary", reward: 50, avatar: "./image/mrbeast.jpg", color: "#78350f", sellPrice: 5000 },
    { id: "amiran", name: "Амиран", rarity: "common", reward: 1, avatar: "./image/amiran.jpg", color: "#334155", sellPrice: 100 },
    { id: "a4", name: "А4", rarity: "rare", reward: 3, avatar: "./image/a4.jpg", color: "#78350f", sellPrice: 300 },
    { id: "buster", name: "Бустер", rarity: "mythic", reward: 50, avatar: "./image/buster.jpg", color: "#78350f", sellPrice: 5000 },
    { id: "evelone", name: "Эвелон", rarity: "legendary", reward: 50, avatar: "./image/evelone.jpg", color: "#78350f", sellPrice: 5000 },
    { id: "gaečka", name: "Гаечка", rarity: "epic", reward: 15, avatar: "./image/gaečka.jpg", color: "#78350f", sellPrice: 1500 },
    { id: "gensuha", name: "Генсуха", rarity: "mythic", reward: 30, avatar: "./image/gensuha.jpg", color: "#78350f", sellPrice: 5000 },
    { id: "litvin", name: "Литвин", rarity: "rare", reward: 10, avatar: "./images/litvin.jpg", color: "#1e3a8a", sellPrice: 1000 }, // Тут у тебя опечатка была в слове images, сделай тоже ./image/litvin.jpg
    { id: "glent", name: "Глент", rarity: "common", reward: 2, avatar: "./image/glent.jpg", color: "#334155", sellPrice: 200 },
    { id: "wylsacom", name: "Вилсаком", rarity: "legendary", reward: 30, avatar: "./image/wylsacom.jpg", color: "#78350f", sellPrice: 3000 }
];


// ==========================================
// 2. СИНТЕЗАТОР КИБЕР-ЗВУКОВ (БЕЗ ВНЕШНИХ ФАЙЛОВ)
// ==========================================
const SoundEngine = {
    ctx: null,
    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playClick(isCrit = false) {
        try {
            this.init();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isCrit ? 600 : 320, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
            osc.start(); osc.stop(this.ctx.currentTime + 0.08);
        } catch(e) {}
    },
    playSpin() {
        try {
            this.init();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.8);
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
            osc.start(); osc.stop(this.ctx.currentTime + 0.8);
        } catch(e) {}
    }
};

// ==========================================
// 3. UI И ОБНОВЛЕНИЕ ЭКРАНА
// ==========================================
const ui = {
    mainContainer: document.getElementById('main-container'),
    balance: document.getElementById('balance'),
    cps: document.getElementById('cps-amount'),
    clickBtn: document.getElementById('click-btn'),
    upgradeBtn: document.getElementById('upgrade-click-btn'),
    upgradeCost: document.getElementById('upgrade-cost'),
    buyCaseBtn: document.getElementById('buy-case-btn'),
    caseCostText: document.getElementById('case-cost'),
    resetBtn: document.getElementById('reset-game-btn'),
    
    playerLevel: document.getElementById('player-level'),
    xpText: document.getElementById('xp-text'),
    xpBarFill: document.getElementById('xp-bar-fill'),

    shopModal: document.getElementById('shop-modal'),
    wheelModal: document.getElementById('wheel-modal'),
    inventoryModal: document.getElementById('inventory-modal'),
    
    openShop: document.getElementById('open-shop-btn'),
    closeShop: document.getElementById('close-shop-btn'),
    openWheel: document.getElementById('open-wheel-btn'),
    closeWheel: document.getElementById('close-wheel-btn'),
    openInv: document.getElementById('open-inventory-btn'),
    closeInv: document.getElementById('close-inventory-btn'),
    
    spinBtn: document.getElementById('spin-btn')
};

function updateUI() {
    if (ui.balance) ui.balance.textContent = `$${gameState.coins}`;
    if (ui.cps) ui.cps.textContent = `+$${calculateTotalCPS()}/сек`;
    if (ui.upgradeCost) ui.upgradeCost.textContent = `$${gameState.upgradeCost}`;
    if (ui.caseCostText) ui.caseCostText.textContent = `$${caseCost}`;
    
    if (ui.playerLevel) ui.playerLevel.textContent = gameState.level;
    if (ui.xpText) ui.xpText.textContent = `${gameState.xp} / ${gameState.xpNeeded} XP`;
    if (ui.xpBarFill) {
        const pct = (gameState.xp / gameState.xpNeeded) * 100;
        ui.xpBarFill.style.width = `${Math.min(pct, 100)}%`;
    }
}

function calculateTotalCPS() {
    let bangerBonus = 0;
    gameState.inventory.forEach(item => {
        const found = youtubersDatabase.find(y => y.id === item.id);
        if (found) bangerBonus += found.reward;
    });
    return bangerBonus;
}
// ==========================================
// 4. МЕХАНИКА XP, КРИТОВ, ТРЯСКИ И ТАПОВ
// ==========================================
function addXP(amount) {
    gameState.xp += amount;
    if (gameState.xp >= gameState.xpNeeded) {
        gameState.xp -= gameState.xpNeeded;
        gameState.level += 1;
        gameState.xpNeeded = Math.round(gameState.xpNeeded * 1.5);
        
        const levelBonus = gameState.level * 500; 
        gameState.coins += levelBonus;
        
        setTimeout(() => { 
            alert(`🚀 Прокачка уровня! Твой уровень: ${gameState.level}!\n💰 Бонус за статус: +$${levelBonus}!`); 
        }, 50);
    }
}

function triggerScreenShake() {
    if (!ui.mainContainer) return;
    ui.mainContainer.classList.add('shake');
    setTimeout(() => { ui.mainContainer.classList.remove('shake'); }, 100);
}

function createFloatingText(event, amount, isCrit = false) {
    const floatText = document.createElement('div');
    floatText.className = isCrit ? 'floating-text crit' : 'floating-text';
    floatText.textContent = isCrit ? `🔥 +$${amount} CRIT!` : `+$${amount}`;
    floatText.style.left = `${event.clientX}px`;
    floatText.style.top = `${event.clientY}px`;
    document.body.appendChild(floatText);
    setTimeout(() => floatText.remove(), 800);
}

if (ui.clickBtn) {
    ui.clickBtn.addEventListener('click', function(e) {
        gameState.clickCount += 1;
        const isCrit = (gameState.clickCount % 10 === 0);
        const finalPower = isCrit ? gameState.clickPower * 3 : gameState.clickPower;
        
        gameState.coins += finalPower;
        addXP(1); 
        
        SoundEngine.playClick(isCrit);
        triggerScreenShake();
        createFloatingText(e, finalPower, isCrit);
        
        updateUI();
        saveGame();
    });
}

if (ui.upgradeBtn) {
    ui.upgradeBtn.onclick = function() {
        if (gameState.coins >= gameState.upgradeCost) {
            gameState.coins -= gameState.upgradeCost;
            gameState.clickPower += 1;
            gameState.upgradeCost = Math.round(gameState.upgradeCost * 1.6);
            updateUI();
            saveGame();
        } else {
            alert('Не хватает средств!');
        }
    };
}

// ==========================================
// 5. ДВИЖОК ГОРИЗОНТАЛЬНЫХ РУЛЕТОК (ИСПРАВЛЕНО!)
// ==========================================
let isCaseOpening = false;
let isWheelSpinning = false;
const caseTrack = document.getElementById('case-roulette-track');
const wheelTrack = document.getElementById('roulette-track');

// Железобетонная генерация ленты без опечаток
function generateTrackItems(targetTrack) {
    if (!targetTrack) return;
    targetTrack.innerHTML = '';
    targetTrack.style.transition = 'none';
    targetTrack.style.transform = 'translateX(0px)';

    for (let i = 0; i < 45; i++) {
        const randomYoutuber = youtubersDatabase[Math.floor(Math.random() * youtubersDatabase.length)];
        const card = document.createElement('div');
        card.className = `roulette-card ${randomYoutuber.rarity}`;
        card.innerHTML = `
            <img src="${randomYoutuber.avatar}" alt="${randomYoutuber.name}" onerror="this.src='https://placeholder.com{randomYoutuber.name}'">
            <div class="r-name">${randomYoutuber.name}</div>
        `;
        targetTrack.appendChild(card);
    }
}

function startRouletteSpin(targetTrack) {
    generateTrackItems(targetTrack);
    
    const prizeIndex = Math.floor(Math.random() * youtubersDatabase.length);
    const prizeYoutuber = youtubersDatabase[prizeIndex];

    const cards = targetTrack.getElementsByClassName('roulette-card');
    if (cards && cards[40]) {
        cards[40].className = `roulette-card ${prizeYoutuber.rarity}`;
        cards[40].innerHTML = `
            <img src="${prizeYoutuber.avatar}" alt="${prizeYoutuber.name}" onerror="this.src='https://placeholder.com{prizeYoutuber.name}'">
            <div class="r-name">${prizeYoutuber.name}</div>
        `;
    }

    const cardWidth = 110; 
    const viewportWidth = 340; 
    const targetX = (40 * cardWidth) - (viewportWidth / 2) + (cardWidth / 2);

    setTimeout(() => {
        targetTrack.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)';
        targetTrack.style.transform = `translateX(-${targetX}px)`;
    }, 50);

    return prizeYoutuber;
}
// Покупка кейса в магазине
if (ui.buyCaseBtn) {
    ui.buyCaseBtn.onclick = function() {
        if (isCaseOpening || isWheelSpinning) return;
        if (gameState.coins < caseCost) {
            alert(`Недостаточно средств! Кейс стоит $${caseCost}.`);
            return;
        }

        gameState.coins -= caseCost;
        updateUI();
        isCaseOpening = true;
        ui.buyCaseBtn.disabled = true;
        SoundEngine.playSpin();
        
        const prize = startRouletteSpin(caseTrack);

        setTimeout(function() {
            isCaseOpening = false;
            ui.buyCaseBtn.disabled = false;
            gameState.inventory.push({ id: prize.id });
            saveGame();
            updateUI();
            alert(`📦 \nТебе выпал персонаж: ${prize.name}! [${prize.rarity.toUpperCase()}]`);
        }, 4100);
    };
}

// Ежедневная рулетка (24 часа)
function updateSpinButtonStatus() {
    if (!ui.spinBtn) return;
    const lastSpin = localStorage.getItem('last_free_spin');
    
    if (!lastSpin) {
        ui.spinBtn.textContent = "Прокрутить бесплатно";
        ui.spinBtn.dataset.mode = "free";
        ui.spinBtn.disabled = isWheelSpinning;
        return;
    }

    const now = Date.now();
    const timeLeft = parseInt(lastSpin) + (24 * 60 * 60 * 1000) - now;

    if (timeLeft <= 0) {
        ui.spinBtn.textContent = "Прокрутить бесплатно";
        ui.spinBtn.dataset.mode = "free";
        ui.spinBtn.disabled = isWheelSpinning;
    } else {
        ui.spinBtn.dataset.mode = "paid";
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % 1000) / 1000);
        ui.spinBtn.textContent = `До спина: ${hours}ч ${minutes}м ${seconds}с или за $500`;
        ui.spinBtn.disabled = isWheelSpinning;
    }
}
setInterval(updateSpinButtonStatus, 1000);

if (ui.spinBtn) {
    ui.spinBtn.onclick = function() {
        if (isWheelSpinning || isCaseOpening) return;
        const mode = ui.spinBtn.dataset.mode || "free";

        if (mode === "paid") {
            if (gameState.coins < 500) {
                alert('Вращение стоит $500!');
                return;
            }
            gameState.coins -= 500;
        } else {
            localStorage.setItem('last_free_spin', Date.now().toString());
        }

        updateUI();
        isWheelSpinning = true;
        ui.spinBtn.disabled = true;
        SoundEngine.playSpin();
        
        const prize = startRouletteSpin(wheelTrack);

        setTimeout(function() {
            isWheelSpinning = false;
            ui.spinBtn.disabled = false;
            gameState.inventory.push({ id: prize.id });
            saveGame();
            updateSpinButtonStatus();
            updateUI();
            alert(`🎉 \nВы выиграли: ${prize.name}!`);
        }, 4100);
    };
}

// Каждую секунду начисляем пассивку
setInterval(function() {
    let totalCps = calculateTotalCPS();
    if (totalCps > 0) {
        gameState.coins += totalCps;
        updateUI();
        saveGame();
    }
}, 1000);

// ==========================================
// 7. ИНВЕНТАРЬ + СИСТЕМА ПРОДАЖИ
// ==========================================
function sellYoutuber(index, price, name) {
    if (confirm(`Реально хочешь продать ${name} за $${price}?`)) {
        gameState.coins += price;
        gameState.inventory.splice(index, 1);
        saveGame(); updateUI(); renderInventory();
    }
}

function renderInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return;
    list.innerHTML = '';

    if (gameState.inventory.length === 0) {
        list.innerHTML = '<div style="grid-column: span 2; color: #475569; text-align:center; font-size:14px; padding:20px;">У тебя пока пусто. Го в магазин кейсов или Колесо!</div>';
        return;
    }

    gameState.inventory.forEach(function(item, index) {
        const dbData = youtubersDatabase.find(y => y.id === item.id) || { name: "Призрак", rarity: "common", reward: 0, avatar: "https://placeholder.com", sellPrice: 0 };
        const card = document.createElement('div');
        card.className = `youtuber-card ${dbData.rarity}`;
        card.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${dbData.avatar}" alt="${dbData.name}" class="youtuber-avatar" onerror="this.src='https://placeholder.com{dbData.name}'">
            </div>
            <div class="card-name">${dbData.name}</div>
            <div class="card-rarity">${dbData.rarity}</div>
            <div class="card-reward">+$${dbData.reward}/сек</div>
            <button class="sell-btn" onclick="sellYoutuber(${index}, ${dbData.sellPrice}, '${dbData.name}')">Слить за $${dbData.sellPrice}</button>
        `;
        list.appendChild(card);
    });
}

// ==========================================
// 8. УПРАВЛЕНИЕ ОКНАМИ
// ==========================================
function toggleModal(modal, action) {
    if (!modal) return;
    if (action === 'open') { modal.classList.add('active'); } else { modal.classList.remove('active'); }
}
if (ui.openShop) { ui.openShop.onclick = function() { toggleModal(ui.shopModal, 'open'); generateTrackItems(caseTrack); }; }
if (ui.closeShop) ui.closeShop.onclick = () => toggleModal(ui.shopModal, 'close');
if (ui.openWheel) { ui.openWheel.onclick = function() { toggleModal(ui.wheelModal, 'open'); generateTrackItems(wheelTrack); }; }
if (ui.closeWheel) ui.closeWheel.onclick = () => toggleModal(ui.wheelModal, 'close');
if (ui.openInv) { ui.openInv.onclick = function() { renderInventory(); toggleModal(ui.inventoryModal, 'open'); }; }
if (ui.closeInv) ui.closeInv.onclick = () => toggleModal(ui.inventoryModal, 'close');

function saveGame() { localStorage.setItem('ultimate_clicker_save_v6', JSON.stringify(gameState)); }
function loadGame() {
    const saved = localStorage.getItem('ultimate_clicker_save_v6');
    if (saved) { gameState = JSON.parse(saved); updateUI(); }
}
if (ui.resetBtn) {
    ui.resetBtn.onclick = function() {
        if (confirm('Точно хочешь обнулить весь прогресс?')) { localStorage.removeItem('ultimate_clicker_save_v6'); location.reload(); }
    };
}

// Запуск шайтан-машины
loadGame();
updateSpinButtonStatus();
updateUI();

// ==========================================
// 1. СОСТОЯНИЕ ИГРЫ И НАСТРОЙКА КЕЙСОВ
// ==========================================
let gameState = {
    coins: 500,
    clickPower: 1,
    upgradeCost: 50,
    inventory: [],
    level: 1,
    xp: 0,
    xpNeeded: 100,
    clickCount: 0,
    businesses: {
        basement: { count: 0, cost: 500, baseCps: 5 },
        neon: { count: 0, cost: 12000, baseCps: 80 },
        arena: { count: 0, cost: 450000, baseCps: 1500 }
    }
};

const prices = { deshman: 150, normis: 5000, legends: 250000 };

const youtubersDatabase = [
    { id: "amiran", name: "Амиран", rarity: "common", reward: 1, avatar: "./image/amiran.jpg", sellPrice: 100 },
    { id: "kobyakov", name: "Кобяков", rarity: "common", reward: 3, avatar: "./image/kobyakov.jpg", sellPrice: 300 },
    { id: "gaečka", name: "Гаечка", rarity: "common", reward: 5, avatar: "./image/gaechka.jpg", sellPrice: 500 },
    { id: "gensuha", name: "Генсуха", rarity: "common", reward: 6, avatar: "./image/gensuha.jpg", sellPrice: 600 },
    { id: "fruktozka", name: "Фруктозка", rarity: "common", reward: 7, avatar: "./image/fruktozka.jpg", sellPrice: 700 },
    { id: "dinablin", name: "Динаблин", rarity: "common", reward: 8, avatar: "./image/dinablin.jpg", sellPrice: 800 },
    { id: "litvin", name: "Литвин", rarity: "rare", reward: 15, avatar: "./image/litvin.jpg", sellPrice: 1500 },
    { id: "strogo", name: "Строго", rarity: "rare", reward: 18, avatar: "./image/strogo.jpg", sellPrice: 1800 },
    { id: "t2x2", name: "Т2х2", rarity: "rare", reward: 25, avatar: "./image/t2x2.jpg", sellPrice: 2500 },
    { id: "serega", name: "Серега", rarity: "rare", reward: 20, avatar: "./image/serega.jpg", sellPrice: 2000 },
    { id: "akulich", name: "Акулич", rarity: "rare", reward: 28, avatar: "./image/akulich.jpg", sellPrice: 2800 },
    { id: "a4", name: "А4", rarity: "rare", reward: 20, avatar: "./image/a4.jpg", sellPrice: 2000 },
    { id: "ekatze", name: "Екатзе", rarity: "rare", reward: 32, avatar: "./image/ekatze.jpg", sellPrice: 3200 },
    { id: "tenderlybae", name: "Тендерлибае", rarity: "rare", reward: 35, avatar: "./image/tenderlybae.jpg", sellPrice: 3500 },
    { id: "glent", name: "Глент", rarity: "legendary", reward: 200, avatar: "./image/glent.jpg", sellPrice: 20000 },
    { id: "evelone", name: "Эвелон", rarity: "legendary", reward: 220, avatar: "./image/evelone.jpg", sellPrice: 22000 },
    { id: "buster", name: "Бустер", rarity: "legendary", reward: 75, avatar: "./image/buster.jpg", sellPrice: 7500 },
    { id: "bratishkin", name: "Братишкин", rarity: "legendary", reward: 110, avatar: "./image/bratishkin.jpg", sellPrice: 11000 },
    { id: "nix", name: "Никс", rarity: "legendary", reward: 130, avatar: "./image/nix.jpg", sellPrice: 13000 },
    { id: "stray", name: "Стинт", rarity: "legendary", reward: 150, avatar: "./image/stint.jpg", sellPrice: 15000 },
    { id: "zubarev", name: "Зубарев", rarity: "legendary", reward: 200, avatar: "./image/zubarev.jpg", sellPrice: 20000 },
    { id: "ishowspeed", name: "Айшоуспид", rarity: "legendary", reward: 350, avatar: "./image/ishowspeed.jpg", sellPrice: 35000 },
    { id: "mrbeast", name: "Мистер Бист", rarity: "legendary", reward: 500, avatar: "./image/mrbeast.jpg", sellPrice: 50000 }
];

// ==========================================
// 2. СИНТЕЗАТОР КИБЕР-ЗВУКОВ
// ==========================================
const SoundEngine = {
    ctx: null, 
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    playClick(isCrit = false) { 
        try { this.init(); const osc = this.ctx.createOscillator(), g = this.ctx.createGain(); osc.connect(g); g.connect(this.ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(isCrit ? 600 : 320, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08); g.gain.setValueAtTime(0.12, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08); osc.start(); osc.stop(this.ctx.currentTime + 0.08); } catch(e) {} 
    },
    playSpin() { 
        try { this.init(); const osc = this.ctx.createOscillator(), g = this.ctx.createGain(); osc.connect(g); g.connect(this.ctx.destination); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, this.ctx.currentTime); osc.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 0.8); g.gain.setValueAtTime(0.04, this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8); osc.start(); osc.stop(this.ctx.currentTime + 0.8); } catch(e) {} 
    }
};

// ==========================================
// 3. UI И ОБНОВЛЕНИЕ ЭКРАНА
// ==========================================
const ui = {
    mainContainer: document.getElementById('main-container'), balance: document.getElementById('balance'), cps: document.getElementById('cps-amount'), clickBtn: document.getElementById('click-btn'), upgradeBtn: document.getElementById('upgrade-click-btn'), upgradeCost: document.getElementById('upgrade-cost'), resetBtn: document.getElementById('reset-game-btn'), playerLevel: document.getElementById('player-level'), xpText: document.getElementById('xp-text'), xpBarFill: document.getElementById('xp-bar-fill'), shopModal: document.getElementById('shop-modal'), wheelModal: document.getElementById('wheel-modal'), inventoryModal: document.getElementById('inventory-modal'), openShop: document.getElementById('open-shop-btn'), closeShop: document.getElementById('close-shop-btn'), openWheel: document.getElementById('open-wheel-btn'), closeWheel: document.getElementById('close-wheel-btn'), openInv: document.getElementById('open-inventory-btn'), closeInv: document.getElementById('close-inventory-btn'), spinBtn: document.getElementById('spin-btn'),
    // Новые элементы для вынесенной модалки крафта
    craftModal: document.getElementById('craft-modal'), openCraft: document.getElementById('open-craft-btn'), closeCraft: document.getElementById('close-craft-btn')
};

function updateUI() {
    if (ui.balance) ui.balance.textContent = `$${gameState.coins}`; 
    if (ui.cps) ui.cps.textContent = `+$${calculateTotalCPS()}/сек`; 
    if (ui.upgradeCost) ui.upgradeCost.textContent = `$${gameState.upgradeCost}`; 
    if (ui.playerLevel) ui.playerLevel.textContent = gameState.level; 
    if (ui.xpText) ui.xpText.textContent = `${gameState.xp} / ${gameState.xpNeeded} XP`; 
    if (ui.xpBarFill) { const pct = (gameState.xp / gameState.xpNeeded) * 100; ui.xpBarFill.style.width = `${Math.min(pct, 100)}%`; }
    
    const dBtn = document.getElementById('buy-deshman-cost'); if(dBtn) dBtn.textContent = `$${prices.deshman}`;
    const nBtn = document.getElementById('buy-normis-cost'); if(nBtn) nBtn.textContent = `$${prices.normis}`;
    const lBtn = document.getElementById('buy-legends-cost'); if(lBtn) lBtn.textContent = `$${prices.legends}`;

    for (let key in gameState.businesses) {
        const biz = gameState.businesses[key];
        const countEl = document.getElementById(`count-${key}`);
        const incomeEl = document.getElementById(`income-${key}`);
        const btnEl = document.getElementById(`buy-biz-${key}`);
        if (countEl) countEl.textContent = `(${biz.count})`;
        if (incomeEl) incomeEl.textContent = `+$${biz.count * biz.baseCps}/сек`;
        if (btnEl) {
            const btnText = biz.count === 0 ? "Купить" : "Улучшить";
            btnEl.innerHTML = `${btnText} <span>$${biz.cost}</span>`;
        }
    }
}

function calculateTotalCPS() { 
    let b = 0; 
    gameState.inventory.forEach(i => { const f = youtubersDatabase.find(y => y.id === i.id); if (f) b += f.reward; }); 
    for (let key in gameState.businesses) { const biz = gameState.businesses[key]; b += biz.count * biz.baseCps; }
    return b; 
}

function saveGame() { localStorage.setItem('ultimate_clicker_save_v6', JSON.stringify(gameState)); }
function loadGame() { 
    const saved = localStorage.getItem('ultimate_clicker_save_v6'); 
    if (saved) { 
        const parsed = JSON.parse(saved);
        if (!parsed.businesses) parsed.businesses = gameState.businesses;
        gameState = parsed; 
        updateUI(); 
    } 
}
// ==========================================
// 4. МЕХАНИКА XP, КРИТОВ, ТРЯСКИ И ТАПОВ
// ==========================================
function triggerLegendaryCelebration(modalContent) {
    const colors = ['#45f3ff', '#ff007f', '#02f1a3', '#f59e0b', '#a855f7'];
    if(modalContent) { 
        modalContent.classList.add('legendary-drop-anim'); 
        setTimeout(() => modalContent.classList.remove('legendary-drop-anim'), 4000); 
    }
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div'); confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%'; confetti.style.top = '40%';
        const randomX = (Math.random() - 0.5) * 800; const randomR = Math.random() * 720;         
        confetti.style.setProperty('--x', `${randomX}px`); confetti.style.setProperty('--r', `${randomR}deg`);
        confetti.style.animationDelay = `${Math.random() * 0.3}s`;
        document.body.appendChild(confetti); setTimeout(() => confetti.remove(), 3000);
    }
}

function addXP(a) {
    gameState.xp += a; 
    if (gameState.xp >= gameState.xpNeeded) { 
        gameState.xp -= gameState.xpNeeded; 
        gameState.level += 1; 
        gameState.xpNeeded = Math.round(gameState.xpNeeded * 1.5); 
        const b = gameState.level * 500; 
        gameState.coins += b; 
        setTimeout(() => { alert(`🚀 ЛЕВЕЛАП! Твой уровень: ${gameState.level}!\n💰 Бонус за статус: +$${b}!`); }, 50); 
    }
}

function triggerScreenShake() { 
    if (ui.mainContainer) { 
        ui.mainContainer.classList.add('shake'); 
        setTimeout(() => { ui.mainContainer.classList.remove('shake'); }, 100); 
    } 
}

function createFloatingText(ev, a, c = false) { 
    const f = document.createElement('div'); f.className = c ? 'floating-text crit' : 'floating-text'; f.textContent = c ? `🔥 +$${a} CRIT!` : `+$${a}`; 
    f.style.left = `${ev.clientX}px`; f.style.top = `${ev.clientY}px`; document.body.appendChild(f); setTimeout(() => f.remove(), 800); 
}

if (ui.clickBtn) { 
    ui.clickBtn.addEventListener('click', function(e) { 
        gameState.clickCount += 1; 
        const c = (gameState.clickCount % 10 === 0), p = c ? gameState.clickPower * 3 : gameState.clickPower; 
        gameState.coins += p; 
        addXP(1); 
        SoundEngine.playClick(c); 
        triggerScreenShake(); 
        createFloatingText(e, p, c); 
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
            alert('Не хватает баксов, бро!'); 
        } 
    }; 
}

// Движок покупки и улучшения компьютерных клубов
function buyBusiness(key) {
    const biz = gameState.businesses[key];
    if (gameState.coins >= biz.cost) {
        gameState.coins -= biz.cost;
        biz.count++;
        biz.cost = Math.round(biz.cost * 1.35); // Каждая следующая покупка дороже на 35%
        updateUI();
        saveGame();
    } else {
        alert('Недостаточно денег для расширения сети клубов!');
    }
}
const bBasement = document.getElementById('buy-biz-basement'); if(bBasement) bBasement.onclick = () => buyBusiness('basement');
const bNeon = document.getElementById('buy-biz-neon'); if(bNeon) bNeon.onclick = () => buyBusiness('neon');
const bArena = document.getElementById('buy-biz-arena'); if(bArena) bArena.onclick = () => buyBusiness('arena');
// ==========================================
// 5. ДВИЖОК ТРЁХ КЕЙС-РУЛЕТОК С РЕАЛЬНЫМИ ШАНСАМИ
// ==========================================
let isCaseOpening = false, isWheelSpinning = false;
const caseTrack = document.getElementById('case-roulette-track');
const wheelTrack = document.getElementById('roulette-track');
let contractItems = []; 

function generateTrackItems(targetTrack, pool) {
    if (!targetTrack) return; 
    targetTrack.innerHTML = ''; 
    targetTrack.style.transition = 'none'; 
    targetTrack.style.transform = 'translateX(0px)';

    for (let i = 0; i < 45; i++) {
        const randomYoutuber = pool[Math.floor(Math.random() * pool.length)];
        const card = document.createElement('div'); 
        card.className = `roulette-card ${randomYoutuber.rarity}`;
        card.innerHTML = `<img src="${randomYoutuber.avatar}" alt="${randomYoutuber.name}" onerror="this.src='https://placehold.co'"><div class="r-name">${randomYoutuber.name}</div>`;
        targetTrack.appendChild(card);
    }
}

function startRouletteSpin(targetTrack, pool, prizeYoutuber) {
    generateTrackItems(targetTrack, pool);
    const cards = targetTrack.getElementsByClassName('roulette-card');
    
    // Вживляем РЕАЛЬНО СГЕНЕРИРОВАННЫЙ по шансам приз на 40-ю позицию (индекс 39)
    if (cards && cards[39]) {
        cards[39].className = `roulette-card ${prizeYoutuber.rarity}`;
        cards[39].innerHTML = `<img src="${prizeYoutuber.avatar}" alt="${prizeYoutuber.name}" onerror="this.src='https://placehold.co'"><div class="r-name">${prizeYoutuber.name}</div>`;
    }
    const cardWidth = 110, viewportWidth = 340, targetX = (39 * cardWidth) - (viewportWidth / 2) + (100 / 2) + 15;
    setTimeout(() => { 
        targetTrack.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)'; 
        targetTrack.style.transform = `translateX(-${targetX}px)`; 
    }, 50);
}

function openBox(type, cost, defaultRarityFilter) {
    if (isCaseOpening || isWheelSpinning) return;
    if (gameState.coins < cost) { alert(`Недостаточно средств! Кейс стоит $${cost}.`); return; }

    // ЕСЛИ ЭТО ОБЫЧНЫЙ БОМЖ-КЕЙС ИЛИ НОРМИС КЕЙС, ДЕЛАЕМ СЛУЧАЙНЫЙ ДРОП ПО ШАНСАМ
    // Кейс легенд оставляет 100% шанс на леги, так как он стоит космических денег
    let finalRarity = defaultRarityFilter;
    
    if (type !== 'legends') {
        const roll = Math.random() * 100; // Генерируем число от 0 до 100
        if (roll < 75) {
            finalRarity = 'common';       // 75% шанс на обычного
        } else if (roll < 96) {
            finalRarity = 'rare';         // 21% шанс на редкого (75 + 21 = 96)
        } else {
            finalRarity = 'legendary';    // 4% шанс на легендарку!
        }
    }

    // Собираем пул персонажей под выпавшую редкость
    const pool = youtubersDatabase.filter(y => y.rarity === finalRarity);
    if (pool.length === 0) return;
    
    // Выбираем конкретного призера из пула
    const prize = pool[Math.floor(Math.random() * pool.length)];

    // Лента предпросмотра крутится из ВСЕХ ютуберов для красоты, но выпадет строго prize!
    gameState.coins -= cost; 
    updateUI(); 
    isCaseOpening = true;
    document.querySelectorAll('.shop-buttons button').forEach(b => b.disabled = true); 
    SoundEngine.playSpin();
    
    startRouletteSpin(caseTrack, youtubersDatabase, prize);

    setTimeout(function() {
        isCaseOpening = false; 
        document.querySelectorAll('.shop-buttons button').forEach(b => b.disabled = false);
        gameState.inventory.push({ id: prize.id, instanceId: Date.now() + Math.random() });
        if (prize.rarity === 'legendary') triggerLegendaryCelebration(document.querySelector('#shop-modal .modal-content'));
        saveGame(); 
        updateUI(); 
        alert(`📦 КЕЙС ОТКРЫТ!\nТебе выпал персонаж: ${prize.name}! [${prize.rarity.toUpperCase()}]`);
    }, 4100);
}

const btnDeshman = document.getElementById('buy-deshman-btn'); if(btnDeshman) btnDeshman.onclick = () => openBox('deshman', prices.deshman, 'common');
const btnNormis = document.getElementById('buy-normis-btn'); if(btnNormis) btnNormis.onclick = () => openBox('normis', prices.normis, 'rare');
const btnLegends = document.getElementById('buy-legends-btn'); if(btnLegends) btnLegends.onclick = () => openBox('legends', prices.legends, 'legendary');

// ==========================================
// 6. ЕЖЕДНЕВНАЯ РУЛЕТКА (ТОЖЕ ПО ШАНСАМ!)
// ==========================================
function updateSpinButtonStatus() {
    if (!ui.spinBtn) return; 
    const lastSpin = localStorage.getItem('last_free_spin');
    if (!lastSpin) { 
        ui.spinBtn.textContent = "Крутануть БЕСПЛАТНО"; 
        ui.spinBtn.dataset.mode = "free"; 
        ui.spinBtn.disabled = isWheelSpinning; 
        return; 
    }
    const now = Date.now(), timeLeft = parseInt(lastSpin) + (24 * 60 * 60 * 1000) - now;
    if (timeLeft <= 0) { 
        ui.spinBtn.textContent = "Крутануть БЕСПЛАТНО"; 
        ui.spinBtn.dataset.mode = "free"; 
        ui.spinBtn.disabled = isWheelSpinning; 
    } else { 
        ui.spinBtn.dataset.mode = "paid"; 
        const h = Math.floor(timeLeft / (60 * 60 * 1000));
        const m = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const s = Math.floor((timeLeft % (60 * 1000)) / 1000); 
        ui.spinBtn.textContent = `До халявы: ${h}ч ${m}м ${s}с или за $500`; 
        ui.spinBtn.disabled = isWheelSpinning; 
    }
}
setInterval(updateSpinButtonStatus, 1000);

if (ui.spinBtn) {
    ui.spinBtn.onclick = function() {
        if (isWheelSpinning || isCaseOpening) return; 
        const m = ui.spinBtn.dataset.mode || "free";
        if (m === "paid") { 
            if (gameState.coins < 500) { alert('Вращение стоит $500!'); return; } 
            gameState.coins -= 500; 
        } else { 
            localStorage.setItem('last_free_spin', Date.now().toString()); 
        }
        updateUI(); 
        isWheelSpinning = true; 
        ui.spinBtn.disabled = true; 
        SoundEngine.playSpin();

        // Колесо фортуны крутится по честным хардкорным шансам
        const roll = Math.random() * 100;
        let finalRarity = 'common';
        if (roll > 75 && roll <= 96) finalRarity = 'rare';
        if (roll > 96) finalRarity = 'legendary';

        const pool = youtubersDatabase.filter(y => y.rarity === finalRarity);
        const prize = pool[Math.floor(Math.random() * pool.length)];

        startRouletteSpin(wheelTrack, youtubersDatabase, prize);

        setTimeout(function() { 
            isWheelSpinning = false; 
            ui.spinBtn.disabled = false; 
            gameState.inventory.push({ id: prize.id, instanceId: Date.now() + Math.random() }); 
            if (prize.rarity === 'legendary') triggerLegendaryCelebration(document.querySelector('#wheel-modal .modal-content'));
            saveGame(); 
            updateSpinButtonStatus(); 
            updateUI(); 
            alert(`🎉 РУЛЕТКА ОСТАНОВИЛАСЬ!\nВы выиграли: ${prize.name}!`); 
        }, 4100);
    };
}

setInterval(function() { 
    let t = calculateTotalCPS(); 
    if (t > 0) { gameState.coins += t; updateUI(); saveGame(); } 
}, 1000);

window.sellYoutuber = function(index, price, name) { 
    if (confirm(`Реально хочешь продать ${name} за $${price}?`)) { 
        gameState.coins += price; 
        const target = gameState.inventory[index];
        if (target) contractItems = contractItems.filter(item => item.instanceId !== target.instanceId);
        gameState.inventory.splice(index, 1); 
        saveGame(); 
        updateUI(); 
        updateContractZone();
        renderInventory(); 
        if (ui.craftModal && ui.craftModal.classList.contains('active')) renderCraftInventory();
    } 
};

// ==========================================
// ЛОГИКА СИСТЕМЫ КРАФТА СТРОГО ОДНОЙ РЕДКОСТИ
// ==========================================
window.toggleToContract = function(instanceId) {
    const target = gameState.inventory.find(inv => inv.instanceId === instanceId);
    if (!target) return;

    const data = youtubersDatabase.find(y => y.id === target.id);
    if (!data) return;
    if (data.rarity === 'legendary') { alert('Легендарные карточки нельзя скрафтить выше, это потолок, бро!'); return; }

    const existingIndex = contractItems.findIndex(item => item.instanceId === target.instanceId);

    if (existingIndex > -1) {
        contractItems.splice(existingIndex, 1);
    } else {
        if (contractItems.length >= 3) { alert('Контракт заполнен! Сначала очисти слоты или запусти крафт.'); return; }
        
        // ЖЕСТКАЯ ПРОВЕРКА НА ОДИНАКОВУЮ РЕДКОСТЬ
        if (contractItems.length > 0) {
            const firstItemData = youtubersDatabase.find(y => y.id === contractItems[0].id);
            if (firstItemData && firstItemData.rarity !== data.rarity) {
                alert(`Ошибка! В этот контракт можно закинуть только карточки редкости [${firstItemData.rarity.toUpperCase()}]. Выбранный персонаж имеет редкость [${data.rarity.toUpperCase()}].`);
                return;
            }
        }
        contractItems.push({ ...target, rarity: data.rarity, name: data.name });
    }

    updateContractZone();
    renderCraftInventory();
};

function updateContractZone() {
    const countEl = document.getElementById('contract-count');
    const craftBtn = document.getElementById('craft-action-btn');
    if (countEl) countEl.textContent = `${contractItems.length}/3`;

    for (let i = 0; i < 3; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (!slot) continue;

        if (contractItems[i]) {
            slot.textContent = contractItems[i].name;
            slot.className = `contract-slot filled ${contractItems[i].rarity}`;
        } else {
            slot.textContent = "Пусто";
            slot.className = "contract-slot";
        }
    }

    if (craftBtn) craftBtn.disabled = contractItems.length !== 3;
}

document.querySelectorAll('.contract-slot').forEach((slot, i) => {
    slot.onclick = () => {
        if (contractItems[i]) {
            contractItems.splice(i, 1);
            updateContractZone();
            renderCraftInventory();
        }
    };
});

const craftActionBtn = document.getElementById('craft-action-btn');
if (craftActionBtn) {
    craftActionBtn.onclick = function() {
        if (contractItems.length !== 3) return;

        const currentRarity = contractItems[0].rarity;
        let nextRarity = 'rare';
        if (currentRarity === 'rare') nextRarity = 'legendary';

        const pool = youtubersDatabase.filter(y => y.rarity === nextRarity);
        if (pool.length === 0) return;
        const prize = pool[Math.floor(Math.random() * pool.length)];

        contractItems.forEach(cItem => {
            const idx = gameState.inventory.findIndex(inv => inv.instanceId === cItem.instanceId);
            if (idx > -1) gameState.inventory.splice(idx, 1);
        });

        contractItems = [];

        gameState.inventory.push({ id: prize.id, instanceId: Date.now() + Math.random() });
        
        triggerLegendaryCelebration(document.querySelector('#craft-modal .modal-content'));

        saveGame();
        updateUI();
        updateContractZone();
        renderCraftInventory();

        alert(`🔥 КРАФТ СРАБОТАЛ!\nВы переплавили хлам и получили: ${prize.name}! [${prize.rarity.toUpperCase()}]`);
    };
}

function renderCraftInventory() {
    const list = document.getElementById('craft-inventory-list');
    if (!list) return;
    list.innerHTML = '';
    
    // Показываем в окне крафта только тех, кого МОЖНО скрафтить (кроме лег)
    const craftableItems = gameState.inventory.filter(item => {
        const d = youtubersDatabase.find(y => y.id === item.id);
        return d && d.rarity !== 'legendary';
    });

    if (craftableItems.length === 0) {
        list.innerHTML = '<div style="grid-column: span 2; color: #444; text-align:center; font-size:12px; padding:10px; font-weight:700;">Нет подходящих карточек для крафта!</div>';
        return;
    }

    craftableItems.forEach(function(item) {
        const d = youtubersDatabase.find(y => y.id === item.id);
        const isInContract = contractItems.some(cItem => cItem.instanceId === item.instanceId);
        const btnText = isInContract ? "❌ Убрать" : "🔥 В контракт";

        const card = document.createElement('div');
        card.className = `youtuber-card ${d.rarity}`;
        if (isInContract) card.style.opacity = '0.4';

        card.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${d.avatar}" alt="${d.name}" class="youtuber-avatar" onerror="this.src='https://placehold.co'">
            </div>
            <div class="card-name" style="font-size:12px;">${d.name}</div>
            <button class="add-to-craft-btn" style="padding:4px 0; font-size:10px;" onclick="window.toggleToContract(${item.instanceId})">${btnText}</button>
        `;
        list.appendChild(card);
    });
}

function renderInventory() {
    const list = document.getElementById('inventory-list'); 
    if (!list) return; 
    list.innerHTML = '';
    if (gameState.inventory.length === 0) { 
        list.innerHTML = '<div style="grid-column: span 2; color: #444; text-align:center; font-size:14px; padding:20px; font-weight:700;">У тебя пока пусто, бро. Крути кейсы!</div>'; 
        return; 
    }
    gameState.inventory.forEach(function(item, index) {
        if (!item.instanceId) item.instanceId = Date.now() + index + Math.random();
        const d = youtubersDatabase.find(y => y.id === item.id) || { name: "Призрак", rarity: "common", reward: 0, avatar: "./image/amiran.jpg", sellPrice: 0 };
        
        const card = document.createElement('div'); 
        card.className = `youtuber-card ${d.rarity}`;
        card.innerHTML = `
            <div class="avatar-wrapper">
                <img src="${d.avatar}" alt="${d.name}" class="youtuber-avatar" onerror="this.src='https://placehold.co{encodeURIComponent(d.name)}'">
            </div>
            <div class="card-name">${d.name}</div>
            <div class="card-rarity">${d.rarity}</div>
            <div class="card-reward">+$${d.reward}/сек</div>
            <button class="sell-btn" onclick="window.sellYoutuber(${index}, ${d.sellPrice}, '${d.name}')">Слить за $${d.sellPrice}</button>
        `;
        list.appendChild(card);
    });
}

// ==========================================
// 8. УПРАВЛЕНИЕ ОКНАМИ
// ==========================================
function toggleModal(modal, action) { 
    if (!modal) return; 
    if (action === 'open') { modal.classList.add('active'); } 
    else { modal.classList.remove('active'); } 
}

if (ui.openShop) ui.openShop.onclick = function() { toggleModal(ui.shopModal, 'open'); generateTrackItems(caseTrack, youtubersDatabase); };
if (ui.closeShop) ui.closeShop.onclick = () => toggleModal(ui.shopModal, 'close');
if (ui.openWheel) ui.openWheel.onclick = function() { toggleModal(ui.wheelModal, 'open'); generateTrackItems(wheelTrack, youtubersDatabase); };
if (ui.closeWheel) ui.closeWheel.onclick = () => toggleModal(ui.wheelModal, 'close');
if (ui.openInv) ui.openInv.onclick = function() { renderInventory(); toggleModal(ui.inventoryModal, 'open'); };
if (ui.closeInv) ui.closeInv.onclick = () => toggleModal(ui.inventoryModal, 'close');

// Привязка модалки крафта
if (ui.openCraft) ui.openCraft.onclick = function() { renderCraftInventory(); updateContractZone(); toggleModal(ui.craftModal, 'open'); };
if (ui.closeCraft) ui.closeCraft.onclick = () => { contractItems = []; toggleModal(ui.craftModal, 'close'); };

// ==========================================
// СЕКРЕТНЫЙ ЧИТ-КОД ДЛЯ ВЛАДЕЛЬЦА (АДМИНКА)
// ==========================================
const closeAdminBtn = document.getElementById("close-admin-btn");
const adminApplyBtn = document.getElementById("admin-apply-btn");
const adminModal = document.getElementById("admin-modal");

const SECRET_PASSWORD = "vakuoladmin";
const targetTitle = document.querySelector('.game-container h1');

if (targetTitle && adminModal) {
    targetTitle.style.cursor = "pointer";
    
    targetTitle.onclick = function() {
        const pass = prompt("Введите секретный ключ создателя игры:");
        if (pass === SECRET_PASSWORD) {
            const coinsInput = document.getElementById('admin-coins-input');
            const levelInput = document.getElementById('admin-level-input');
            if (coinsInput) coinsInput.value = gameState.coins;
            if (levelInput) levelInput.value = gameState.level;
            toggleModal(adminModal, 'open');
        } else if (pass !== null) {
            alert("⚠️ Доступ заблокирован. Ты не создатель этой игры!");
        }
    };
}

if (closeAdminBtn && adminModal) {
    closeAdminBtn.onclick = function() {
        toggleModal(adminModal, 'close');
    };
}

if (adminApplyBtn && adminModal) {
    adminApplyBtn.onclick = function() {
        const newCoinsVal = document.getElementById('admin-coins-input') ? document.getElementById('admin-coins-input').value : "";
        const newLevelVal = document.getElementById('admin-level-input') ? document.getElementById('admin-level-input').value : "";
        
        const newCoins = parseInt(newCoinsVal);
        const newLevel = parseInt(newLevelVal);
        
        if (!isNaN(newCoins)) gameState.coins = newCoins;
        if (!isNaN(newLevel)) {
            gameState.level = newLevel;
            gameState.xp = 0;
            gameState.xpNeeded = Math.round(100 * Math.pow(1.5, newLevel - 1));
        }
        
        updateUI();
        saveGame();
        toggleModal(adminModal, 'close');
        
        triggerLegendaryCelebration(document.querySelector('.game-container'));
    };
}

if (ui.resetBtn) { 
    ui.resetBtn.onclick = function() { 
        if (confirm('Реально хочешь обнулить весь прогресс?')) { 
            localStorage.removeItem('ultimate_clicker_save_v6'); 
            location.reload(); 
        } 
    }; 
}

// Загрузка сейвов и старт игры при запуске страницы
loadGame();
updateSpinButtonStatus();
updateUI();

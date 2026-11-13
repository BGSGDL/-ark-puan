let adminRequests = JSON.parse(localStorage.getItem("wheelAdminReq") || "[]");

function updateBalanceUI() {
    const pointText = document.getElementById("points");
    if (currentUser && users[currentUser]) {
        if(pointText) pointText.textContent = users[currentUser].balance;
        if(!users[currentUser].history) users[currentUser].history = [];
    }
}

function openModal(id) {
    if(id === 'withdrawModal' && currentUser) {
        const info = document.getElementById("withdrawInfo");
        if(info) info.textContent = "Çekilebilecek Bakiye: " + users[currentUser].balance + " TL";
    }
    const modal = document.getElementById(id);
    if(modal) modal.classList.remove("hidden");
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => {
        if(m.id !== 'authModal') m.classList.add("hidden");
    });
}

function submitDeposit() {
    const amount = Number(document.getElementById("depositAmount").value);
    const name = document.getElementById("depositName").value.trim();
    if(!amount || amount <= 0 || !name) { alert("Lütfen tüm alanları doldurun."); return; }

    const reqId = Date.now();
    adminRequests.push({ id: reqId, type: 'deposit', user: currentUser, amount: amount, name: name, date: new Date().toLocaleDateString(), status: 'Bekliyor' });
    localStorage.setItem("wheelAdminReq", JSON.stringify(adminRequests));

    users[currentUser].history.unshift({ id: reqId, text: "+" + amount + " TL Yatırma", status: "Bekliyor", date: new Date().toLocaleDateString() });
    localStorage.setItem("wheelUsers", JSON.stringify(users));

    updateBalanceUI();
    closeModals();
    const message = document.getElementById("message");
    if(message) message.textContent = "Para yatırma talebiniz yönetici onayına gönderildi.";
}

function submitWithdraw() {
    const amount = Number(document.getElementById("withdrawAmount").value);
    const name = document.getElementById("withdrawName").value.trim();
    const iban = document.getElementById("withdrawIban").value.trim().toUpperCase();

    if(!amount || amount <= 0 || !name || !iban) { alert("Lütfen tüm alanları doldurun."); return; }
    if(!iban.startsWith("TR") || iban.length !== 26) { alert("Geçersiz IBAN! 26 hane olmalı."); return; }
    if(amount > users[currentUser].balance) { alert("Yetersiz bakiye!"); return; }

    users[currentUser].balance -= amount;
    localStorage.setItem("wheelUsers", JSON.stringify(users));

    const reqId = Date.now();
    adminRequests.push({ id: reqId, type: 'withdraw', user: currentUser, amount: amount, name: name, iban: iban, date: new Date().toLocaleDateString(), status: 'Bekliyor' });
    localStorage.setItem("wheelAdminReq", JSON.stringify(adminRequests));

    users[currentUser].history.unshift({ id: reqId, text: "-" + amount + " TL Çekim", status: "Bekliyor", date: new Date().toLocaleDateString() });
    localStorage.setItem("wheelUsers", JSON.stringify(users));

    updateBalanceUI();
    closeModals();
    const message = document.getElementById("message");
    if(message) message.textContent = "Çekim talebiniz alındı.";
}

function submitSupport() {
    const text = document.getElementById("supportMessage").value.trim();
    if(!text) { alert("Mesaj yazın."); return; }
    adminRequests.push({ id: Date.now(), type: 'support', user: currentUser, text: text, date: new Date().toLocaleDateString(), status: 'Bekliyor' });
    localStorage.setItem("wheelAdminReq", JSON.stringify(adminRequests));
    closeModals();
    const message = document.getElementById("message");
    if(message) message.textContent = "Destek talebi iletildi.";
}

function openHistory() {
    const listDiv = document.getElementById("historyList");
    if(!listDiv || !currentUser || !users[currentUser]) return;
    listDiv.innerHTML = "";
    (users[currentUser].history || []).forEach(h => {
        let color = h.status === 'Onaylandı' ? '#4ade80' : (h.status === 'Reddedildi' ? '#f87171' : '#facc15');
        listDiv.innerHTML += `<div class="history-item"><span>${h.text}</span><span style="color:${color}; font-weight:bold;">${h.status}</span></div>`;
    });
    const historyModal = document.getElementById("historyModal");
    if(historyModal) historyModal.classList.remove("hidden");
                                        }
                                        

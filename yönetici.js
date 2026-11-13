function openAdminPanel() {
    let pass = prompt("Yönetici Şifresini Girin:");
    if (pass !== "BGSGDL_Admin_2026!#") { alert("Hatalı Şifre!"); return; }

    const listDiv = document.getElementById("adminRequestsList");
    if(!listDiv) return;
    listDiv.innerHTML = "";
    
    if(adminRequests.length === 0) {
        listDiv.innerHTML = "<div style='font-size:12px; color:#aaa; text-align:center;'>Talep yok.</div>";
    } else {
        adminRequests.forEach((req, index) => {
            if(req.status === 'Bekliyor') {
                listDiv.innerHTML += `<div class="admin-card">
                    <b>[${req.type.toUpperCase()}]</b> ${req.user} - ${req.amount || req.text}<br>
                    <button type="button" onclick="adminAction(${index}, 'approve')" style="background:#22c55e; color:white; border:none; padding:3px 6px; border-radius:4px; margin-top:4px; cursor:pointer;">Onayla</button>
                    <button type="button" onclick="adminAction(${index}, 'reject')" style="background:#ef4444; color:white; border:none; padding:3px 6px; border-radius:4px; margin-top:4px; cursor:pointer;">Reddet</button>
                </div>`;
            }
        });
    }
    const adminModal = document.getElementById("adminModal");
    if(adminModal) adminModal.classList.remove("hidden");
}

function adminAction(index, action) {
    let req = adminRequests[index];
    let targetUser = users[req.user];
    if(action === 'approve') {
        if((req.type === 'deposit' || req.type === 'withdraw') && targetUser) {
            if(req.type === 'deposit') targetUser.balance += req.amount;
            targetUser.history = targetUser.history.map(h => h.id === req.id ? {...h, status: "Onaylandı"} : h);
        }
        alert("Onaylandı.");
    } else {
        if(req.type === 'withdraw' && targetUser) {
            targetUser.balance += req.amount;
        }
        if(targetUser) targetUser.history = targetUser.history.map(h => h.id === req.id ? {...h, status: "Reddedildi"} : h);
        alert("Reddedildi.");
    }
    adminRequests.splice(index, 1);
    localStorage.setItem("wheelAdminReq", JSON.stringify(adminRequests));
    localStorage.setItem("wheelUsers", JSON.stringify(users));
    openAdminPanel();
    updateBalanceUI();
}

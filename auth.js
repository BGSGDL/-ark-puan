let users = JSON.parse(localStorage.getItem("wheelUsers") || "{}");
let currentUser = localStorage.getItem("wheelCurrentUser") || null;
let isLoginMode = true;

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById("authTitle");
    const switchText = document.getElementById("authSwitch");
    if(title) title.textContent = isLoginMode ? "Giriş Yap" : "Kayıt Ol";
    if(switchText) switchText.textContent = isLoginMode ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap";
}

function handleAuth() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value;
    const errorBox = document.getElementById("authError");

    if(!username || !password) {
        if(errorBox) errorBox.textContent = "Tüm alanları doldurun.";
        return;
    }

    if(isLoginMode) {
        if(users[username] && users[username].password === password) {
            currentUser = username;
            localStorage.setItem("wheelCurrentUser", currentUser);
            checkAuth();
        } else {
            if(errorBox) errorBox.textContent = "Hatalı kullanıcı adı veya şifre.";
        }
    } else {
        if(users[username]) {
            if(errorBox) errorBox.textContent = "Bu kullanıcı adı zaten alınmış.";
        } else {
            users[username] = { password: password, balance: 0, history: [] };
            localStorage.setItem("wheelUsers", JSON.stringify(users));
            currentUser = username;
            localStorage.setItem("wheelCurrentUser", currentUser);
            checkAuth();
        }
    }
}

function checkAuth() {
    const authModal = document.getElementById("authModal");
    const activeUserSpan = document.getElementById("activeUser");
    const adminBtn = document.getElementById("adminBtn");

    if(currentUser) {
        if(authModal) authModal.classList.add("hidden");
        if(activeUserSpan) activeUserSpan.textContent = currentUser;
        if(currentUser === "BGSGDL" && adminBtn) {
            adminBtn.style.display = "inline-block";
        }
        if(typeof updateBalanceUI === 'function') updateBalanceUI();
    } else {
        if(authModal) authModal.classList.remove("hidden");
    }
}

function logout() {
    localStorage.removeItem("wheelCurrentUser");
    currentUser = null;
    location.reload();
}

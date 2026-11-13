let users = JSON.parse(localStorage.getItem("wheelUsers") || "{}");
let currentUser = localStorage.getItem("wheelCurrentUser") || null;
let isRegisterMode = true;

function checkAdminAccess() {
    const adminBtn = document.getElementById("adminBtn");
    if (currentUser === "BGSGDL") {
        if(adminBtn) adminBtn.style.display = "inline-block";
    } else {
        if(adminBtn) adminBtn.style.display = "none";
    }
}

function checkAuth() {
    const authModal = document.getElementById("authModal");
    const activeUserText = document.getElementById("activeUser");
    if (currentUser && users[currentUser]) {
        if(authModal) authModal.style.display = "none";
        if(activeUserText) activeUserText.textContent = currentUser;
        updateBalanceUI();
        checkAdminAccess();
    } else {
        if(authModal) authModal.style.display = "flex";
        checkAdminAccess();
    }
}

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const authTitle = document.getElementById("authTitle");
    const authError = document.getElementById("authError");
    const authSwitch = document.getElementById("authSwitch");
    if(authError) authError.textContent = "";
    if (isRegisterMode) {
        if(authTitle) authTitle.textContent = "Kayıt Ol";
        if(authSwitch) authSwitch.textContent = "Zaten hesabın var mı? Giriş Yap";
    } else {
        if(authTitle) authTitle.textContent = "Giriş Yap";
        if(authSwitch) authSwitch.textContent = "Hesabın yok mu? Kayıt Ol";
    }
}

function handleAuth() {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const authError = document.getElementById("authError");
    if (!usernameInput || !passwordInput) return;
    
    const uname = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    
    if (!uname || !pass) { 
        if(authError) authError.textContent = "Kullanıcı adı ve şifre boş bırakılamaz."; 
        return; 
    }

    if (isRegisterMode) {
        if (users[uname]) { 
            if(authError) authError.textContent = "Bu kullanıcı adı zaten alınmış."; 
            return; 
        }
        users[uname] = { password: pass, balance: 0, history: [] };
    } else {
        if (!users[uname] || users[uname].password !== pass) { 
            if(authError) authError.textContent = "Kullanıcı adı veya şifre hatalı."; 
            return; 
        }
    }

    localStorage.setItem("wheelUsers", JSON.stringify(users));
    currentUser = uname;
    localStorage.setItem("wheelCurrentUser", currentUser);
    checkAuth();
}

function logout() {
    currentUser = null;
    localStorage.removeItem("wheelCurrentUser");
    checkAuth();
    }

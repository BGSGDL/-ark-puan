const prizes = [100, 50, 20, 10, 10, 5, 5, 1, 1, 1, 1, 1, 1, 5, 5, 10, 10, 20, 50, 100];
const canvas = document.getElementById("wheel");
let angle = 0, spinning = false;

if(canvas) {
    const ctx = canvas.getContext("2d");

    function draw() {
        const size = canvas.width, center = size / 2, radius = 280;
        const colors = ["#9333ea", "#0ea5e9", "#22c55e", "#f97316", "#ef4444"];
        ctx.clearRect(0, 0, size, size);
        const step = Math.PI * 2 / prizes.length;
        prizes.forEach((p, i) => {
            let start = angle + i * step, end = start + step;
            ctx.beginPath(); ctx.moveTo(center, center); ctx.arc(center, center, radius, start, end);
            ctx.closePath(); ctx.fillStyle = colors[i % colors.length]; ctx.fill();
            ctx.strokeStyle = "#fef08a"; ctx.lineWidth = 4; ctx.stroke();
            ctx.save(); ctx.translate(center, center); ctx.rotate(start + step / 2);
            ctx.fillStyle = "#ffffff"; ctx.font = "bold 24px Arial"; ctx.textAlign = "right";
            ctx.fillText(p + " TL", radius - 25, 8); ctx.restore();
        });
        ctx.beginPath(); ctx.arc(center, center, 50, 0, Math.PI * 2);
        ctx.fillStyle = "#ca8a04"; ctx.fill(); ctx.strokeStyle = "#fef08a"; ctx.lineWidth = 8; ctx.stroke();
        ctx.fillStyle = "#fde047"; ctx.font = "bold 30px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("★", center, center);
    }
    draw();

    const spinBtn = document.getElementById("spin");
    if(spinBtn) {
        spinBtn.onclick = () => {
            if (spinning || !currentUser) return;
            if (users[currentUser].balance < 10) { alert("Yetersiz bakiye! En az 10 TL gerekli."); return; }

            users[currentUser].balance -= 10;
            if(!users[currentUser].history) users[currentUser].history = [];
            users[currentUser].history.unshift({text: "Çeviri Ücreti: -10 TL", status: "Tamamlandı", date: new Date().toLocaleDateString()});
            localStorage.setItem("wheelUsers", JSON.stringify(users));
            updateBalanceUI();

            spinning = true;
            spinBtn.disabled = true;
            const message = document.getElementById("message");
            if(message) message.textContent = "Çark dönüyor...";

            const rnd = Math.random() * 1000;
            let targetValue = 1;
            if (rnd < 2) targetValue = 100;
            else if (rnd < 8) targetValue = 50;
            else if (rnd < 40) targetValue = 20;
            else if (rnd < 150) targetValue = 10;
            else if (rnd < 450) targetValue = 5;
            else targetValue = 1;

            let matching = [];
            prizes.forEach((p, idx) => { if (p === targetValue) matching.push(idx); });
            const chosen = matching[Math.floor(Math.random() * matching.length)];

            const step = Math.PI * 2 / prizes.length;
            const targetAngle = -Math.PI / 2 - (chosen * step) - (step / 2);
            const extraTurns = 8 * Math.PI * 2;
            const currentAngle = angle;
            const relativeTarget = (targetAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            const currentMod = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
            let diff = relativeTarget - currentMod;
            if (diff < 0) diff += Math.PI * 2;

            const finish = currentAngle + extraTurns + diff;
            const duration = 5000, begin = performance.now();

            function animate(now) {
                let t = Math.min(1, (now - begin) / duration);
                let ease = 1 - Math.pow(1 - t, 4);
                angle = currentAngle + (finish - currentAngle) * ease;
                draw();
                if (t < 1) {
                    requestAnimationFrame(animate);
                } else {
                    angle = finish; draw();
                    users[currentUser].balance += prizes[chosen];
                    users[currentUser].history.unshift({text: "Çarktan Kazanıldı: +" + prizes[chosen] + " TL", status: "Tamamlandı", date: new Date().toLocaleDateString()});
                    localStorage.setItem("wheelUsers", JSON.stringify(users));
                    updateBalanceUI();
                    if(message) message.textContent = "Tebrikler! " + prizes[chosen] + " TL kazandın!";
                    spinning = false; spinBtn.disabled = false;
                }
            }
            requestAnimationFrame(animate);
        };
    }
                      }

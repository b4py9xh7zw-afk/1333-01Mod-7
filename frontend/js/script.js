function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIconSvg = document.getElementById('eyeIconSvg');
    
    // Check current type
    const isPassword = passwordInput.getAttribute('type') === 'password';
    
    // Toggle input type
    const type = isPassword ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle icon path
    if (isPassword) {
        // Switch to Open Eye (Show Password)
        eyeIconSvg.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    } else {
        // Switch to Closed Eye (Hide Password)
        eyeIconSvg.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
    }
}

// Toggle Login Mode (Password <-> QR)
function toggleLoginMode() {
    const passwordView = document.getElementById('password-login-view');
    const qrView = document.getElementById('qr-login-view');
    const qrToggleIcon = document.getElementById('qrToggleIcon');
    const qrTooltip = document.getElementById('qrTooltip');

    // Check if currently in Password mode (if password view is visible)
    const isPasswordMode = passwordView.style.display !== 'none';

    if (isPasswordMode) {
        // Switch to QR Mode
        passwordView.style.display = 'none';
        qrView.style.display = 'block';
        
        // Update Icon to PC (Monitor) - indicating "Click to go back to PC Login"
        // Using SVG for PC icon
        qrToggleIcon.innerHTML = `
            <svg viewBox="0 0 24 24" class="pc-icon-svg" fill="#999">
                <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
            </svg>
        `;
        
        // Update Tooltip Text
        qrTooltip.innerHTML = `
            账号密码登录
            <div class="tooltip-arrow"></div>
        `;
    } else {
        // Switch back to Password Mode
        passwordView.style.display = 'block';
        qrView.style.display = 'none';
        
        // Update Icon to QR Code - indicating "Click to Scan Login"
        qrToggleIcon.innerHTML = '<img src="images/qr_icon.png" alt="切换登录模式" class="corner-img">';
        
        // Update Tooltip Text
        qrTooltip.innerHTML = `
            扫码登录
            <div class="tooltip-arrow"></div>
        `;
    }
}

// Toast Functionality
function showToast(message, type = 'info') {
    // Create container if not exists
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let icon = '';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✕';
    else icon = 'ℹ';

    toast.innerHTML = `<span class="toast-icon">${icon}</span>${message}`;
    
    // Add to container
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

const CaptchaManager = (function () {
    let currentCaptcha = '';
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

    function generateCode(length = 4) {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    function drawCaptcha(code) {
        const canvas = document.getElementById('captchaCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(${rand(0, 200)}, ${rand(0, 200)}, ${rand(0, 200)}, 0.5)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rand(0, w), rand(0, h));
            ctx.lineTo(rand(0, w), rand(0, h));
            ctx.stroke();
        }

        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${rand(0, 200)}, ${rand(0, 200)}, ${rand(0, 200)}, 0.5)`;
            ctx.beginPath();
            ctx.arc(rand(0, w), rand(0, h), 1, 0, Math.PI * 2);
            ctx.fill();
        }

        const fonts = ['Arial', 'Georgia', 'Verdana', 'Times New Roman'];
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            const fontSize = rand(22, 28);
            const font = fonts[rand(0, fonts.length - 1)];
            ctx.font = `bold ${fontSize}px ${font}`;
            ctx.fillStyle = `rgb(${rand(20, 120)}, ${rand(20, 120)}, ${rand(20, 120)})`;
            const x = 15 + i * 20;
            const y = h / 2 + rand(-4, 4);
            const angle = (rand(-25, 25) * Math.PI) / 180;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.textBaseline = 'middle';
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }

        canvas.setAttribute('aria-label', `图形验证码，内容是${code.split('').join('，')}`);
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function refresh() {
        hideError();
        currentCaptcha = generateCode();
        drawCaptcha(currentCaptcha);
        return currentCaptcha;
    }

    function getCurrent() {
        return currentCaptcha;
    }

    function validate(input) {
        return input.toLowerCase() === currentCaptcha.toLowerCase();
    }

    function speak() {
        const audioBtn = document.getElementById('audioCaptchaBtn');
        hideError();

        if (!('speechSynthesis' in window)) {
            showError('当前浏览器不支持语音功能，请尝试使用其他浏览器或手动输入验证码。');
            return false;
        }

        try {
            window.speechSynthesis.cancel();

            const utter = new SpeechSynthesisUtterance();
            const chars = currentCaptcha.split('');
            utter.text = '验证码是：' + chars.join('，') + '。';
            utter.lang = 'zh-CN';
            utter.rate = 0.8;
            utter.pitch = 1;
            utter.volume = 1;

            utter.onstart = function () {
                if (audioBtn) audioBtn.classList.add('playing');
            };

            utter.onend = function () {
                if (audioBtn) audioBtn.classList.remove('playing');
            };

            utter.onerror = function (e) {
                if (audioBtn) audioBtn.classList.remove('playing');
                if (e.error && e.error !== 'canceled' && e.error !== 'interrupted') {
                    showError('语音播放失败，请手动输入验证码或稍后重试。');
                }
            };

            window.speechSynthesis.speak(utter);
            return true;
        } catch (e) {
            if (audioBtn) audioBtn.classList.remove('playing');
            showError('语音播放失败，请手动输入验证码或稍后重试。');
            return false;
        }
    }

    function showError(message) {
        const errorEl = document.getElementById('captchaError');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function hideError() {
        const errorEl = document.getElementById('captchaError');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    }

    return { refresh, getCurrent, validate, speak, showError, hideError };
})();

// Validation Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const captchaInput = document.getElementById('captchaInput');
    const refreshBtn = document.getElementById('refreshCaptchaBtn');
    const audioBtn = document.getElementById('audioCaptchaBtn');
    const captchaCanvas = document.getElementById('captchaCanvas');

    CaptchaManager.refresh();

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            CaptchaManager.refresh();
            if (captchaInput) captchaInput.focus();
        });
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', function () {
            CaptchaManager.speak();
        });
    }

    if (captchaCanvas) {
        captchaCanvas.addEventListener('click', function () {
            CaptchaManager.refresh();
            if (captchaInput) captchaInput.focus();
        });

        captchaCanvas.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                CaptchaManager.refresh();
                if (captchaInput) captchaInput.focus();
            }
        });
    }

    if (captchaInput) {
        captchaInput.addEventListener('input', function () {
            CaptchaManager.hideError();
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const captcha = captchaInput ? captchaInput.value.trim() : '';

            if (!username) {
                showToast('请输入邮箱账号或手机号码', 'error');
                usernameInput.focus();
                return;
            }

            if (!password) {
                showToast('请输入密码', 'error');
                passwordInput.focus();
                return;
            }

            if (!captcha) {
                CaptchaManager.showError('请输入验证码');
                captchaInput.focus();
                return;
            }

            if (!CaptchaManager.validate(captcha)) {
                CaptchaManager.refresh();
                CaptchaManager.showError('验证码错误，请重新输入');
                captchaInput.value = '';
                captchaInput.focus();
                return;
            }

            showToast('登录成功', 'success');
        });
    }
});

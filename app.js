/**
 * App Logic cho Người Nhận Thiệp 19/11 với Hiệu Ứng Phong Bì 3D & Lời Chúc 3D
 */

let customWishes = typeof defaultCustomWishes !== 'undefined' ? [...defaultCustomWishes] : [];

// Chuẩn hóa chuỗi tiếng Việt để so khớp (không dấu, thường)
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim();
}

// Tải danh sách lời chúc từ Server hoặc Storage
async function loadWishesFromServer() {
  // 1. Kiểm tra LocalStorage nếu có
  const localSaved = localStorage.getItem('mens_day_wishes_storage_v2');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customWishes = parsed;
        return;
      }
    } catch (e) {}
  }

  // 2. Thử nạp từ file static data
  try {
    const res = await fetch('data/wishes.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        customWishes = data;
        return;
      }
    }
  } catch (err) {}

  // 3. Fallback mặc định từ wishes-data.js
  customWishes = typeof defaultCustomWishes !== 'undefined' ? [...defaultCustomWishes] : [];
}

// Tìm lời chúc theo tên (Thuật toán so khớp thông minh)
function findWishByName(inputName) {
  if (!inputName) return null;
  const normInput = normalizeString(inputName);
  
  // 1. So khớp chính xác hoặc theo từ khóa đã cài đặt
  for (const item of customWishes) {
    const normItemName = normalizeString(item.name);
    if (normItemName === normInput) {
      return item;
    }
    if (item.keywords && Array.isArray(item.keywords)) {
      for (const kw of item.keywords) {
        const normKw = normalizeString(kw);
        if (normInput.includes(normKw) || normKw.includes(normInput)) {
          return item;
        }
      }
    }
  }

  // 2. So khớp theo tên gọi chính (ví dụ: gõ "Vinh", "Lê Vinh" đều khớp "Nguyễn Lê Vinh")
  const parts = normInput.split(/\s+/);
  const lastName = parts[parts.length - 1];
  if (lastName && lastName.length >= 2) {
    for (const item of customWishes) {
      const itemParts = normalizeString(item.name).split(/\s+/);
      const itemLastName = itemParts[itemParts.length - 1];
      if (itemLastName === lastName) {
        return item;
      }
    }
  }

  return null;
}

// Bắn pháo hoa ăn mừng rực rỡ
function triggerFestiveConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#fbbf24', '#ef4444', '#3b82f6', '#ffffff']
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#fbbf24', '#ef4444', '#3b82f6', '#ffffff']
    }));
  }, 250);
}

// Background particles canvas
function initBackgroundParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 0.5,
    speedY: -Math.random() * 0.6 - 0.2,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.7 + 0.2,
    color: Math.random() > 0.3 ? '#f59e0b' : '#60a5fa'
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * Hiển thị lời chúc 3D sắc nét, nổi bật và có animation mượt mà
 */
function render3DWishText(text) {
  const container = document.getElementById('card-wish-text');
  if (!container) return;
  
  container.innerHTML = `<p class="wish-text-display font-medium text-slate-100">${text}</p>`;
}

/**
 * Khởi tạo tương tác nghiêng 3D Parallax khi rê chuột (Card Tilt 3D)
 */
function init3DCardTilt() {
  const card = document.getElementById('greeting-card-content');
  const glare = document.getElementById('card-glare');
  if (!card) return;

  const maxTilt = 14; // Độ nghiêng tối đa (độ)

  function handleMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const tiltX = -percentY * maxTilt;
    const tiltY = percentX * maxTilt;

    card.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${(percentX * 50 + 50).toFixed(1)}% ${(percentY * 50 + 50).toFixed(1)}%, rgba(254, 240, 138, 0.22) 0%, transparent 65%)`;
    }
  }

  function handleMouseLeave() {
    card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glare) glare.style.opacity = '0';
  }

  // Tương tác chuột
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  // Tương tác chạm trên màn hình cảm ứng di động
  card.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove(touch);
    }
  }, { passive: true });

  card.addEventListener('touchend', handleMouseLeave);
}

let currentRecipientName = "";

// Hàm kích hoạt mở thiệp 3D (Toàn cục - Không bao giờ reload trang)
window.handleSubmitRecipientName = function(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  const inputName = document.getElementById('recipient-name-input');
  if (!inputName) return false;
  const name = inputName.value.trim();
  if (!name) {
    inputName.focus();
    return false;
  }
  start3DOpeningSequence(name);
  return false;
};

// Chuỗi chuyển động mở thiệp (Mở trực tiếp, mượt mà và tráng lệ như bản đầu)
function start3DOpeningSequence(name) {
  currentRecipientName = name;

  const stepInput = document.getElementById('step-input');
  const stepCard = document.getElementById('step-card');
  const cardElement = document.getElementById('greeting-card-content');

  // 1. Cập nhật tên vào thiệp
  const cardNameEl = document.getElementById('card-recipient-name');
  if (cardNameEl) cardNameEl.textContent = name;

  // 2. Tìm lời chúc tương ứng
  let wishText = "";
  let wishTitle = "Quý Ông Đích Thực";
  const matched = findWishByName(name);
  if (matched) {
    wishTitle = matched.title || "Quý Ông Đích Thực";
    wishText = matched.wish;
  } else {
    // Tự động chèn tên người nhận vào lời chúc mẫu để luôn mang tính cá nhân hóa tương ứng
    const nameParts = name.trim().split(/\s+/);
    const shortName = nameParts[nameParts.length - 1];
    const randomItem = defaultWishPool[Math.floor(Math.random() * defaultWishPool.length)];
    wishTitle = randomItem.title;
    wishText = randomItem.wish.replace(/bạn/g, `anh ${shortName}`);
  }

  const titleTag = document.getElementById('card-title-tag');
  if (titleTag) titleTag.textContent = wishTitle;

  // 3. Hiển thị lời chúc rõ ràng
  render3DWishText(wishText);

  // 4. Chuyển cảnh mở thiệp ngay lập tức
  if (stepInput) stepInput.classList.add('hidden');
  if (stepCard) stepCard.classList.remove('hidden');

  // Kích hoạt lại animation mở thiệp 3D card-appear
  if (cardElement) {
    cardElement.classList.remove('card-appear');
    void cardElement.offsetWidth; // Reflow
    cardElement.classList.add('card-appear');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 5. Kích hoạt pháo hoa Confetti hoàng tráng
  triggerFestiveConfetti();
}

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  init3DCardTilt();
  loadWishesFromServer();

  const form = document.getElementById('name-form');
  const inputName = document.getElementById('recipient-name-input');

  // Kiểm tra URL Params nếu có ?name=...
  const urlParams = new URLSearchParams(window.location.search);
  const paramName = urlParams.get('name');
  if (paramName) {
    if (inputName) inputName.value = paramName;
    setTimeout(() => {
      start3DOpeningSequence(paramName);
    }, 400);
  }

  // Khi form submit (phòng hờ)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.handleSubmitRecipientName(e);
      return false;
    });
  }

  // Tải ảnh thiệp PNG sắc nét
  document.getElementById('btn-download-card').addEventListener('click', async () => {
    const cardElement = document.getElementById('greeting-card-content');
    const downloadBtn = document.getElementById('btn-download-card');
    const originalText = downloadBtn.innerHTML;

    // Tạm thời đưa transform về chuẩn để html2canvas chụp không bị méo góc
    const originalTransform = cardElement.style.transform;
    cardElement.style.transform = 'none';

    downloadBtn.innerHTML = `<span>⏳ Đang tạo ảnh...</span>`;
    downloadBtn.disabled = true;

    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0f1d'
      });

      // Khôi phục lại transform
      cardElement.style.transform = originalTransform;

      const image = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = image;
      a.download = `Thiep_19_11_${normalizeString(currentRecipientName).replace(/\s+/g, '_')}.png`;
      a.click();
    } catch (err) {
      cardElement.style.transform = originalTransform;
      console.error("Lỗi xuất ảnh:", err);
      alert("Chưa thể tải ảnh tự động, bạn có thể chụp màn hình thiệp nhé!");
    } finally {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }
  // ===== LOGIC QUẢN TRỊ BÍ MẬT KHI TRUY CẬP #itedit =====
  const secretModal = document.getElementById('secret-itedit-modal');
  const secretLoginView = document.getElementById('secret-login-view');
  const secretDashboardView = document.getElementById('secret-dashboard-view');
  const secretPasswordInput = document.getElementById('secret-password-input');
  const secretPwdError = document.getElementById('secret-pwd-error');
  const secretLoginForm = document.getElementById('secret-login-form');
  const btnCloseSecretModal = document.getElementById('btn-close-secret-modal');

  function checkSecretTrigger() {
    if (window.location.hash === '#itedit' || window.location.search.includes('itedit')) {
      if (secretModal) {
        secretModal.classList.remove('hidden');
        if (sessionStorage.getItem('itedit_auth') === 'true') {
          showSecretDashboard();
        } else {
          secretLoginView.classList.remove('hidden');
          secretDashboardView.classList.add('hidden');
          secretPasswordInput.focus();
        }
      }
    }
  }

  // Kiểm tra ngay khi tải trang và khi hash thay đổi
  checkSecretTrigger();
  window.addEventListener('hashchange', checkSecretTrigger);

  if (btnCloseSecretModal) {
    btnCloseSecretModal.addEventListener('click', () => {
      secretModal.classList.add('hidden');
      window.location.hash = '';
    });
  }

  // Đăng nhập bằng mật khẩu admin123
  if (secretLoginForm) {
    secretLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      secretPwdError.classList.add('hidden');
      if (secretPasswordInput.value.trim() === 'admin123') {
        sessionStorage.setItem('itedit_auth', 'true');
        showSecretDashboard();
      } else {
        secretPwdError.classList.remove('hidden');
      }
    });
  }

  function showSecretDashboard() {
    secretLoginView.classList.add('hidden');
    secretDashboardView.classList.remove('hidden');
    renderSecretWishesList();
  }

  function renderSecretWishesList() {
    const listEl = document.getElementById('secret-wishes-list');
    const badgeEl = document.getElementById('secret-count-badge');
    if (!listEl) return;

    if (badgeEl) badgeEl.textContent = `${customWishes.length} thành viên`;

    if (customWishes.length === 0) {
      listEl.innerHTML = `<p class="text-xs text-slate-400 italic text-center py-4">Chưa có thành viên nào.</p>`;
      return;
    }

    listEl.innerHTML = customWishes.map((item, idx) => `
      <div class="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-amber-300 text-xs">${item.name}</span>
            <span class="text-[10px] text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">${item.title || 'Quý Ông'}</span>
          </div>
          <p class="text-[11px] text-slate-300 truncate mt-0.5">${item.wish}</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button onclick="copyMemberLink('${encodeURIComponent(item.name)}')" class="text-[11px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded" title="Sao chép link gửi riêng">
            📋 Copy Link
          </button>
          <button onclick="editSecretWish(${idx})" class="text-[11px] bg-amber-600 hover:bg-amber-500 text-white px-2 py-1 rounded">
            ✏️
          </button>
          <button onclick="deleteSecretWish(${idx})" class="text-[11px] bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
  }

  // Thêm / Sửa thành viên trong secret modal
  const secretAddForm = document.getElementById('secret-add-form');
  if (secretAddForm) {
    secretAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const editIdx = document.getElementById('secret-edit-id').value;
      const name = document.getElementById('secret-name').value.trim();
      const title = document.getElementById('secret-title').value.trim();
      const wish = document.getElementById('secret-wish').value.trim();

      if (!name || !wish) return;

      const keywords = [name.toLowerCase()];
      const parts = name.split(' ');
      if (parts.length > 1) keywords.push(parts[parts.length - 1].toLowerCase());

      if (editIdx !== '') {
        const i = parseInt(editIdx, 10);
        customWishes[i] = { ...customWishes[i], name, title: title || 'Quý Ông Đích Thực', wish, keywords };
      } else {
        customWishes.unshift({
          id: Date.now().toString(),
          name,
          title: title || 'Quý Ông Đích Thực',
          wish,
          keywords
        });
      }

      localStorage.setItem('mens_day_wishes_storage_v2', JSON.stringify(customWishes));
      renderSecretWishesList();
      resetSecretForm();
      alert(`Đã lưu thành công lời chúc cho "${name}"!`);
    });
  }

  const btnCancelSecretEdit = document.getElementById('secret-btn-cancel-edit');
  if (btnCancelSecretEdit) {
    btnCancelSecretEdit.addEventListener('click', resetSecretForm);
  }

  function resetSecretForm() {
    document.getElementById('secret-edit-id').value = '';
    document.getElementById('secret-name').value = '';
    document.getElementById('secret-title').value = '';
    document.getElementById('secret-wish').value = '';
    document.getElementById('secret-form-heading').textContent = '➕ Thêm Lời Chúc Cho Thành Viên Mới:';
    document.getElementById('secret-btn-submit').textContent = 'Lưu Lời Chúc Thành Viên';
    document.getElementById('secret-btn-cancel-edit').classList.add('hidden');
  }

  window.editSecretWish = function(idx) {
    const item = customWishes[idx];
    if (!item) return;
    document.getElementById('secret-edit-id').value = idx;
    document.getElementById('secret-name').value = item.name;
    document.getElementById('secret-title').value = item.title || '';
    document.getElementById('secret-wish').value = item.wish;
    document.getElementById('secret-form-heading').textContent = `✏️ Sửa lời chúc của: ${item.name}`;
    document.getElementById('secret-btn-submit').textContent = `Cập nhật cho ${item.name}`;
    document.getElementById('secret-btn-cancel-edit').classList.remove('hidden');
  };

  window.deleteSecretWish = function(idx) {
    if (confirm(`Bạn có chắc muốn xóa lời chúc này?`)) {
      customWishes.splice(idx, 1);
      localStorage.setItem('mens_day_wishes_storage_v2', JSON.stringify(customWishes));
      renderSecretWishesList();
      resetSecretForm();
    }
  };

  window.copyMemberLink = function(encodedName) {
    const baseUrl = window.location.href.split('?')[0].split('#')[0];
    const url = `${baseUrl}?name=${encodedName}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`Đã sao chép link gửi riêng!\n${url}\n\nBạn có thể gửi trực tiếp link này cho người nhận.`);
    }).catch(() => {
      prompt("Link gửi riêng của người này:", url);
    });
  };

  const btnExport = document.getElementById('secret-btn-export');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customWishes, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = "wishes.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }
});

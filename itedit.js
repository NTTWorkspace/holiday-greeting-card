/**
 * Logic Cổng Quản Trị itedit.js (Hoạt động 100% trên Vercel)
 */

const STORAGE_KEY = 'mens_day_wishes_storage_v2';
const AUTH_KEY = 'itedit_authenticated';
const ADMIN_PASSWORD = 'admin123'; // Mật khẩu quản trị mặc định

let wishesList = [];

// Chuẩn hóa chuỗi tiếng Việt để tìm kiếm
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

document.addEventListener('DOMContentLoaded', async () => {
  const sectionLogin = document.getElementById('section-login');
  const sectionDashboard = document.getElementById('section-dashboard');
  const btnLogout = document.getElementById('btn-admin-logout');
  const loginForm = document.getElementById('admin-login-form');
  const loginPassword = document.getElementById('login-password');
  const loginErrorMsg = document.getElementById('login-error-msg');

  // Kiểm tra phiên đăng nhập
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    showDashboard();
  } else {
    showLogin();
  }

  // Xử lý Đăng Nhập bằng Mật khẩu (Không cần backend)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pwd = loginPassword.value.trim();
    loginErrorMsg.classList.add('hidden');

    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
      loginForm.reset();
    } else {
      loginErrorMsg.textContent = "Mật khẩu không chính xác! Vui lòng thử lại.";
      loginErrorMsg.classList.remove('hidden');
      loginPassword.focus();
    }
  });

  // Đăng xuất
  btnLogout.addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    showLogin();
  });

  // Tìm kiếm thành viên
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderWishes(e.target.value);
  });

  // Xử lý Form Thêm / Cập nhật lời chúc
  const wishForm = document.getElementById('wish-form');
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('form-edit-id').value;
    const name = document.getElementById('form-name').value.trim();
    const title = document.getElementById('form-title').value.trim();
    const wish = document.getElementById('form-wish').value.trim();

    if (!name || !wish) return;

    const keywords = [name.toLowerCase()];
    const parts = name.split(' ');
    if (parts.length > 1) {
      keywords.push(parts[parts.length - 1].toLowerCase());
    }

    if (editId) {
      // Cập nhật
      const index = wishesList.findIndex(item => item.id === editId);
      if (index !== -1) {
        wishesList[index] = {
          ...wishesList[index],
          name,
          title: title || 'Quý Ông Đích Thực',
          wish,
          keywords,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Thêm mới
      wishesList.unshift({
        id: Date.now().toString(),
        name,
        title: title || 'Quý Ông Đích Thực',
        wish,
        keywords,
        updatedAt: new Date().toISOString()
      });
    }

    saveWishes();
    renderWishes();
    resetFormEdit();
    alert(editId ? `Đã cập nhật lời chúc cho "${name}" thành công!` : `Đã thêm thành công lời chúc cho "${name}"!`);
  });

  // Nút Hủy chế độ sửa
  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    resetFormEdit();
  });

  // Nút Xuất file JSON
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(wishesList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "wishes.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });
});

function showLogin() {
  document.getElementById('section-login').classList.remove('hidden');
  document.getElementById('section-dashboard').classList.add('hidden');
  document.getElementById('btn-admin-logout').classList.add('hidden');
}

async function showDashboard() {
  document.getElementById('section-login').classList.add('hidden');
  document.getElementById('section-dashboard').classList.remove('hidden');
  document.getElementById('btn-admin-logout').classList.remove('hidden');
  await loadWishes();
}

// Tải danh sách lời chúc
async function loadWishes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      wishesList = JSON.parse(saved);
      renderWishes();
      return;
    } catch (e) {}
  }

  // Thử tải từ server/file static
  try {
    const res = await fetch('/data/wishes.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        wishesList = data;
        saveWishes();
        renderWishes();
        return;
      }
    }
  } catch (e) {}

  // Fallback từ wishes-data.js
  if (typeof defaultCustomWishes !== 'undefined') {
    wishesList = [...defaultCustomWishes];
    saveWishes();
  }
  renderWishes();
}

function saveWishes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishesList));
}

// Render danh sách thành viên
function renderWishes(searchTerm = '') {
  const container = document.getElementById('wishes-list-container');
  const countBadge = document.getElementById('member-count-badge');
  if (!container) return;

  let filtered = wishesList;
  if (searchTerm.trim()) {
    const term = normalizeString(searchTerm);
    filtered = wishesList.filter(item => 
      normalizeString(item.name).includes(term) || 
      (item.title && normalizeString(item.title).includes(term))
    );
  }

  if (countBadge) {
    countBadge.textContent = `${wishesList.length} thành viên`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-slate-400 italic text-xs text-center py-8">Chưa có thành viên nào. Hãy thêm vào ở form bên trên!</p>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-amber-500/40 transition">
      <div class="flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-bold text-amber-300 text-sm">${item.name}</span>
          <span class="text-[11px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-medium">
            ${item.title || 'Quý Ông Đích Thực'}
          </span>
        </div>
        <p class="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">${item.wish}</p>
      </div>
      <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0 flex-wrap">
        <button onclick="copyMemberLink('${encodeURIComponent(item.name)}')" class="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg transition" title="Sao chép link gửi riêng">
          📋 Copy Link
        </button>
        <a href="/?name=${encodeURIComponent(item.name)}" target="_blank" class="text-xs bg-emerald-600/80 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg transition" title="Mở thiệp của người này">
          👁️ Xem thiệp
        </a>
        <button onclick="startEdit('${item.id}')" class="text-xs bg-amber-600/80 hover:bg-amber-500 text-white px-2.5 py-1.5 rounded-lg transition" title="Sửa">
          ✏️ Sửa
        </button>
        <button onclick="deleteWish('${item.id}')" class="text-xs bg-red-600/80 hover:bg-red-500 text-white px-2.5 py-1.5 rounded-lg transition" title="Xóa">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// Sao chép link gửi riêng cho từng người
window.copyMemberLink = function(encodedName) {
  const url = `${window.location.origin}/?name=${encodedName}`;
  navigator.clipboard.writeText(url).then(() => {
    alert(`Đã sao chép link gửi riêng!\n${url}\n\nBạn có thể gửi trực tiếp link này qua Zalo/Facebook cho người đó.`);
  }).catch(() => {
    prompt("Link gửi riêng của người này:", url);
  });
};

// Bắt đầu sửa lời chúc
window.startEdit = function(id) {
  const item = wishesList.find(w => w.id === id);
  if (!item) return;

  document.getElementById('form-edit-id').value = item.id;
  document.getElementById('form-name').value = item.name;
  document.getElementById('form-title').value = item.title || '';
  document.getElementById('form-wish').value = item.wish;

  document.getElementById('form-heading').innerHTML = `<span>✏️</span><span>Đang Sửa Lời Chúc Của: <b class="text-amber-300">${item.name}</b></span>`;
  document.getElementById('btn-submit-form').textContent = `Cập Nhật Lời Chúc Cho ${item.name}`;
  document.getElementById('btn-cancel-edit').classList.remove('hidden');

  document.getElementById('wish-form').scrollIntoView({ behavior: 'smooth' });
};

// Reset form
function resetFormEdit() {
  document.getElementById('form-edit-id').value = '';
  document.getElementById('form-name').value = '';
  document.getElementById('form-title').value = '';
  document.getElementById('form-wish').value = '';
  document.getElementById('form-heading').innerHTML = `<span>➕</span><span>Thêm Lời Chúc Cho Thành Viên Mới</span>`;
  document.getElementById('btn-submit-form').textContent = `Lưu Lời Chúc Thành Viên`;
  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

// Xóa lời chúc
window.deleteWish = function(id) {
  const item = wishesList.find(w => w.id === id);
  if (!item) return;

  if (confirm(`Bạn có chắc muốn xóa lời chúc dành cho "${item.name}"?`)) {
    wishesList = wishesList.filter(w => w.id !== id);
    saveWishes();
    renderWishes();
    resetFormEdit();
  }
};

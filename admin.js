/**
 * Logic Quản Trị Hệ Thống 19/11 (admin.js)
 */

let adminToken = localStorage.getItem('admin_token') || '';
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

  // Kiểm tra phiên đăng nhập
  await verifySession();

  // Xử lý Đăng Nhập
  const loginForm = document.getElementById('admin-login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    loginErrorMsg.classList.add('hidden');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success && data.token) {
        adminToken = data.token;
        localStorage.setItem('admin_token', adminToken);
        showDashboard();
      } else {
        loginErrorMsg.textContent = data.message || "Tài khoản hoặc mật khẩu không đúng!";
        loginErrorMsg.classList.remove('hidden');
      }
    } catch (err) {
      loginErrorMsg.textContent = "Không thể kết nối đến máy chủ!";
      loginErrorMsg.classList.remove('hidden');
    }
  });

  // Đăng xuất
  btnLogout.addEventListener('click', () => {
    adminToken = '';
    localStorage.removeItem('admin_token');
    showLogin();
  });

  // Tìm kiếm thành viên
  document.getElementById('search-input').addEventListener('input', (e) => {
    renderWishes(e.target.value);
  });

  // Xử lý Form Thêm / Cập nhật lời chúc
  const wishForm = document.getElementById('wish-form');
  wishForm.addEventListener('submit', async (e) => {
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

    try {
      let res;
      if (editId) {
        // Cập nhật (PUT)
        res = await fetch(`/api/wishes/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ name, title, wish, keywords })
        });
      } else {
        // Thêm mới (POST)
        res = await fetch('/api/wishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ name, title, wish, keywords })
        });
      }

      const result = await res.json();
      if (result.success) {
        await loadWishes();
        resetFormEdit();
        alert(editId ? `Đã cập nhật lời chúc cho "${name}" thành công!` : `Đã thêm thành công lời chúc cho "${name}"!`);
      } else {
        alert(result.message || "Có lỗi xảy ra!");
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ!");
    }
  });

  // Nút Hủy chế độ sửa
  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    resetFormEdit();
  });
});

// Kiểm tra token
async function verifySession() {
  if (!adminToken) {
    showLogin();
    return;
  }
  try {
    const res = await fetch('/api/auth/check', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (data.authenticated) {
      showDashboard();
    } else {
      adminToken = '';
      localStorage.removeItem('admin_token');
      showLogin();
    }
  } catch (e) {
    showLogin();
  }
}

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

// Tải danh sách từ server
async function loadWishes() {
  try {
    const res = await fetch('/api/wishes');
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      wishesList = result.data;
      renderWishes();
    }
  } catch (e) {
    console.error("Lỗi tải danh sách:", e);
  }
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
      <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
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
  document.getElementById('btn-submit-form').textContent = `Lưu Lời Chúc Lên Hệ Thống`;
  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

// Xóa lời chúc
window.deleteWish = async function(id) {
  const item = wishesList.find(w => w.id === id);
  if (!item) return;

  if (confirm(`Bạn có chắc muốn xóa lời chúc dành cho "${item.name}"?`)) {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        await loadWishes();
        resetFormEdit();
      } else {
        alert(data.message || "Không thể xóa!");
      }
    } catch (e) {
      alert("Lỗi kết nối khi xóa!");
    }
  }
};

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

// Đảm bảo thư mục data tồn tại
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Khởi tạo file admin nếu chưa có
function getAdminData() {
  if (!fs.existsSync(ADMIN_FILE)) {
    const defaultAdmin = {
      username: 'admin',
      passwordHash: hashPassword('admin123')
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2), 'utf-8');
    return defaultAdmin;
  }
  return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf-8'));
}

// Khởi tạo file wishes nếu chưa có
function getWishesData() {
  if (!fs.existsSync(WISHES_FILE)) {
    fs.writeFileSync(WISHES_FILE, '[]', 'utf-8');
    return [];
  }
  return JSON.parse(fs.readFileSync(WISHES_FILE, 'utf-8'));
}

function saveWishesData(wishes) {
  fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Quản lý session tokens trong bộ nhớ
const activeSessions = new Map();

function createSession(username) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
  activeSessions.set(token, { username, expiresAt });
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// Helper parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper gửi JSON
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  const [urlPath] = req.url.split('?');
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';

  // ===== API ROUTES =====

  // 1. Đăng nhập Admin
  if (urlPath === '/api/auth/login' && req.method === 'POST') {
    try {
      const { username, password } = await parseBody(req);
      const admin = getAdminData();

      if (username === admin.username && hashPassword(password) === admin.passwordHash) {
        const sessionToken = createSession(username);
        return sendJSON(res, 200, {
          success: true,
          token: sessionToken,
          username: admin.username,
          message: 'Đăng nhập thành công!'
        });
      } else {
        return sendJSON(res, 401, { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' });
      }
    } catch (err) {
      return sendJSON(res, 400, { success: false, message: 'Dữ liệu không hợp lệ!' });
    }
  }

  // 2. Kiểm tra token đăng nhập
  if (urlPath === '/api/auth/check' && req.method === 'GET') {
    return sendJSON(res, 200, { authenticated: isValidToken(token) });
  }

  // 3. Lấy danh sách lời chúc (PUBLIC - Dành cho người nhận tải danh sách để hiển thị thiệp)
  if (urlPath === '/api/wishes' && req.method === 'GET') {
    const wishes = getWishesData();
    return sendJSON(res, 200, { success: true, data: wishes });
  }

  // 4. Thêm lời chúc mới (YÊU CẦU ADMIN)
  if (urlPath === '/api/wishes' && req.method === 'POST') {
    if (!isValidToken(token)) {
      return sendJSON(res, 401, { success: false, message: 'Chỉ Admin mới có quyền thêm lời chúc!' });
    }
    try {
      const { name, title, wish, keywords } = await parseBody(req);
      if (!name || !wish) {
        return sendJSON(res, 400, { success: false, message: 'Tên và lời chúc là bắt buộc!' });
      }
      const wishes = getWishesData();
      
      const newWish = {
        id: Date.now().toString(),
        name: name.trim(),
        title: (title || 'Quý Ông Đích Thực').trim(),
        wish: wish.trim(),
        keywords: Array.isArray(keywords) && keywords.length > 0 ? keywords : [name.trim().toLowerCase()],
        updatedAt: new Date().toISOString()
      };

      wishes.unshift(newWish);
      saveWishesData(wishes);
      return sendJSON(res, 201, { success: true, data: newWish, message: 'Đã thêm lời chúc thành công!' });
    } catch (err) {
      return sendJSON(res, 400, { success: false, message: 'Lỗi thêm lời chúc!' });
    }
  }

  // 5. Cập nhật lời chúc của thành viên (YÊU CẦU ADMIN)
  if (urlPath.startsWith('/api/wishes/') && req.method === 'PUT') {
    if (!isValidToken(token)) {
      return sendJSON(res, 401, { success: false, message: 'Chỉ Admin mới có quyền sửa lời chúc!' });
    }
    try {
      const id = urlPath.replace('/api/wishes/', '').trim();
      const { name, title, wish, keywords } = await parseBody(req);
      const wishes = getWishesData();
      const index = wishes.findIndex(item => item.id === id);

      if (index === -1) {
        return sendJSON(res, 404, { success: false, message: 'Không tìm thấy người nhận này!' });
      }

      wishes[index] = {
        ...wishes[index],
        name: name ? name.trim() : wishes[index].name,
        title: title !== undefined ? title.trim() : wishes[index].title,
        wish: wish ? wish.trim() : wishes[index].wish,
        keywords: Array.isArray(keywords) ? keywords : wishes[index].keywords,
        updatedAt: new Date().toISOString()
      };

      saveWishesData(wishes);
      return sendJSON(res, 200, { success: true, data: wishes[index], message: 'Đã cập nhật lời chúc!' });
    } catch (err) {
      return sendJSON(res, 400, { success: false, message: 'Lỗi cập nhật lời chúc!' });
    }
  }

  // 6. Xóa lời chúc (YÊU CẦU ADMIN)
  if (urlPath.startsWith('/api/wishes/') && req.method === 'DELETE') {
    if (!isValidToken(token)) {
      return sendJSON(res, 401, { success: false, message: 'Chỉ Admin mới có quyền xóa!' });
    }
    const id = urlPath.replace('/api/wishes/', '').trim();
    let wishes = getWishesData();
    const initialLen = wishes.length;
    wishes = wishes.filter(item => item.id !== id);

    if (wishes.length === initialLen) {
      return sendJSON(res, 404, { success: false, message: 'Không tìm thấy mục cần xóa!' });
    }

    saveWishesData(wishes);
    return sendJSON(res, 200, { success: true, message: 'Đã xóa lời chúc thành công!' });
  }

  // ===== ĐƯỜNG DẪN TRANG WEB =====

  // Đường dẫn bí mật cho Admin: /itedit hoặc /admin
  if (urlPath === '/itedit' || urlPath === '/itedit/' || urlPath === '/admin' || urlPath === '/admin/') {
    const adminFilePath = path.join(__dirname, 'admin.html');
    return fs.readFile(adminFilePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Lỗi nạp trang admin');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
  }

  // Đường dẫn thông thường cho Người nhận: /
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Web thiệp người nhận (Link chung gửi mọi người): http://localhost:${PORT}`);
  console.log(`Đường dẫn riêng cho Admin: http://localhost:${PORT}/itedit`);
  console.log(`Tài khoản Admin: username = admin, password = admin123`);
});

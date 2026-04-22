const API_BASE = '/api';

// Get auth token from localStorage
function getToken() {
  return localStorage.getItem('adminToken');
}

// Generic fetch wrapper with auth
async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Token expired or invalid
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoginTime');
    window.location.reload();
    throw new Error('会话已过期，请重新登录');
  }

  return response;
}

// Admin API
export const adminApi = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '登录失败');
    }
    return data;
  },

  logout: async () => {
    try {
      await authenticatedFetch(`${API_BASE}/admin/logout`, { method: 'POST' });
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminLoginTime');
    }
  },

  getMe: async () => {
    const response = await authenticatedFetch(`${API_BASE}/admin/me`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取会话失败');
    }
    return data;
  },
};

// Rent Accounts API
export const rentAccountApi = {
  // Public - get all active rent accounts
  getAll: async () => {
    const response = await fetch(`${API_BASE}/rent-accounts`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取账号列表失败');
    }
    return data;
  },

  // Admin - get all rent accounts (including inactive)
  getAllAdmin: async () => {
    const response = await authenticatedFetch(`${API_BASE}/rent-accounts/all`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取账号列表失败');
    }
    return data;
  },

  // Public - get single rent account
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/rent-accounts/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取账号详情失败');
    }
    return data;
  },

  // Admin - create rent account
  create: async (account) => {
    const response = await authenticatedFetch(`${API_BASE}/rent-accounts`, {
      method: 'POST',
      body: JSON.stringify(account),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '创建账号失败');
    }
    return data;
  },

  // Admin - update rent account
  update: async (id, account) => {
    const response = await authenticatedFetch(`${API_BASE}/rent-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '更新账号失败');
    }
    return data;
  },

  // Admin - delete rent account
  delete: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/rent-accounts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '删除账号失败');
    }
    return true;
  },
};

// Sell Accounts API
export const sellAccountApi = {
  // Admin - get all sell accounts
  getAll: async () => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取账号列表失败');
    }
    return data;
  },

  // Admin - get single sell account
  getById: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '获取账号详情失败');
    }
    return data;
  },

  // Public - submit new sell account
  create: async (account) => {
    const response = await fetch(`${API_BASE}/sell-accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '提交账号失败');
    }
    return data;
  },

  // Admin - approve sell account
  approve: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}/approve`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '审核失败');
    }
    return data;
  },

  // Admin - reject sell account
  reject: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}/reject`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '审核失败');
    }
    return data;
  },

  // Admin - complete sell account
  complete: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}/complete`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '操作失败');
    }
    return data;
  },

  // Admin - update sell account
  update: async (id, account) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(account),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || '更新账号失败');
    }
    return data;
  },

  // Admin - delete sell account
  delete: async (id) => {
    const response = await authenticatedFetch(`${API_BASE}/sell-accounts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '删除账号失败');
    }
    return true;
  },
};

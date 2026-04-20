# 三角洲租号平台 - 部署指南

## 一、后台安全设置

### 1. 修改后台路径

编辑 `src/config/admin.ts`：

```typescript
export const ADMIN_CONFIG = {
  // 修改这个路径，让后台更难被发现
  ADMIN_PATH: '/your-secret-path', // 例如: '/x7k9m2p4'
  
  // 修改管理员密码
  CREDENTIALS: {
    username: 'admin',
    password: 'Your-Strong-Password-123!@#',
  },
  
  // 修改JWT密钥（随机字符串）
  JWT: {
    SECRET: 'your-random-secret-key-' + Math.random().toString(36).substring(2),
    EXPIRES: 24, // 登录有效期（小时）
  },
};
```

### 2. 安全配置建议

| 配置项 | 建议值 | 说明 |
|--------|--------|------|
| ADMIN_PATH | 随机字符串 | 避免使用 /admin、/manage 等常见路径 |
| 密码 | 12位以上 | 包含大小写字母、数字、特殊符号 |
| JWT密钥 | 32位随机字符串 | 定期更换 |
| 登录有效期 | 2-24小时 | 根据安全需求调整 |

---

## 二、香港服务器部署步骤

### 1. 服务器环境准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2（进程管理）
sudo npm install -g pm2
```

### 2. 上传项目文件

```bash
# 在本地构建项目
npm run build

# 将 dist 文件夹上传到服务器
# 使用 scp 或 rsync
scp -r dist/* root@your-server-ip:/var/www/delta-rent/
```

### 3. Nginx 配置

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/delta-rent
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为你的域名
    
    root /var/www/delta-rent;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/delta-rent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL 证书配置（HTTPS）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 5. 防火墙设置

```bash
# 允许 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许 SSH（如果需要通过特定端口）
sudo ufw allow 22/tcp

# 启用防火墙
sudo ufw enable
```

---

## 三、额外安全措施

### 1. 修改 SSH 端口（可选）

```bash
sudo nano /etc/ssh/sshd_config
# 修改 Port 22 为其他端口，如 2222

sudo systemctl restart sshd
```

### 2. 配置 Fail2Ban（防止暴力破解）

```bash
sudo apt install -y fail2ban

sudo nano /etc/fail2ban/jail.local
```

添加：

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. 定期备份

创建备份脚本：

```bash
sudo nano /usr/local/bin/backup-delta-rent.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/delta-rent"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/delta-rent_$DATE.tar.gz /var/www/delta-rent

# 保留最近 7 天的备份
find $BACKUP_DIR -name "delta-rent_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-delta-rent.sh

# 添加定时任务（每天凌晨 3 点备份）
crontab -e
0 3 * * * /usr/local/bin/backup-delta-rent.sh
```

---

## 四、后台访问地址

部署完成后，后台访问地址为：

```
https://your-domain.com/your-secret-path/login
```

**注意**：请将 `your-secret-path` 替换为你在配置中设置的路径。

---

## 五、常见问题

### 1. 刷新页面 404

确保 Nginx 配置中有：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. 静态资源加载失败

检查文件权限：

```bash
sudo chown -R www-data:www-data /var/www/delta-rent
sudo chmod -R 755 /var/www/delta-rent
```

### 3. 后台登录失败

清除浏览器缓存，或使用无痕模式测试。

---

## 六、更新部署

```bash
# 1. 本地重新构建
npm run build

# 2. 上传到服务器
scp -r dist/* root@your-server-ip:/var/www/delta-rent/

# 3. 重启 Nginx（可选）
sudo systemctl restart nginx
```

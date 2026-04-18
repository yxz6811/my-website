# 我的网站（yangxizhe.com）

杨曦哲的个人站点源码仓库：基于 Next.js 16 + TypeScript + Tailwind CSS。

## 你需要准备的内容（你来写）

所有展示文案集中在 **`src/content/site-profile.ts`**，改完保存即可在本地 `npm run dev` 预览。

建议按下面清单写（可中英文任选，保持一致即可）：

| 区块 | 写什么 |
|------|--------|
| **eyebrow** | 顶部小字：域名、一句 tagline |
| **headlineLead / headlineAccent** | 名字 + 一句话定位（例如「全栈 / 设计 + 前端」） |
| **intro** | 1～3 句：你是谁、在做什么、访客能在这里看到什么 |
| **tags** | 3～8 个技能或关键词 |
| **primaryLinks** | GitHub、邮箱（`mailto:`）、作品集、简历 PDF 等 |
| **experience** | 按**时间倒序**：每段写 `period`、`role`、`org`、若干 `bullets`（动词开头 + 技术 + 结果） |

站点标题与描述（浏览器标签、SEO）在 **`src/app/layout.tsx`** 的 `metadata` 里，可与主页文案保持一致。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。

## 生产构建

```bash
npm run build
npm run start
```

项目启用了 `output: "standalone"`，适合部署到 VPS。

## 推送到 GitHub（首次）

在 GitHub 新建空仓库（不要勾选添加 README），然后在**你电脑上的项目目录**执行（把 URL 换成你的）：

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git add .
git commit -m "Initial personal site"
git push -u origin main
```

## 香港服务器部署（Ubuntu 22.04/24.04）

以下在 **VPS 的 SSH 终端**里执行。会安装 Node、Nginx、PM2、Certbot；请把 `GIT_REPO_URL` 换成你的仓库 HTTPS 或 SSH 地址。

**安全说明**：`curl | sudo bash` 会执行 NodeSource 的安装脚本；若你介意，可改用 [nvm](https://github.com/nvm-sh/nvm) 自行装 Node，再跳过前两行中的 NodeSource 部分。

```bash
export GIT_REPO_URL="https://github.com/yxz6811/my-website.git"

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg nginx git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

sudo mkdir -p /var/www
sudo rm -rf /var/www/yangxizhe.com
sudo git clone "$GIT_REPO_URL" /var/www/yangxizhe.com
cd /var/www/yangxizhe.com
sudo chown -R "$USER:$USER" /var/www/yangxizhe.com
npm install
npm run build

pm2 delete yangxizhe-site 2>/dev/null || true
pm2 start npm --name yangxizhe-site -- start
pm2 save
pm2 startup systemd -u "$USER" --hp "$HOME"

sudo tee /etc/nginx/sites-available/yangxizhe.com >/dev/null <<'NGINX'
server {
    listen 80;
    server_name yangxizhe.com www.yangxizhe.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/yangxizhe.com /etc/nginx/sites-enabled/yangxizhe.com
sudo nginx -t && sudo systemctl reload nginx

sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yangxizhe.com -d www.yangxizhe.com
```

按提示同意条款并填写邮箱（用于证书到期提醒）。若域名尚未解析到本机，请先完成 Dynadot DNS 再执行 Certbot。

### 防火墙（若启用了 ufw）

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 以后更新网站

在 VPS 上：

```bash
cd /var/www/yangxizhe.com
git pull
npm install
npm run build
pm2 restart yangxizhe-site
```

## Dynadot DNS 配置

在 Dynadot 的 DNS 管理里添加：

- `A` 记录：`@` -> `193.134.211.194`
- `CNAME` 记录：`www` -> `yangxizhe.com`

如果你用了 Cloudflare 管理 DNS，则在 Cloudflare 里添加同样记录即可。

## 常用运维命令

```bash
pm2 status
pm2 logs yangxizhe-site
pm2 restart yangxizhe-site
```

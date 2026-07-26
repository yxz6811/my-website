上线服务器：
ssh -p 41326 root@193.134.211.194
cd /var/www/yangxizhe.com && git pull --ff-only origin main && npm ci && npm run build && pm2 restart yangxizhe-site
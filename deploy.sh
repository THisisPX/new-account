#!/bin/bash
set -e

cd /opt/delta-rent

echo "1. 拉取最新代码..."
git pull origin main

echo "2. 重启后端 PM2..."
cd server
pm2 restart delta-rent-api || pm2 start index.js --name delta-rent-api
pm2 save
cd ..

echo "3. 重载 Nginx..."
nginx -t && nginx -s reload

echo "部署完成!"

server {
    listen 80;
    server_name api.zgarma.ru;

    location / {
        proxy_pass http://localhost:3000; # Проксируем на твой сервер
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Редиректим HTTP на HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.zgarma.ru;

    ssl_certificate /etc/letsencrypt/live/api.zgarma.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.zgarma.ru/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /eventImages/ {
        alias /root/app/files/eventImages/;
        autoindex on;
        allow all;
    }
}
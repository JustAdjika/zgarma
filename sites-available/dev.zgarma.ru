server {
    listen 80;
    server_name dev.zgarma.ru;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name dev.zgarma.ru;

    ssl_certificate /etc/letsencrypt/live/dev.zgarma.ru-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.zgarma.ru-0001/privkey.pem;

    allow 147.30.205.107;  # Разрешённый IP (замени на свой)
    deny all;               # Запрещаем всем остальным

    location / {
        proxy_pass http://127.0.0.1:5173;
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
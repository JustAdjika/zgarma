import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Разрешает доступ по домену
    allowedHosts: ['dev.zgarma.ru'], // Добавляем поддомен в список разрешённых
  }
});
import { Sequelize } from 'sequelize'

//                                 БД          Логин            Пароль
const sequelize = new Sequelize('zgarma', 'zgarma_admin', 'm]_z/be4qDuw/3aO', {
  host: 'localhost', // Имя хоста
  dialect: 'mysql', // Диалект
  logging: false, // отключаем логирование запросов в консоль
  port: 3325, // Порт БД
});

export default sequelize;

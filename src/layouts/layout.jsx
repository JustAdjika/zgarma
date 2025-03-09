import React from "react";
import "./Style/layout.css"; // Подключаем стили

const Layouts = () => {
    return (
        <header className="main-header">
            {/* Название проекта в левом углу */}
            <div className="project-title">ZG | ARMA 3</div>

            {/* Навигационное меню */}
            <nav className="nav-menu">
                <ul className="nav-list">
                    <li className="nav-item">
                        <span>ГЛАВНАЯ</span>
                        <ul className="dropdown">
                            <li>Правила</li>
                            <li>Патч-ноуты</li>
                            <li>Медиа</li>
                            <li>Объявления</li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <span>ОТРЯДЫ</span>
                        <ul className="dropdown">
                            <li>Список кланов</li>
                            <li>Меню клана</li>
                            <li>Меню коалиций</li>
                        </ul>
                    </li>
                    <li className="nav-item">СПИСОК ИГР</li>
                    <li className="nav-item">FAQ</li>
                </ul>
            </nav>

            {/* Блок с аватаркой пользователя */}
            <div className="user-info">
                <div className="user-avatar">
                    {/* <img src="/path-to-user-avatar.jpg" alt="User Avatar" /> */}
                </div>
            </div>
        </header>
    );
};

export default Layouts;

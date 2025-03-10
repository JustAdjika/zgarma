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
                <div className="nick-name-user">JustTajika</div>
                <div className="user-avatar">
                    {/* <img src="/path-to-user-avatar.jpg" alt="User Avatar" /> */}
                </div>
                <ul className="user-dropdown">
                    <li>Discord</li>
                    <li><div className="decoration-container-dropdown"></div></li>
                    <li><div className="user-pod-info">
                        <div className="info-container">
                            <div className="nick-name-user">justtajika</div>
                            <div className="user-id-menu">342134215312532</div>
                        </div>
                        <div className="user-avatar-menu">
                            {/* <img src="/path-to-user-avatar.jpg" alt="User Avatar" /> */}
                        </div>
                    </div></li>
                    <li>Вступите в наш <span className="linked">Discord сервер</span></li>
                    <li>Steam</li>
                    <li><div className="decoration-container-dropdown"></div></li>
                    <li>*Авторизируйте свой <span className="linked">Steam аккаунт</span></li>
                </ul>
            </div>
        </header>
    );
};

export default Layouts;

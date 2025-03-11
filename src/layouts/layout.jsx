import React from "react";
import "./Style/layout.css"; // Подключаем стили

import triangle from '../assets/navTriangle.svg'
// import bell from '../assets/bell.svg'

const Layouts = () => {
    return (
        <header className="main-header">
            {/* Название проекта в левом углу */}
            <div style={{ display: 'flex' }}>
            <div className="project-title" style={{ marginRight: '130px' }}>ZG <div style={{ width: '6px', height: '40px', borderRadius: '5px', backgroundColor: 'black' }} /> ARMA 3</div>

                {/* Навигационное меню */}
                <nav className="nav-menu" style={{ display: 'flex', alignItems: 'center' }}>
                    <ul className="nav-list" style={{ display: 'flex', alignItems: 'center' }}>
                        <li className="nav-item">
                            <a href="/announcement" style={{ textDecoration: 'none', color: '#D9D9D9' }}>ГЛАВНАЯ</a>
                            {/* <img style={{ marginLeft: '10px' }} src={triangle} height={20} width={20} alt="" /> */}
                            <ul className="dropdown">
                                <li>Правила</li>
                                <li>Патч-ноуты</li>
                                {/* <li>Медиа</li>
                                <li>Объявления</li> */}
                            </ul>
                        </li>
                        {/* <li className="nav-item" alt='Скоро'>
                            <span>ОТРЯДЫ</span>
                            <img style={{ marginLeft: '10px' }} src={triangle} height={20} width={20} alt="" />
                            <ul className="dropdown">
                                <li>Список кланов</li>
                                <li>Меню клана</li>
                                <li>Меню коалиций</li>
                            </ul>
                        </li> */}
                        <a href="/rules" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">Правила</a>
                        <a href="/patches" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">Патч ноуты</a>
                        <a href="/events" style={{ textDecoration: 'none', color: '#D9D9D9' }} className="nav-item">СПИСОК ИГР</a>
                        {/* <li className="nav-item">FAQ</li> */}
                    </ul>
                </nav>
            </div>

            {/* Блок с аватаркой пользователя */}
            <div className="user-info">
                <svg style={{ marginTop: '10px', marginRight: '30px', cursor: 'pointer' }} class="icon" width="40" height="40" viewBox="0 0 24 24">
                    <path style={{transition: '0.2s'}} d="M8.04492 0C7.40917 0 6.89555 0.530664 6.89555 1.1875V1.9C4.27354 2.44922 2.29806 4.84648 2.29806 7.71875V8.41641C2.29806 10.1605 1.67668 11.8453 0.55604 13.1516L0.290247 13.4596C-0.0114629 13.8084 -0.0832987 14.3094 0.0998826 14.7361C0.283064 15.1629 0.69612 15.4375 1.14869 15.4375H14.9412C15.3937 15.4375 15.8032 15.1629 15.99 14.7361C16.1767 14.3094 16.1013 13.8084 15.7996 13.4596L15.5338 13.1516C14.4132 11.8453 13.7918 10.1643 13.7918 8.41641V7.71875C13.7918 4.84648 11.8163 2.44922 9.19429 1.9V1.1875C9.19429 0.530664 8.68067 0 8.04492 0ZM9.672 18.3061C10.103 17.8607 10.3437 17.2559 10.3437 16.625H8.04492H5.74618C5.74618 17.2559 5.98683 17.8607 6.41784 18.3061C6.84885 18.7514 7.43432 19 8.04492 19C8.65553 19 9.24099 18.7514 9.672 18.3061Z" fill="#28272E"/>
                </svg>
                <div className="nick-name-user" style={{cursor: 'pointer'}}>JustTajika</div>
                <div className="user-avatar" style={{ cursor: 'pointer', backgroundColor: '#28272E' }}>
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

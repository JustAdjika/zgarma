import React, { useState } from "react";
import './Style/PTCHbugList.css';
import upIcon from '../assets/up.svg';
import downIcon from '../assets/down.svg';

const PTCHbug = () => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    // Функция для вывода окошка подробнее
    const toggleDetails = () => {
        setIsDetailsVisible(prevState => !prevState);
    };

    // Функция для вывода нужного SVG 
    const toggleInfo = () => {
        setIsDetailsVisible((prev) => !prev );
    };

    return (
        <div className="main-container-bug">
            <div className="title-bug">Баг при регистрации</div>
            <div className="bug-status">Не решён</div>
            <div className="container-info-bug">
            <div className="bug-information" onClick={toggleDetails}>
                    <img 
                        src={isDetailsVisible ? upIcon : downIcon} 
                        alt="toggle icon"
                        className="icon-PTCH"
                    />
                    Подробности
                </div>
                <div className="bug-time">04.03.25</div>
            </div>
            {isDetailsVisible && (
                <div className="bug-details">
                     Ошибка возникает при вводе длинного пароля. 
                     Поле ввода не обрабатывает длину, и страница зависает.
                </div>
            )}
        </div>
    );
};

export default PTCHbug;
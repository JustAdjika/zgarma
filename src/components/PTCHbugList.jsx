import React, { useState } from "react";
import './Style/PTCHbugList.css';

const PTCHbug = () => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    // Функция для вывода окошка подробнее
    const toggleDetails = () => {
        setIsDetailsVisible(prevState => !prevState);
    };

    return (
        <div className="main-container-bug">
            <div className="title-bug">Баг при регистрации</div>
            <div className="bug-status">Не решён</div>
            <div className="container-info-bug">
                <div className="bug-information" onClick={toggleDetails}>Подробности</div>
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
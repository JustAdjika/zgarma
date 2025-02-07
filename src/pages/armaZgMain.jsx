import React from "react";
import './Style/armaZgMain.css';

function ArmaZgMain() {
    return (
        <div className="main-div">
            <div className="left-side">
                <div className="field-for-text-left">
                    <p className="text-left-side">ARMA ZG</p>
                </div>
            </div>
            <div className="right-side">
                <div className="field-for-text-right">
                        <div className="text-1">Игровой проект ZG по Arma 3</div>
                        <div className="text-2">Добро пожаловать на проект zg arma! У нас вы найдете захватывающие миссии, уникальные сценарии и дружелюбное сообщество. Поддерживаем PvP и кооперативные режимы, реалистичную боевую атмосферу и кастомные моды. </div>
                        <div className="text-3">Для игры требуется</div>
                        <div className="text-4">Arma 3 Teamspeak RADMIN VPN Сборка модов Состоять на сервере ZG Discord </div>
                        <div className="field-for-icons"></div>
                        <button className="but-to-main">На главную</button>
                </div>
            </div>
        </div>
    );
}

export default ArmaZgMain;
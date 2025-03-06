import React, { useState } from "react";
import './Style/PTCHbugList.css';
import upIcon from '../assets/up.svg';
import downIcon from '../assets/down.svg';

const PTCHbug = ({ date, description, detailedDescription }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isStatusBug, setIsStatusBug] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Не отмечен");

    // Функция для изменения видимости меню статусов
    const toggleStatus = () => {
        setIsStatusBug(prevState => !prevState);
    };

    // Функция для отображения подробностей
    const toggleDetails = () => {
        setIsDetailsVisible(prevState => !prevState);
    };

    // Правильные цвета к каждому статусу
    const [color, setColor] = useState("#9B59B6");
    // const statusStyles = {
    //     "Исправляется": "status status-1",
    //     "Не обнаружен": "status status-2",
    //     "Не решён": "status status-3",
    //     "Решён": "status status-4"
    // };

    // Функция для выбора конкретного статуса бага
    const handleStatusChange = (status) => {
        setSelectedStatus(status); // Устанавливаем новый статус
        switch (status) {
            case "Исправляется": setColor("#0B94E0"); break;
            case "Не обнаружен": setColor("#2ECC71"); break;
            case "Не решён": setColor("#C0392B"); break;
            case "Решён": setColor("#2ECC71"); break;
        }
        setIsStatusBug(false); // Закрываем список статусов
    };

    return (
        <div className="main-container-bug">
            <div className="title-bug">{description}</div>
            
            {/* Отображаем выбранный статус */}
            <div className="bug-status" onClick={toggleStatus} style={{ color : color }}>
                {selectedStatus}
            </div>

            {/* Выпадающий список статусов */}
            {isStatusBug && (
                <div className="status-container">
                    <div id="status-1" className="statuss-1" onClick={() => handleStatusChange("Исправляется")}>Исправляется</div>
                    <div id="status-2" className="statuss-2" onClick={() => handleStatusChange("Не обнаружен")}>Не обнаружен</div>
                    <div id="status-3" className="statuss-3" onClick={() => handleStatusChange("Не решён")}>Не решён</div>
                    <div id="status-4" className="statuss-4" onClick={() => handleStatusChange("Решён")}>Решён</div>
                </div>
            )}

            <div className="container-info-bug">
                <div className="bug-information" onClick={toggleDetails}>
                    <img 
                        src={isDetailsVisible ? upIcon : downIcon} 
                        alt="toggle icon"
                        className="icon-PTCH"
                    />
                    Подробности
                </div>
                <div className="bug-time">{date}</div>
            </div>

            {isDetailsVisible && (
                <div className="bug-details">{detailedDescription}</div>
            )}
        </div>
    );
};

export default PTCHbug;

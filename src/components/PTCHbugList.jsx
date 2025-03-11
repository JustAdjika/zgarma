import React, { useEffect, useState } from "react";
import './Style/PTCHbugList.css';
import upIcon from '../assets/up.svg';
import downIcon from '../assets/down.svg';
import axios from "axios";

const PTCHbug = ({ date, description, detailedDescription, currentUser,id, host, defaultStatus }) => {
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isStatusBug, setIsStatusBug] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("Не отмечен");

    useEffect(() => {
        switch (defaultStatus) {
            case "CHECKED": setSelectedStatus("Исправляется"); break;
            case "NOT FOUND": setSelectedStatus("Не обнаружен"); break;
            case "FAIL": setSelectedStatus("Не решён"); break;
            case "COMPLETE": setSelectedStatus("Решён"); break;
            case "NOT CHECKED" : setSelectedStatus("Не отмечен"); break;
        }
        console.log(defaultStatus);
    },[defaultStatus]);

    useEffect(() => {
        switch (selectedStatus) {
            case "Исправляется": setColor("#0B94E0"); break;
            case "Не обнаружен": setColor("#2ECC71"); break;
            case "Не решён": setColor("#C0392B"); break;
            case "Решён": setColor("#2ECC71"); break;
        }
    }, [selectedStatus])

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
        updateStatusOnServer(status);
    };


//=======================================================================================================================================
//=======================================================================================================================================
//Бэк get запросы


    // Функция обновления статуса на сервере
    const updateStatusOnServer = async (status) => {
        try {
            let serverStatus
            switch (status) {
                case "Исправляется": serverStatus = "CHECKED"; break;
                case "Не обнаружен": serverStatus = "NOT FOUND"; break;
                case "Не решён": serverStatus = "FAIL"; break;
                case "Решён": serverStatus = "COMPLETE"; break;
            }
            const response = await axios.patch(`${host}/api/developer/bugfix/tickets/status/set`, {
                ticketId: id,
                status: serverStatus,
                key:  currentUser.key
            });

            console.log("Статус обновлён:", response.data);
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    return (
        <div className="main-container-bug">
            <div className="title-bug">{description}</div>
            
            {/* Отображаем выбранный статус */}
            <div className="bug-status" onClick={toggleStatus} style={{ color : color, userSelect: 'none', width: '130px' }}>
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
                        src={upIcon} 
                        alt="toggle icon"
                        className="icon-PTCH"
                        style={{ rotate: isDetailsVisible ? '0deg' : '180deg', transition: '0.3s', userSelect: 'none' }}
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
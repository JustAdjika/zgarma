import React, { useState } from "react";
import AnnVote from "../components/ANNvote.jsx";
import ANNadminMSG from '../components/ANNadminMSG.jsx';
import './Style/annoucement.css';

function Annoucement() {
    // Создание Объявления
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);

    // Создание Голосования
    const [optionVote, setOptionVote] = useState([]);

    // Состояние для ошибки
    const [errorMessage, setErrorMessage] = useState("");

    // Функция для Объявления
    const handleAddOption = () => {
        if (option.trim()) {
            setOptions([...options, { id: Date.now(), value: option }]);
            setOption(""); 
        } else {
            // Показываем ошибку, если вариант пустой
            setErrorMessage("Вариант не может быть пустым.");
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    // Функция для добавления варианта голосования
    const handleAddOptionVote = () => {
        if (options.length >= 4) {
            // Если вариантов больше 4, показываем ошибку
            setErrorMessage("Максимум можно добавить 4 варианта!");
            setTimeout(() => setErrorMessage(""), 5000);
        } else {
            setOptions([...options, { id: Date.now(), value: "" }]);
        }
    };

    // Функция для обновления значения варианта
    const handleInputChange = (id, value) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, value } : option
        ));
    };

    // Функция для удаления варианта
    const handleRemoveOption = (id) => {
        setOptions(options.filter(option => option.id !== id));
    };

    // Функция для отправки объявления и голосования
    const handleSubmit = () => {
        if (options.length > 0) {
            for (let option of options) {
                if (!option.value.trim()) {
                    setErrorMessage("Заполните вариант перед отправкой");
                    setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
                    return;  // Прерываем выполнение функции
                }
            }
            // Создание голосования
            const newVote = {
                title,
                message,
                options: options.map(option => option.value), // Только значения
            };
            setOptionVote([...optionVote, newVote]);
            // Очистить форму
            setTitle("");
            setMessage("");
            setOptions([]);
        } else {
            // Создание объявления
            if (title.trim() && message.trim()) {
                const newAnnouncement = {
                    title,
                    message,
                    options: [],
                };
                setAnnouncements([...announcements, newAnnouncement]);
                // Очистить форму
                setTitle("");
                setMessage("");
                setOptions([]);
            } else {
                // Устанавливаем ошибку
                setErrorMessage("Пожалуйста, заполните заголовок и текст сообщения для объявления.");
                setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
            }
        }
    };

    return (
        <div className="div-main-annoucement">
            {/* Div с картинкой */}
            <div className="background-banner">
                <div className="title-bunner"> ZG ARMA 3</div>
            </div>
            <div className="container-info">
                {/* Левая часть основного блока страницы */}
                <div className="left-side-info">
                    <div className="title-left-info">ОБЪЯВЛЕНИЯ</div>
                    <div className="decorative-line-left"></div>
                    <input
                        type="text"
                        id="input-Lside-first"
                        placeholder="Введите заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="container-center">
                        <textarea
                            id="input-Lside-second"
                            className="annoucement-textarea"
                            placeholder="Введите текст сообщения"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        {/* Рендринг  */}
                        <div className="container-options">
                            {options.map((option) => (
                                <div key={option.id} style={{ marginBottom: '10px', backgroundColor: '#303030', borderRadius: '10px', display: 'flex', alignItems: 'center',}}>
                                    <input
                                        type="text"
                                        placeholder="Введите вариант"
                                        value={option.value}
                                        onChange={(e) => handleInputChange(option.id, e.target.value)}
                                        style={{ backgroundColor: '#303030', padding: '0px' , paddingLeft: '10px' , color: 'white', border: 'none', width: '240px', height: '42.5px', outline: 'none',borderRadius: '7px'}}
                                    />
                                    {/* Кнопка для удаления варианта */}
                                    <button id="delete-but-vote" onClick={() => handleRemoveOption(option.id)}>
                                        <div className="delete-div"></div>
                                    </button>
                                </div>
                            ))}
                        {/* Кнопка для добавления вариантов */}
                        <button id="add-var-ANN" onClick={handleAddOptionVote} style={{ display: options.length == 4 ? "none" : "flex" }}>
                            <svg width="15" style={{ marginTop: '5px', marginLeft: '42px' }} height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6.49997" width="2" height="15" rx="1" fill="#D9D9D9"/>
                            <rect y="8.5" width="2" height="15" rx="1" transform="rotate(-90 0 8.5)" fill="#D9D9D9"/>
                            </svg> <span style={{ marginLeft: '10px', color: '#d9d9d9', fontFamily: 'My Open Sans' }}>Добавить вариант</span>
                        </button>
                        </div>
                    </div>
                    <button id="send-but-ann" onClick={handleSubmit}>Отправить</button>
                    {/* Сообщения админа */}
                    <div className="container-message-admin">
                        {announcements.map((announcement, index) => (
                            <ANNadminMSG
                                key={index}
                                title={announcement.title}
                                message={announcement.message}
                                options={announcement.options.join(", ")}
                            />
                        ))}
                    </div>
                </div>
                {/* Правая часть основного блока страницы */}
                <div className="right-side-info">
                    <div className="title-right-info">ГОЛОСОВАНИЯ</div>
                    <div className="decorative-line-right"></div>
                    {/* Div с голосованием */}
                    <div className="container-vote">
                        {/* Рендерим компоненты голосования с данными */}
                        {optionVote.map((vote, index) => (
                            <AnnVote
                                key={index}
                                title={vote.title}
                                message={vote.message}
                                options={vote.options}
                                voteIndex = {index}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Обработка ошибочки */}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export default Annoucement;
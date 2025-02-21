import React, { useEffect, useState } from "react";
import AnnVote from "../components/ANNvote.jsx";
import ANNadminMSG from '../components/ANNadminMSG.jsx';
import axios from "axios";
import './Style/annoucement.css';
import { data } from "react-router-dom";
import Cookies from "js-cookie";

const Announcement = () => {
    // Создание Объявления
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [option, setOption] = useState("");
    const [options, setOptions] = useState([]);

    // Пользователь
    const [currentUser, setCurrentUser] = useState({})
    const [currentUsername, setCurrentUsername] = useState("Не вошел в аккаунт")
    const [currentUserID, setCurrentUserID] = useState(-1)

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
    const handleSubmit = async () => {
        if (options.length > 0) {
            for (let option of options) {
                if (!option.value.trim()) {
                    setErrorMessage("Заполните вариант перед отправкой");
                    setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
                    return;  // Прерываем выполнение функции
                }
            }
        } else {
            // Создание объявления
            if (!title.trim() && !message.trim()) {
                // Устанавливаем ошибку
                setErrorMessage("Пожалуйста, заполните заголовок и текст сообщения для объявления.");
                setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
                return
            }
        }

        const resPost = await axios.post('http://localhost:3000/api/developer/post/add', {
            title: title,
            content: message,
            option1: options?.[0]?.value || null,  
            option2: options?.[1]?.value || null,
            option3: options?.[2]?.value || null,
            option4: options?.[3]?.value || null,
            key: currentUser.key
        });
        if(resPost.data.status !== 200) {
            console.log(resPost.data.err)
            setErrorMessage(resPost.data.err);
            setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
            return;  // Прерываем выполнение функции
        };

        window.location.reload()
    };


//=======================================================================================================================================
//=======================================================================================================================================
//Бэк

//GET запрос на получения инфы из поста
useEffect( () => {
    const GetPosts = async () => {
        const resPosts = await axios.get('http://localhost:3000/api/developer/post/data/all'); //Заносим в respons  
        const posts = resPosts.data.container;

        posts.forEach(e => {
            if(e.option1 === null) {
                setAnnouncements(prev => [...prev, e]); 
            }
            else {
                setOptionVote(prev => [...prev, e]); 
            };
        });
    }
    GetPosts();

    if(Cookies.get("userData")){
        setCurrentUser(JSON.parse(Cookies.get("userData")))
    }
},[]);

useEffect(() => {
    if(currentUser?.discord) {
        setCurrentUsername(currentUser.discord.username)
    }
}, [currentUser])



const CLIENT_ID = "1342587047600328896";
const REDIRECT_URI = "http://localhost:5173/auth/discord/callback";
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;


    return (
        <div className="div-main-annoucement">
            <a href={DISCORD_AUTH_URL}>Register</a>
            <span>DISCORD USERNAME: {currentUsername}</span>
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
                                date={announcement.date}
                                title={announcement.title}
                                content={announcement.content}
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
                                content={vote.content}
                                date={vote.date}
                                options={[vote.option1, vote.option2, vote.option3, vote.option4].filter(Boolean)}
                                voteIndex={vote.id}
                                currentUser={currentUser}
                                votes={vote.votes}
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

export default Announcement;
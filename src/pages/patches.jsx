import React, { useEffect, useState } from "react";
import Layouts from "../layouts/layout";
import './Style/patches.css';

import PTCHadmin from "../components/PTCHadminMSG";
import PTCHbug from "../components/PTCHbugList";
import axios from "axios";
import Cookies from "js-cookie";
    

const PathchesPage = ({isDevBranch}) => {
    const host = "https://api.zgarma.ru"

    const [isModal, setIsModal] = useState(false);


    //Создание объявления
    const [patches, setPatches] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [options, setOptions] = useState([]);

    //создание тикета по багам
    const [bugReports, setBugReports] = useState([]);
    const [description, setDescription] = useState("")
    const [detailedDescription, setDetailedDescription] = useState("");


    // Пользователь
    const [currentUser, setCurrentUser] = useState({})
    const [isAdmin, setIsAdmin] = useState(false)


    // Checkbox модальное окно 
    const [checkboxModal, setCheckboxModal] = useState(false);

    
    // Состояние для ошибки
    const [errorMessage, setErrorMessage] = useState("");


    // Функция для отправки объявления
    const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
        setErrorMessage("Пожалуйста, заполните заголовок и текст сообщения.");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
    }
    

    //POST Запрос на добавление сообщения администратора
    const resFixList = await axios.post(`${host}/api/developer/bugfix/notes/add`, {
        title: title,
        content: message, 
        date: new Date().toISOString(), 
        key: currentUser.key,
        devBranch: isDevBranch
    });
    if(resFixList.data.status !==200) {
        setErrorMessage(resFixList.data.err);
        setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
        return;  // Прерываем выполнение функции
    }

    setPatches(prevPatches => [
        ...prevPatches,
        { id: Date.now(), title, content: message, date: new Date().toLocaleDateString() }
    ]);

    setTitle("");
    setMessage("");

    window.location.reload();
    };


    // Функция для отправки оповещения об ошибки
    const handleModalSend = async () => {
        if(!description.trim() || !detailedDescription.trim()) {
            setErrorMessage("Пожалуйста, заполните заголовок и текст сообщения.");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }

        setBugReports(prevBugs => [
            ...prevBugs,
            { id: Date.now(), description, detailedDescription, date: "06.03.25" }
        ]);
        
        setDetailedDescription("");
        setDescription("");

        

        // POST Запрос на добавление нового тикета
        const resFixTicket = await axios.post(`${host}/api/developer/bugfix/tickets/add`, {
            title: description,
            content: detailedDescription, 
            date: new Date().toISOString(), 
            key: currentUser.key,
            isRepeat: document.getElementById('modal-input').checked,
            devBranch: isDevBranch
        });
        if(resFixTicket.data.status !==200) {
            setErrorMessage(resFixTicket.data.err);
            setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
            return;  // Прерываем выполнение функции
        }

        setPatches(prevPatches => [
            ...prevPatches,
            { id: Date.now(), title, content: message, date: new Date().toLocaleDateString() }
        ]);

        setTitle("");
        setMessage("");

        window.location.reload();
    };
        

    // Функция для открытия модального окошка
    const toggleModal = () => {
        setIsModal(prevState => !prevState);
    }

//=======================================================================================================================================
//=======================================================================================================================================
//Бэк get запросы

    // GET запрос на получение сообщения о изменениях
    useEffect(() => {
        const GetFixList = async () => {
            try {
                const resFixList = await axios.get(`${host}/api/developer/bugfix/notes/data/all`);
                const FixList = resFixList.data.container;
    
                if (!FixList) {
                    console.error("Ошибка: Пустой ответ от сервера");
                    return;
                }
    
                const devFilterList = FixList.filter(e => e.devBranch == isDevBranch)
    
                setPatches(devFilterList); // Обновляем состояние
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };
    
        GetFixList();
        if(!Cookies.get(`userData`)) return;
        setCurrentUser(JSON.parse(Cookies.get('userData')));
    }, []);



    // GET запрос на получение тикета
    useEffect(() => {
        const GetFixTickets = async () => {
            try {
                const resFixTickets = await axios.get(`${host}/api/developer/bugfix/tickets/data/all`);
                const FixTickets = resFixTickets.data.container;

                if (!FixTickets) {
                    console.error("Ошибка: Пустой ответ от сервера");
                    return;
                }

                const devFilterList = FixTickets.filter(e => e.devBranch == isDevBranch)

                setBugReports(devFilterList); 
            } catch (error) {
                console.error("Ошибка загрузки тикетов:", error);
            }
        };

        GetFixTickets();
    }, []);

    useEffect(() => {
        const checkAdmin = async () => {
            const res = await axios.get(`${host}/api/developer/adminlist/remote/isAdmin?id=${currentUser.id}`)
        
            if(res.data.status == 200) {
                setIsAdmin(res.data.container)
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => setErrorMessage(""), 3000)
            }
        }

        if(!currentUser.id) return

        checkAdmin()
    }, [currentUser])


    return (
        <>
            {isModal && (
                <div onClick={ () => setIsModal(false) } className="main-container-modal" style={{ display: isModal ? 'flex' : 'none', zIndex: '2' }}>
                    <div className="modal-PTCH" onClick={(e) => e.stopPropagation()}>
                        <p className="title-modal-PTCH" >Оповестить об ошибке</p>
                        <div className="decorative-modal-PTCH"></div>
                        <p className="subtitle-modal-PTCH">Краткое описание</p>
                        <input 
                            type="text" 
                            id="input-modal-PTCH" 
                            placeholder="Где вы обнаружили проблему?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ marginBottom: '20px' }}
                            maxLength={20}
                        />
                        <p className="second-subtitle-modal-PTCH">Подробное описание</p>
                        <textarea 
                            name="textarea-modal-PTCH" 
                            id="modal-PTCH-text" 
                            placeholder="Подробно опишите свою проблему"
                            value={detailedDescription}
                            onChange={(e) => setDetailedDescription(e.target.value)}
                            style={{ borderRadius: '3px' }}
                            />
                        <input onChange={() => setCheckboxModal(prev => !prev)} type="checkbox" id='modal-input' className="modal-inputik"/>
                        <label htmlFor="modal-input" className="container-check-modal">
                            <p className="modal-PTCH-dop" style={{ cursor: 'pointer' }}>Поставьте галочку, если уже обращался с этой проблемой</p>
                            <div style={{ cursor: 'pointer' }} className="decoration-container-modal">
                                <div className="decoration-modal-container" style={{ backgroundColor: checkboxModal ? '#28272E' : '#969696' }}></div>
                            </div>
                        </label>
                        <div className="container-but-PTCH"><button id="button-modal-PTCH" onClick={handleModalSend}>Отправить</button></div>
                    </div>
                </div>
            )}
            <div className="main-container-ptch">
                <div className="left-container-ptch">
                    <div className="l-container-ptch">
                        <div className="title-l-ptch">Список изменений</div>
                        { currentUser.id ? 
                            <div className="subtitle-l-ptch">Если у вас есть информация об ошибке, баге или недоработке, пожалуйста сообщите нам через <span className="link-ptch" onClick={toggleModal}> эту форму </span></div>
                        :
                            <div className="subtitle-l-ptch">Войдите в аккаунт, чтобы отправить уведомление об ошибке</div>
                        }
                        <div className="decorative-container-PTCH" style={{ width: currentUser.id ? '937px' : '545px' }}></div>
                    </div>
                    {/* инпутики */}
                    <div className="inputs-container-ptch" style={{ display: isAdmin ? 'flex' : 'none' }}>
                        <input
                            type="text"
                            id="input-l-ptch"
                            placeholder="Введите заголовок"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ backgroundColor: '#D9D9D9' }}
                        />
                        <textarea
                            id="textarea-l-ptch"
                            className="textarea-ptch"
                            placeholder="Введите текст сообщения"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ backgroundColor: '#D9D9D9', fontSize: '12pt' }}
                        />
                        <button id="send-but-ptch" onClick={handleSubmit}>Отправить</button>
                    </div>
                    {/* Сообщения админа */}
                    <div className="container-comp-l">
                        {patches.slice().reverse().map((patch, index) => (
                            <PTCHadmin 
                                key={index}
                                date={patch.date}
                                title={patch.title}
                                content={patch.content}
                            />
                        ))}
                    </div>
                </div>
                <div className="rigth-container-ptch">
                    <div className="title-container-ptch" style={{ display: isAdmin ? 'block' : 'none' }}>Баг трекер</div>
                    <div className="container-comp-r" style={{ display: isAdmin ? 'block' : 'none' }}>
                        {bugReports.slice().reverse().map((bugs, index) => (
                            <PTCHbug 
                                key={index}
                                id={bugs.id}
                                date={bugs.date}
                                description={bugs.title}
                                detailedDescription={bugs.content}
                                currentUser={currentUser}
                                host={host}
                                defaultStatus={bugs.status}
                            />
                        ))}
                    </div>
                </div>
                {/* Обработка ошибочки */}
                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}
            </div>
        </>
    )}

export default PathchesPage;
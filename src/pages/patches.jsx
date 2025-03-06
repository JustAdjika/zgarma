import React, { useState } from "react";
import './Style/patches.css';

import PTCHadmin from "../components/PTCHadminMSG";
import PTCHbug from "../components/PTCHbugList";
    

const PathchesPage = () => {
    const host = "http://localhost:3000"


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
    const [currentUsername, setCurrentUsername] = useState("Не вошел в аккаунт")
    const [currentSteamUsername, setCurrentSteamUsername] = useState("Не привязан стим")
    const [isAdmin, setIsAdmin] = useState(true)

    
    // Состояние для ошибки
    const [errorMessage, setErrorMessage] = useState("");


      // Функция для отправки объявления
      const handleSubmit = () => {
        if (!title.trim() || !message.trim()) {
            setErrorMessage("Пожалуйста, заполните заголовок и текст сообщения.");
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }
    
        setPatches(prevPatches => [
            ...prevPatches,
            { id: Date.now(), title, content: message, date: "06.03.25" }
        ]);
    
        setTitle("");
        setMessage("");
    };

    // Функция для отправки оповещения об ошибки
    const handleModalSend = () => {
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

        console.log(description);
        console.log(detailedDescription);
        
    }



    // Функция для открытия модального окошка
    const toggleModal = () => {
        setIsModal(prevState => !prevState);
    };

    return (
        <div onClick={ (e) => e.stopPropagation() } className="main-container-ptch">
         {isModal && (
               <div onClick={ () => setIsModal(false) } className="main-container-modal" style={{ display: isModal ? 'flex' : 'none' }}>
                    <div className="modal-PTCH" onClick={(e) => e.stopPropagation()}>
                        <div className="title-modal-PTCH" >Оповестить об ошибке</div>
                        <div className="decorative-modal-PTCH"></div>
                        <div className="subtitle-modal-PTCH">Краткое описание</div>
                        <input 
                        type="text" 
                            id="input-modal-PTCH" 
                            placeholder="Где вы обнаружили проблему?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="second-subtitle-modal-PTCH">Подробное описание</div>
                        <textarea 
                            name="textarea-modal-PTCH" 
                            id="modal-PTCH-text" 
                            placeholder="Подробно опишите свою проблему"
                            value={detailedDescription}
                            onChange={(e) => setDetailedDescription(e.target.value)}
                            />
                        <div className="container-check-modal">
                            <div className="modal-PTCH-dop">Поставьте галочку, если уже обращался с этой проблемой</div>
                            <input type="checkbox" name="check-modal" id="checkbox-modal-PTCH" />
                        </div>
                        <div className="container-but-PTCH"><button id="button-modal-PTCH" onClick={handleModalSend}>Отправить</button></div>
                    </div>
                </div>
            )}
            <div className="left-container-ptch">
                <div className="l-container-ptch">
                    <div className="title-l-ptch">Список изменений</div>
                    <div className="subtitle-l-ptch">Если у вас есть информация об ошибке, баге или недоработке, пожалуйста сообщите нам через <span className="link-ptch" onClick={toggleModal}> эту форму </span></div>
                    <div className="decorative-container-PTCH"></div>
                </div>
                {/* инпутики */}
                <div className="inputs-container-ptch">
                    <input
                        type="text"
                        id="input-l-ptch"
                        placeholder="Введите заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        id="textarea-l-ptch"
                        className="textarea-ptch"
                        placeholder="Введите текст сообщения"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button id="send-but-ptch" onClick={handleSubmit}>Отправить</button>
                </div>
                {/* Сообщения админа */}
                <div className="container-comp-l">
                    {patches.map((patch, index) => (
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
                <div className="title-container-ptch">Баг трекер</div>
                <div className="container-comp-r">
                    {bugReports.map((bugs, index) => (
                        <PTCHbug 
                            key={index}
                            date={bugs.date}
                            description={bugs.description}
                            detailedDescription={bugs.detailedDescription}
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
    )
}

export default PathchesPage;
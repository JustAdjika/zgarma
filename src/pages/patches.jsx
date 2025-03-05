import React, { useState } from "react";
import './Style/patches.css';

// import PTCHadmin from "../components/PTCHadminMSG";
import PTCHbug from "../components/PTCHbugList";
    

const PathchesPage = () => {
    const [isModal, setIsModal] = useState(false);

    //функция для открытия модального окошка
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
                        <input type="text" id="input-modal-PTCH" placeholder="Где вы обнаружили проблему?"/>
                        <div className="second-subtitle-modal-PTCH">Подробное описание</div>
                        <textarea name="textarea-modal-PTCH" id="modal-PTCH-text" placeholder="Подробно опишите свою проблему"></textarea>
                        <div className="container-check-modal">
                            <div className="modal-PTCH-dop">Поставьте галочку, если уже обращался с этой проблемой</div>
                            <input type="checkbox" name="check-modal" id="checkbox-modal-PTCH" />
                        </div>
                        <div className="container-but-PTCH"><button id="button-modal-PTCH">Отправить</button></div>
                    </div>
                </div>
            )}
            <div className="left-container-ptch">
                <div className="l-container-ptch">
                    <div className="title-l-ptch">Список изменений</div>
                    <div className="subtitle-l-ptch">Если у вас есть информация об ошибке, баге или недоработке, пожалуйста сообщите нам через <span className="link-ptch" onClick={toggleModal}> эту форму </span></div>
                    <div className="decorative-container-PTCH"></div>
                </div>
                <div className="inputs-container-ptch">
                    <input
                        type="text"
                        id="input-l-ptch"
                        placeholder="Введите заголовок"
                        // value={title}
                        // onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        id="textarea-l-ptch"
                        className="textarea-ptch"
                        placeholder="Введите текст сообщения"
                        // value={message}
                        // onChange={(e) => setMessage(e.target.value)}
                    />
                    <button id="send-but-ptch">Отправить</button>
                </div>
                <div className="container-comp-l"></div>
            </div>
            <div className="rigth-container-ptch">
                <div className="title-container-ptch">Баг трекер</div>
                <div className="container-comp-r">
                    <PTCHbug/>
                    <PTCHbug/>
                    <PTCHbug/>
                    <PTCHbug/>
                    <PTCHbug/>
                    <PTCHbug/>
                </div>
            </div>
        </div>
    )
}

export default PathchesPage;
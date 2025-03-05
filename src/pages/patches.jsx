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
        <div className="main-container-ptch">
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
            {isModal && (
                <div className="modal-PTCH">
                    <div className="title-modal-PTCH"></div>
                    <div className="decorative-modal-PTCH"></div>
                    <div className="subtitle-modal-PTCH"></div>
                    <input type="text" id="input-modal-PTCH" />
                    <div className="second-subtitle-modal-PTCH"></div>
                    <textarea name="textarea-modal-PTCH" id="modal-PTCH-text"></textarea>
                    <div className="modal-PTCH-dop"></div>
                </div>
            )}
        </div>
    )
}

export default PathchesPage;
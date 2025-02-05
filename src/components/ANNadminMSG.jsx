import React from "react";
import './Style/ANNadminMSG.css';

function ANNadminMSG({ title, message, options }) {

    //Актуальная дата для объявления
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("ru-Ru");


    return (
        <div className="main-ANN-div">
            <div className="container-dop-info">
                <div className="author-div">Администранция ZG</div>
                <div className="time-ANN-div">{ formattedDate }</div>
            </div>
            <div className="message-line"></div>
            <div className="decorative-container">
                <div className="left-container"></div>
                <div className="right-container">
                    <div className="ANN-container">
                        <div className="title-ANN">{ title }</div>
                    </div>
                    <div className="message">{ message }</div>
                </div>
            </div>
        </div>
    );
}

export default ANNadminMSG;
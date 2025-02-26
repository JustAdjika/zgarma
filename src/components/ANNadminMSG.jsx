import React from "react";
import './Style/ANNadminMSG.css';
import '../pages/Style/fonts.css'

function ANNadminMSG({ title, content, date, options }) {
    return (
        <div className="main-ANN-div">
            <div className="container-dop-info">
                <div className="author-div">Администранция ZG</div>
                <div className="time-ANN-div">{ date }</div>
            </div>
            <div className="message-line"></div>
            <div className="decorative-container">
                <div className="left-container"></div>
                <div className="right-container">
                    <div className="ANN-container">
                        <div className="title-ANN">{ title }</div>
                    </div>
                    <div className="message">{ content }</div>
                </div>
            </div>
        </div>
    );
}

export default ANNadminMSG;
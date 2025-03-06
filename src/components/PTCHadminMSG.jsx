import React from "react";
import './Style/PTCHadminMSG.css';

const PTCHadmin = ({ title, content, date }) => {

    return (
        <div className="main-PTCH-div">
            <div className="container-dop-info">
                <div className="author-div">Администранция ZG</div>
                {/* Сюда время */}
                <div className="time-PTCH-div">{ date }</div> 
            </div>
            <div className="message-line"></div>
            <div className="decorative-container">
                <div className="left-container"></div>
                <div className="right-container">
                    <div className="PTCH-container">
                        {/* Сюда заголовок */}
                        <div className="title-PTCH">{ title }</div>
                    </div>
                    {/* сюда контент */}
                    <div className="message">{ content }</div>
                </div>
            </div>
        </div>
    )
}

export default PTCHadmin; 
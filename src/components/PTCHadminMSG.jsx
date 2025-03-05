import React from "react";
import './Style/PTCHadminMSG.css';

const PTCHadmin = () => {
    return (
        <div className="main-PTCH-div">
            <div className="container-dop-info">
                <div className="author-div">Администранция ZG</div>
                {/* Сюда время */}
                <div className="time-PTCH-div"></div> 
            </div>
            <div className="message-line"></div>
            <div className="decorative-container">
                <div className="left-container"></div>
                <div className="right-container">
                    <div className="PTCH-container">
                        {/* Сюда заголовок */}
                        <div className="title-PTCH"></div>
                    </div>
                    {/* сюда контент */}
                    <div className="message"></div>
                </div>
            </div>
        </div>
    )
}

export default PTCHadmin; 
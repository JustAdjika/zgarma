import { React, useState } from "react"; // Импортируем useState
import './Style/ANNvote.css';

function AnnVote({ title, message, options, voteIndex }) {
    // Актуальная дата для голосования
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("ru-RU");

    // Состояние для хранения выбранного чекбокса
    const [selectedOption, setSelectedOption] = useState(null);

    // Функция для обработки выбора radio
    const handleCheckboxChange = (index) => {
        setSelectedOption(index); // Устанавливаем выбранный индекс
    };

    return (
        <div className="main-div-ANNvote">
            <div className="obert-ANNvote-div">
                <div className="time-ANNvote">{formattedDate}</div>
                <div className="author-div2">{title}</div>
            </div>
            <div className="title-message-vote" style={{ marginBottom: '5px', textAlign: 'right' }}>{message}</div>
            <div className="text-info-ANN-vote">
            <div className="checkbox-container-vote">
            {options.map((option, index) => (
                        <div key={index} className="checkbox-item">
                            <input
                                type="radio"
                                name={`option-${voteIndex}`}
                                id={`option-${voteIndex}-${index}`}
                                checked={selectedOption === index}
                                onChange={() => handleCheckboxChange(index)}
                                className="check-box-vote"
                            />
                            <label htmlFor={`option-${voteIndex}-${index}`} className="custom-radio" data-number={index + 1}>
                                <div className="decorative-square">
                                    <div className="container-box">
                                        <div className="vote-index" style={{ backgroundColor: selectedOption === index ? "#616161" : "#1A1A1A" }}>{index + 1}</div>
                                    </div>
                                </div>
                                {option} {/* Текст варианта голосования */}
                            </label>
                        </div>
                    ))}
            </div>
            </div>
        </div>
    );
}

export default AnnVote;
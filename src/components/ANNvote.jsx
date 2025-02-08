import { React, useEffect, useState } from "react"; // Импортируем useState
import axios from "axios";
import './Style/ANNvote.css';

function AnnVote({ title, content, date, options, voteIndex, currentUser, votes }) {
    // Актуальная дата для голосования
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("ru-RU");

    // Состояние для хранения выбранного чекбокса
    const [selectedOption, setSelectedOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect( () => {
        console.log(votes);
        
        JSON.parse(votes).forEach(element => {
            if(element.userId == currentUser.id) {
                setSelectedOption(element.option -1)
            }
        });
    },[]);

    // Функция для обработки выбора radio
    const handleCheckboxChange = async (index) => {
        setSelectedOption(index); // Устанавливаем выбранный индекс
        const resVote = await axios.put('http://localhost:3000/api/developer/post/vote/add', {
            key: "MyKey",
            option: index + 1,
            postId: voteIndex
        });
        if(resVote.data.status !== 200) {
            setErrorMessage(resVote.data.err);
            setTimeout(() => setErrorMessage(""), 5000); // Скрывает через 5 сек
            return;  // Прерываем выполнение функции
        };
    };

    return (
        <div className="main-div-ANNvote">
            <div className="obert-ANNvote-div">
                <div className="time-ANNvote">{date}</div>
                <div className="author-div2">{title}</div>
            </div>
            <div className="title-message-vote" style={{ marginBottom: '5px', textAlign: 'right' }}>
                {content}
            </div>
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
                                        <div className="vote-index" style={{ backgroundColor: selectedOption === index ? "#616161" : "#1A1A1A" }}>
                                            {index + 1}
                                        </div>
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
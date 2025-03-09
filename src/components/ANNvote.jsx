import { React, useEffect, useState } from "react"; // Импортируем useState
import axios from "axios";
import './Style/ANNvote.css';
import '../pages/Style/fonts.css'

function AnnVote({ title, content, date, options, voteIndex, currentUser, votes, host }) {

    // Состояние для хранения выбранного чекбокса
    const [selectedOption, setSelectedOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect( () => {
        
        JSON.parse(votes).forEach(element => {
            if(element.userId == currentUser.id) {
                setSelectedOption(element.option -1)
            }
        });
    },[]);

    // Функция для обработки выбора radio
    const handleCheckboxChange = async (index) => {
        setSelectedOption(index); // Устанавливаем выбранный индекс
        const resVote = await axios.put(`${host}/api/developer/post/vote/add`, {
            key: currentUser.key,
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
            <div className="title-message-vote" style={{ marginBottom: '5px', textAlign: 'right', width: '430px', wordWrap: 'break-word' }}>
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
                            { currentUser.id ? 
                                <label htmlFor={`option-${voteIndex}-${index}`} className="custom-radio" data-number={index + 1}>
                                    <div className="decorative-square">
                                        <div className="container-box">
                                            <div className="vote-index" style={{ backgroundColor: selectedOption === index ? "#616161" : "#1A1A1A" }}>
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <span>{option}</span> {/* Текст варианта голосования */}
                                </label>
                            :
                                <div className="custom-radio" data-number={index + 1}>
                                    <div className="decorative-square" style={{ backgroundColor: '#C0392B'}}>
                                        <div className="container-box">
                                            <div className="vote-index" style={{ backgroundColor: selectedOption === index ? "#616161" : "#1A1A1A" }}>
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <span>{option}</span> {/* Текст варианта голосования */}
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AnnVote;
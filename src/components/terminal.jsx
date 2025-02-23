import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './Style/terminal.css';

const Terminal = ({ setErrorMessage }) => {
    const [stringArr, setStringArr] = useState([])
    const [inputData, setInputData] = useState("")

    const handleExecute = () => {
        try {
            const userData = JSON.parse(Cookies.get('userData'))

            const newString = {
                author: userData.discord.username,
                authorId: userData.id,
                content: inputData
            }
    
            setStringArr(prev => [...prev, newString])
            setInputData("")
        } catch (e) {
            setErrorMessage(e.message)
            setTimeout(() => {setErrorMessage("")}, 5000)
        }
    }

    return (
        <div className="terminal-container">
            <div className='terminal-display'>
                {stringArr.map((stringElement) => (
                    <span>{`${stringElement.author} > ${stringElement.content}`}</span>
                ))}
            </div>
            <div className='terminal-executer-container'>
                <input type="text" className='terminal-executer-input' onChange={(e) => { setInputData(e.target.value) }} placeholder='Введите команду' value={ inputData }/>
                <div className='terminal-executer-button-container'>
                    <button className='terminal-execute' onClick={ handleExecute }>Выполнить</button>
                </div>
            </div>
        </div>
    );
};

export default Terminal;
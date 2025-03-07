import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import './Style/terminal.css';
import '../pages/Style/fonts.css'

const Terminal = ({ setErrorMessage, host }) => {
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

            const parts = newString.content.trim().split(/\s+/)
            if (parts.length < 2) return { error: "Неверный формат команды" };

            const type = parts[0]
            const address = parts[1]

            let data = parts.slice(2).join(" "); // Всё остальное объединяем в строку

            console.log(type)
            console.log(address)
            console.log(data)

            try {
                data = data ? JSON.parse(data) : null; // Парсим JSON, если есть данные
            } catch (e) {
                return { type, address, data: null, error: "Ошибка парсинга JSON" };
            }

            switch(type) {
                case "POST": 
                    axios.post(`${host}/${address}`, data)
                        .then(res => {
                            const resString = {
                                author: `App "${host}/${address}"`,
                                authorId: null,
                                content: JSON.stringify(res.data.container)
                            }

                            try {
                                setStringArr(prev => [...prev, resString])
                            } catch (e) {
                                const errorString = {
                                    author: `App "System"`,
                                    authorId: null,
                                    content: `OUTPUT ERROR: ${e}`
                                }
                                setStringArr(prev => [...prev, errorString])
                            }
                        });
                    break;
                case "GET":
                    axios.get(`${host}/${address}`)
                        .then(res => {
                            const resString = {
                                author: `App "${host}/${address}"`,
                                authorId: null,
                                content: JSON.stringify(res.data.container)
                            }

                            try {
                                setStringArr(prev => [...prev, resString])
                            } catch (e) {
                                const errorString = {
                                    author: `App "System"`,
                                    authorId: null,
                                    content: `OUTPUT ERROR: ${e}`
                                }
                                setStringArr(prev => [...prev, errorString])
                            }
                        });
                    break;
                case "DELETE":
                    axios.delete(`${host}/${address}`, data)
                        .then(res => {
                            const resString = {
                                author: `App "${host}/${address}"`,
                                authorId: null,
                                content: JSON.stringify(res.data.container)
                            }

                            try {
                                setStringArr(prev => [...prev, resString])
                            } catch (e) {
                                const errorString = {
                                    author: `App "System"`,
                                    authorId: null,
                                    content: `OUTPUT ERROR: ${e}`
                                }
                                setStringArr(prev => [...prev, errorString])
                            }
                        });
                    break;
                case "PATCH":
                    axios.patch(`${host}/${address}`, data)
                        .then(res => {
                            const resString = {
                                author: `App "${host}/${address}"`,
                                authorId: null,
                                content: JSON.stringify(res.data.container)
                            }

                            try {
                                setStringArr(prev => [...prev, resString])
                            } catch (e) {
                                const errorString = {
                                    author: `App "System"`,
                                    authorId: null,
                                    content: `OUTPUT ERROR: ${e}`
                                }
                                setStringArr(prev => [...prev, errorString])
                            }
                        });
                    break;
                case "PUT":
                    axios.put(`${host}/${address}`, data)
                        .then(res => {
                            const resString = {
                                author: `App "${host}/${address}"`,
                                authorId: null,
                                content: JSON.stringify(res.data.container)
                            }

                            try {
                                setStringArr(prev => [...prev, resString])
                            } catch (e) {
                                const errorString = {
                                    author: `App "System"`,
                                    authorId: null,
                                    content: `OUTPUT ERROR: ${e}`
                                }
                                setStringArr(prev => [...prev, errorString])
                            }
                        });
                    break;
                default: return { error: "Неверный тип запроса. Разрешен только POST, GET, DELETE, PATCH, PUT" }
            }
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
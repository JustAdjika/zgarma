import React, { useEffect, useState } from 'react';

import './Style/modalRegister.css'
import '../../pages/Style/fonts.css'

const ModalRegister = ({ host, setIsModalEventRegister, setModalRegisterEvent, modalRegisterEvent, isModalEventRegister }) => {
    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(false)

    return (
        <div onClick={ () => { setIsModalEventRegister(false) } } className='event-modal-eventreg-main' style={{ display: isModalEventRegister ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-eventreg-container'>
                <h2 className='event-modal-eventreg-title' style={{ fontSize: modalRegisterEvent?.title?.length > 23 ? '23px' : '30px' }}>{modalRegisterEvent.title}</h2>
                <p className='event-modal-eventreg-slots-value'>Количество слотов 20х20</p>
                
                <h3 className='event-modal-eventreg-h3-title'>Иллюстрация к миссии</h3>
                <div className='event-modal-eventreg-img-container' style={{ backgroundImage: `url("../../../server/files/${modalRegisterEvent.imgPath}")` }}></div>
                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginTop: '0px', width: '300px' }} className='event-modal-eventreg-h3-title'>Регистрация</h3>
                        <div className='event-modal-eventreg-h3-decorative-line'/>
                    </div>
                    <p id='event-modal-eventreg-p-reg-header'>Чтобы выбрать слот, нажмите на него в таблице слотов</p>
                </div>
                <p style={{color: '#D9D9D9', fontFamily: 'My Open Sans', width: '500px', marginLeft: '10px'}}>Выбранный слот: <span style={{ color: '#C0392B' }}>Красная сторона. Отряд “Пехота 1”. Слот “Командир Отряда”</span></p>
                <input type="checkbox" id='event-modal-eventreg-checkbox-1' style={{ display: 'none' }} onChange={() => setCheckbox1(prev => !prev)} />
                <input type="checkbox" id='event-modal-eventreg-checkbox-2' style={{ display: 'none' }} onChange={() => setCheckbox2(prev => !prev)} />
                <label className='event-modal-eventreg-checkbox-container' htmlFor="event-modal-eventreg-checkbox-1">
                    <p>Я хочу быть командиром стороны, если эту роль никто не займет</p>
                    <div>
                        <div style={{ backgroundColor: checkbox1 ? '#28272E' : '#969696' }} />
                    </div>
                </label>
                <label className='event-modal-eventreg-checkbox-container' htmlFor="event-modal-eventreg-checkbox-2">
                    <p>Я хочу быть командиром своего отряда, если эту роль никто не займет</p>
                    <div>
                        <div style={{ backgroundColor: checkbox2 ? '#28272E' : '#969696' }} />
                    </div>
                </label>
                <button className='event-modal-eventreg-sendRequest'>Отправить заявку</button>
                <p id='event-modal-eventreg-sendRequest-p-callback'>Заявка успешно отправлена. Ожидайте ответа администрации, подробности ответа вы сможете увидеть в уведомлениях профиля</p>
            </div>
        </div>
    );
};

export default ModalRegister;
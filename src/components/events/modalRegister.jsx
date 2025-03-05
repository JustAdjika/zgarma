import React, { useEffect, useState } from 'react';

import './Style/modalRegister.css'
import '../../pages/Style/fonts.css'

const ModalRegister = ({ host, setIsModalEventRegister, setModalRegisterEvent, modalRegisterEvent, isModalEventRegister }) => {
    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(false)
    const [slotCount, setSlotCount] = useState({
        red: 0,
        blue: 0,
    })
    const [team, setTeam] = useState(null)
    const [squad, setSquad] = useState(null)
    const [slot, setSlot] = useState(null)

    const slots1 = JSON.parse(modalRegisterEvent.slotsTeam1)
    const slots2 = JSON.parse(modalRegisterEvent.slotsTeam2)


    return (
        <div onClick={ () => { setIsModalEventRegister(false) } } className='event-modal-eventreg-main' style={{ display: isModalEventRegister ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-eventreg-container'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', height: '120px', width: '700px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '330px' }}>
                            <h2 className='event-modal-eventreg-slots-h2' style={{ color: '#C0392B' }}>Красная команда</h2>
                            <div className='event-modal-eventreg-slots-decorative-line' style={{ backgroundColor: '#C0392B' }}/>
                            <div className='event-modal-eventreg-slot-container' style={{ marginTop: '20px' }}>Командир стороны</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '330px' }}>
                            <h2 className='event-modal-eventreg-slots-h2' style={{ color: '#0B94E0' }}>Синяя команда</h2>
                            <div className='event-modal-eventreg-slots-decorative-line' style={{ backgroundColor: '#0B94E0' }}/>
                            <div className='event-modal-eventreg-slot-container' style={{ marginTop: '20px' }}>Командир стороны</div>
                        </div>
                    </div>
                    <div className="event-modal-eventreg-slots-main-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '700px' }}>
                            <div style={{ width: '330px' }}>
                                <div className='event-modal-eventreg-squad-container'>
                                    <h3>Пехота</h3>
                                    <button className='event-modal-eventreg-slot-container'>Командир отряда</button>
                                    <button className='event-modal-eventreg-slot-container'>Медик</button>
                                    <button className='event-modal-eventreg-slot-container'>Стрелок</button>
                                </div>
                            </div>
                            <div style={{ width: '330px' }}>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalRegister;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalRegister.css'
import '../../pages/Style/fonts.css'

import ModalRegisterButton from './modalRegisterButton';

import RegisterSquad from './register/registerSquad';
import RegisterSlot from './register/registerSlot';

const ModalRegister = ({ host, setIsModalEventRegister, isAccount, modalRegisterEvent, isModalEventRegister, setErrorMessage }) => {
    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(false)
    const [slotCount, setSlotCount] = useState({
        red: 0,
        blue: 0,
    })
    const [team, setTeam] = useState(null)
    const [squad, setSquad] = useState(null)
    const [slot, setSlot] = useState(null)
    const [slots1, setSlots1] = useState([])
    const [slots2, setSlots2] = useState([])
    const [cmdSlotRed, setCmdSlotRed] = useState({})
    const [cmdSlotBlue, setCmdSlotBlue] = useState({})

    const [reqState, setReqState] = useState(false)

    const [loadCount, setLoadCount] = useState(0)

    useEffect(() => {
        if(modalRegisterEvent.slotsTeam1) {
            const tempSlots = modalRegisterEvent.slotsTeam1.filter((_, i) => i != 0)
            setSlots1(tempSlots)
            setCmdSlotRed(modalRegisterEvent.slotsTeam1[0])
        }
        if(modalRegisterEvent.slotsTeam2) {
            const tempSlots = modalRegisterEvent.slotsTeam2.filter((_, i) => i != 0)
            setSlots2(tempSlots)
            setCmdSlotBlue(modalRegisterEvent.slotsTeam2[0])
        }
    }, [modalRegisterEvent])

    useEffect(() => {
        let tempSlotCounterRed = 0
        let tempSlotCounterBlue = 0

        slots1.forEach(element => {
            tempSlotCounterRed += element.slots.length
        });
        slots2.forEach(element => {
            tempSlotCounterBlue += element.slots.length
        });

        setSlotCount({ red: tempSlotCounterRed+1, blue: tempSlotCounterBlue+1 })
    }, [slots1, slots2])

    const handleSendRequest = async () => {
        if (team != 0 && team != 1) { 
            setErrorMessage("Команда не выбрана")
            setTimeout(() => { setErrorMessage("") }, 3000)
        }else {
            const res = await axios.post(`${host}/api/developer/event/request/add`, {
                key: JSON.parse(Cookies.get("userData")).key,
                eventId: modalRegisterEvent.id,
                team: team == 0 ? 'Red' : 'Blue',
                squad: squad,
                slot: slot,
                maybeSL: checkbox2,
                maybeTL: checkbox1
            })

            if(res.data.status == 200) {
                setReqState(true)
                setTimeout(() => { setReqState(false) }, 5000)
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => { setErrorMessage("") }, 3000)
            }
        }
    }

    useEffect(() => {
        setReqState(false)
    }, [modalRegisterEvent])

    const handleLoadChange = (isLoading) => {
        setLoadCount(prev => isLoading ? prev + 1 : prev - 1)
    }

    useEffect(() => {loadCount ? console.log(loadCount) : null}, [loadCount])

    const [imgLoading, setImgLoading] = useState(true)

    useEffect(() => {
        console.log(squad)
    }, [slot, squad, team])

    return (
        <div onClick={ () => { setIsModalEventRegister(false) } } className='event-modal-eventreg-main' style={{ display: isModalEventRegister ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-eventreg-container'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 className='event-modal-eventreg-title' style={{ fontSize: modalRegisterEvent?.title?.length > 23 ? '23px' : '30px' }}>{modalRegisterEvent.title}</h2>
                    <p className='event-modal-eventreg-slots-value'>{ modalRegisterEvent.type == 'PVP' ? `Количество слотов ${slotCount.red}х${slotCount.blue}` : `Количество слотов ${slotCount.red}` }</p>
                    
                    <h3 className='event-modal-eventreg-h3-title' style={{ display: modalRegisterEvent.imgPath ? 'inline' : 'none' }}>Иллюстрация к миссии</h3>
                    <div className='event-modal-eventreg-img-container' style={{ display: imgLoading && modalRegisterEvent.imgPath ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}>
                        <div class="loader" style={{ display: imgLoading ? 'block' : 'none' }}></div>
                    </div>
                    <img className='event-modal-eventreg-img-container' onLoad={() => setImgLoading(false)} src={`https://api.zgarma.ru/${modalRegisterEvent.imgPath}`} style={{ display: imgLoading || !modalRegisterEvent.imgPath ? 'none' : 'flex' }}></img>
                    <div style={{ display: 'flex', marginTop: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginTop: '0px', width: '300px' }} className='event-modal-eventreg-h3-title'>Регистрация</h3>
                            <div className='event-modal-eventreg-h3-decorative-line'/>
                        </div>
                        <p id='event-modal-eventreg-p-reg-header'>Чтобы выбрать слот, нажмите на него в таблице слотов</p>
                    </div>
                    <p 
                        style={{
                            color: '#D9D9D9', 
                            fontFamily: 'My Open Sans', 
                            width: '550px', 
                            marginLeft: '10px',
                            display: slot !== null ? 'inline' : 'none'
                    }}>
                        Выбранный слот: 
                        { squad === 0 ?
                            <span style={{ color: team === 0 ? '#C0392B' : '#0B94E0' }}>
                                { ` Командир ${ team == 0 ? 'красной' : 'синей' } стороны` }
                            </span>
                        : 
                            <span style={{ color: team === 0 ? '#C0392B' : '#0B94E0' }}>
                                { team === 0 ? ' Красная' : ' Синяя' } сторона. Отряд "{ team === 0 ? slots1[squad-1]?.title : slots2[squad-1]?.title }". Слот “{ slot === 0 ? 'Командир отряда' : team === 0 ? slots1[squad-1]?.slots[slot]?.title : slots2[squad-1]?.slots[slot]?.title }”
                            </span>
                        }
                    </p>
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
                    <button style={{ display: isAccount ? 'block' : 'none' }} className='event-modal-eventreg-sendRequest' onClick={ handleSendRequest }>Отправить заявку</button>
                    <p style={{ color: '#C0712B', display: isAccount ? 'none' : 'flex' }}>Чтобы отправить заявку, войдите в аккаунт и привяжите Steam!</p>
                    <p style={{ display: reqState ? 'flex' : 'none' }} id='event-modal-eventreg-sendRequest-p-callback'>Заявка успешно отправлена. Ожидайте ответа администрации, подробности ответа вы сможете увидеть в уведомлениях профиля</p>
                </div>
                <div>
                    <div class="loader" style={{ marginRight: '330px', marginTop: '250px', display: loadCount > 0 ? 'block' : 'none' }}></div>
                </div>



                <div style={{ display: loadCount > 0 ? 'none' : 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', height: '120px', width: '700px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '330px' }}>
                            <h2 className='event-modal-eventreg-slots-h2' style={{ color: '#C0392B' }}>Красная команда</h2>
                            <div className='event-modal-eventreg-slots-decorative-line' style={{ backgroundColor: '#C0392B' }}/>
                            {/* <ModalRegisterButton 
                                butType={ 'CMD_red' } 
                                setTeam={setTeam} 
                                setSquad={setSquad} 
                                setSlot={setSlot} 
                                slotsOriginal={cmdSlotRed} 
                                slot={slot}
                                team={team}
                                squad={squad}
                                host={host}
                                handleLoadChange={handleLoadChange}
                            /> */}
                            <RegisterSlot 
                                slotItem={{title: 'Командир стороны'}}
                                mapData={{team: 0}}
                                setTeam={setTeam}
                                setSquad={setSquad}
                                setSlot={setSlot}
                                host={host}
                                handleLoadChange={handleLoadChange}
                                slotsOriginal={[slots1, slots2]}
                                setErrorMessage={setErrorMessage}
                                isCMDtype={true}
                                team={team}
                                squad={squad}
                                slot={slot}
                            />
                        </div>
                        <div style={{ display: modalRegisterEvent.type == 'PVP' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', width: '330px' }}>
                            <h2 className='event-modal-eventreg-slots-h2' style={{ color: '#0B94E0' }}>Синяя команда</h2>
                            <div className='event-modal-eventreg-slots-decorative-line' style={{ backgroundColor: '#0B94E0' }}/>
                            <ModalRegisterButton 
                                butType={ 'CMD_blue' } 
                                setTeam={setTeam} 
                                setSquad={setSquad} 
                                setSlot={setSlot} 
                                slotsOriginal={cmdSlotBlue} 
                                slot={slot}
                                team={team}
                                squad={squad}
                                host={host}
                                handleLoadChange={handleLoadChange}
                                setErrorMessage={setErrorMessage}
                            />
                        </div>
                    </div>


                    
                    <div className="event-modal-eventreg-slots-main-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '700px' }}>
                            <div style={{ width: '330px' }}>
                                { slots1.map((squadItem, squadIndex) => (
                                    // <div className='event-modal-eventreg-squad-container'>
                                    //     <h3>{squadItem.title}</h3>

                                    //     { squadItem.slots.map((slotItem, slotIndex) => {
                                    //         if( slotItem.SL == true ) { 
                                    //             return (
                                    //                 <ModalRegisterButton 
                                    //                     butType={ 'SL_red' } 
                                    //                     setTeam={setTeam} 
                                    //                     setSquad={setSquad} 
                                    //                     setSlot={setSlot} 
                                    //                     slotsOriginal={slots1} 
                                    //                     squadIndex={squadIndex} 
                                    //                     squadItem={squadItem} 
                                    //                     slotIndex={slotIndex} 
                                    //                     slotItem={slotItem} 
                                    //                     slot={slot}
                                    //                     team={team}
                                    //                     squad={squad}
                                    //                     host={host}
                                    //                     handleLoadChange={handleLoadChange}
                                    //                 />
                                    //             )
                                    //         } else {
                                    //             return (
                                    //                 <ModalRegisterButton 
                                    //                     butType={ 'red' } 
                                    //                     setTeam={setTeam} 
                                    //                     setSquad={setSquad} 
                                    //                     setSlot={setSlot} 
                                    //                     slotsOriginal={slots1} 
                                    //                     squadIndex={squadIndex} 
                                    //                     squadItem={squadItem} 
                                    //                     slotIndex={slotIndex} 
                                    //                     slotItem={slotItem} 
                                    //                     slot={slot}
                                    //                     team={team}
                                    //                     squad={squad}
                                    //                     host={host}
                                    //                     handleLoadChange={handleLoadChange}
                                    //                 />
                                    //             )
                                    //         }
                                    //     })}
                                            
                                    // </div>
                                    <RegisterSquad 
                                        squadItem={squadItem}
                                        squadIndex={squadIndex}
                                        slotsOriginal={[slots1, slots2]}
                                        teamIndex={0}
                                        setSlot={setSlot}
                                        setSquad={setSquad}
                                        setTeam={setTeam}
                                        host={host}
                                        handleLoadChange={handleLoadChange}
                                        team={team}
                                        squad={squad}
                                        slot={slot}
                                    />
                                ))}
                            </div>
                            <div style={{ width: '330px' }}>
                                { slots2.map((squadItem, squadIndex) => (
                                    <div className='event-modal-eventreg-squad-container'>
                                        <h3>{squadItem.title}</h3>

                                        { squadItem.slots.map((slotItem, slotIndex) => {
                                            if( slotItem.SL == true ) { 
                                                return (
                                                    <ModalRegisterButton 
                                                        butType={ 'SL_blue' } 
                                                        setTeam={setTeam} 
                                                        setSquad={setSquad} 
                                                        setSlot={setSlot} 
                                                        slotsOriginal={slots2} 
                                                        squadIndex={squadIndex} 
                                                        squadItem={squadItem} 
                                                        slotIndex={slotIndex} 
                                                        slotItem={slotItem} 
                                                        slot={slot}
                                                        team={team}
                                                        squad={squad}
                                                        host={host}
                                                        handleLoadChange={handleLoadChange}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <ModalRegisterButton 
                                                        butType={ 'blue' } 
                                                        setTeam={setTeam} 
                                                        setSquad={setSquad} 
                                                        setSlot={setSlot} 
                                                        slotsOriginal={slots2} 
                                                        squadIndex={squadIndex} 
                                                        squadItem={squadItem} 
                                                        slotIndex={slotIndex} 
                                                        slotItem={slotItem} 
                                                        slot={slot}
                                                        team={team}
                                                        squad={squad}
                                                        host={host}
                                                        handleLoadChange={handleLoadChange}
                                                    />
                                                )
                                            }
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    );
};

export default ModalRegister;
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './Style/modalEventRemote.css'

const ModalEventRemote = ({ host, setIsModalEventRemote, isModalEventRemote, modalRemoteEvent, setErrorMessage }) => {
    const [eventRemoteTitle, setEventRemoteTitle] = useState("")
    const [eventRemoteMetar, setEventRemoteMetar] = useState("")
    const [eventRemoteDescription, setEventRemoteDescription] = useState("")
    const [eventRemoteIsImg, setEventRemoteIsImg] = useState(false)
    const [eventRemoteIsMod, setEventRemoteIsMod] = useState(false)
    const [eventRemoteDate, setEventRemoteDate] = useState("")
    const [eventRemoteTimeM, setEventRemoteTimeM] = useState("")
    const [eventRemoteTimeH, setEventRemoteTimeH] = useState("")
    const [eventRemoteTeam1, setEventRemoteTeam1] = useState("")
    const [eventRemoteTeam2, setEventRemoteTeam2] = useState("")
    const [eventRemoteVeh1, setEventRemoteVeh1] = useState([])
    const [eventRemoteVeh2, setEventRemoteVeh2] = useState([])
    const [eventRemoteType, setEventRemoteType] = useState("PVE")
    const [eventRemoteSlots1, setEventRemoteSlots1] = useState([])
    const [eventRemoteSlots2, setEventRemoteSlots2] = useState([])

    useEffect(() => {
        setEventRemoteTitle(modalRemoteEvent.title)
        setEventRemoteMetar(modalRemoteEvent.metar)
        setEventRemoteDescription(modalRemoteEvent.description)
        setEventRemoteDate(modalRemoteEvent.date)
        setEventRemoteTeam1(modalRemoteEvent.team1)
        setEventRemoteTeam2(modalRemoteEvent.team2)
        setEventRemoteType(modalRemoteEvent.type)

        if(modalRemoteEvent.vehTeam1){
            setEventRemoteVeh1(JSON.parse(modalRemoteEvent.vehTeam1))
        }
        if(modalRemoteEvent.vehTeam2) {
            setEventRemoteVeh2(JSON.parse(modalRemoteEvent.vehTeam2))
        }
        
        if(modalRemoteEvent.time) {
            const [hours, minutes] = modalRemoteEvent.time.split(":")
            setEventRemoteTimeM(minutes)
            setEventRemoteTimeH(hours)
        }

        if(modalRemoteEvent.slotsTeam1) {
            const tempSlots = JSON.parse(modalRemoteEvent.slotsTeam1).filter((_, i) => i != 0)
            setEventRemoteSlots1(tempSlots)
            console.log(tempSlots)
        }
        if(modalRemoteEvent.slotsTeam2) {
            const tempSlots = JSON.parse(modalRemoteEvent.slotsTeam2).filter((_, i) => i != 0)
            setEventRemoteSlots2(tempSlots)
            console.log(tempSlots)
        }
    }, [modalRemoteEvent])


    const handleOpenEvent = async () => {
        if(window.confirm('Вы уверены, что хотите открыть событие?')){
            const res = await axios.post(`${host}/api/developer/event/edit/status/open`, {
                eventId: modalRemoteEvent.id,
                key: JSON.parse(Cookies.get("userData")).key
            })

            if(res.data.status == 200) {
                window.location.reload()
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }

    const handleDeleteEvent = async () => {
        if(window.confirm('Вы уверены, что хотите удалить событие?')){
            console.log(JSON.parse(Cookies.get("userData")).key)
            const res = await axios.delete(`${host}/api/developer/event/edit/delete`, {
                data: {
                    eventId: modalRemoteEvent.id,
                    key: JSON.parse(Cookies.get("userData")).key
                }
            })

            if(res.data.status == 200) {
                window.location.reload()
            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }


    const eventRemoteImgChange = async (e) => {
        const file = e.target.files[0]

        if(file) {
            setEventRemoteIsImg(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("key", JSON.parse(Cookies.get("userData")).key)
            formData.append("eventId", modalRemoteEvent.id)

            const res = await axios.post(`${host}/api/developer/event/edit/imgupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if(res.data.status != 200) {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
            }
        }
    }


    const eventRemoteModChange = async (e) => {
        const file = e.target.files[0]

        if(file) {
            setEventRemoteIsMod(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("key", JSON.parse(Cookies.get("userData")).key)
            formData.append("eventId", modalRemoteEvent.id)

            const res = await axios.post(`${host}/api/developer/event/edit/modsupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if(res.data.status != 200) {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
                console.log(res.data.err)
            }
        }
    }

    return (
        <div onClick={ () => { setIsModalEventRemote(false) } } className='event-modal-eventremote-main' style={{ display: isModalEventRemote ? 'flex' : 'none' }}>
            <div onClick={(e) => e.stopPropagation()} className='event-modal-eventremote-container'>
                <div className='event-modal-eventremote-info-container'>



                    <input 
                        onBlur={() => { 
                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                key: JSON.parse(Cookies.get("userData")).key, 
                                eventId: modalRemoteEvent.id,  
                                title: eventRemoteTitle 
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-title' 
                        onChange={(e) => { setEventRemoteTitle(e.target.value) }} 
                        value={eventRemoteTitle}
                        maxLength={25}
                    />


                    <input 
                        type="file" 
                        accept="image/*" 
                        className='event-modal-eventremote-inputfile' 
                        id='event-modal-eventremote-inputfile-img' 
                        onChange={eventRemoteImgChange} 
                        style={{ display: 'none' }}
                    />


                    <div className='event-modal-eventremote-inputfile-container'>
                    <label 
                        htmlFor="event-modal-eventremote-inputfile-img" 
                        className='event-modal-eventremote-inputfile-label'
                    >
                        Добавить изображение
                    </label>
                        <span 
                            style={{ 
                                display: eventRemoteIsImg ? 'flex' : 'none', 
                                marginLeft: '20px', 
                                fontSize: '15pt', 
                                color: '#D9D9D9' 
                            }}
                        >
                            Файл загружен
                        </span>
                    </div>


                    <input 
                        onBlur={() => { 
                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                key: JSON.parse(Cookies.get("userData")).key, 
                                eventId: modalRemoteEvent.id,  
                                metar: eventRemoteMetar
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-metar' 
                        onChange={(e) => { setEventRemoteMetar(e.target.value) }} 
                        value={eventRemoteMetar}
                        maxLength={40}
                    />


                    <textarea
                        onBlur={() => { 
                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                key: JSON.parse(Cookies.get("userData")).key, 
                                eventId: modalRemoteEvent.id,  
                                description: eventRemoteDescription
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-description' 
                        onChange={(e) => { setEventRemoteDescription(e.target.value) }} 
                        value={eventRemoteDescription}
                    />


                    <input 
                        type="file" 
                        className='event-modal-eventremote-inputfile' 
                        id='event-modal-eventremote-inputfile-mods' 
                        onChange={eventRemoteModChange} 
                        style={{ display: 'none' }}
                    />


                    <div className='event-modal-eventremote-inputfile-container' style={{ marginTop: '40px' }}>
                        <label 
                            htmlFor="event-modal-eventremote-inputfile-mods" 
                            className='event-modal-eventremote-inputfile-label'
                        >
                            Загрузить сборку модов
                        </label>
                        <span 
                            style={{ 
                                display: eventRemoteIsMod ? 'flex' : 'none', 
                                marginLeft: '20px', 
                                fontSize: '15pt', 
                                color: '#D9D9D9' 
                            }}
                        >
                            Файл загружен
                        </span>
                    </div>


                    <div className='event-modal-eventremote-td-info-container'>
                        <div className='event-modal-eventremote-date-container'>
                            <span className='event-modal-eventremote-td-info-title'>Дата проведения</span>
                            <input 
                                className='event-modal-eventremote-td-input' 
                                maxLength={8}
                                style={{ 
                                    width: '90px', 
                                    marginLeft: '45px',
                                    textAlign: 'left',
                                }} 
                                onChange={(e) => { setEventRemoteDate(e.target.value) }}
                                value={ eventRemoteDate }
                                placeholder='дд.мм.гг'
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        date: eventRemoteDate
                                    }) 
                                }} 
                            />
                        </div>
                        <div className='event-modal-eventremote-time-container'>
                            <span className='event-modal-eventremote-td-info-title'>Время проведения</span>
                            <span style={{color: '#D9D9D9', marginLeft: '28px'}}>
                                <input 
                                    className='event-modal-eventremote-td-input' 
                                    maxLength={2} 
                                    minLength={2} 
                                    type="text" 
                                    placeholder='--' 
                                    value={eventRemoteTimeH}
                                    onChange={(e) => { setEventRemoteTimeH(e.target.value) }}
                                    onBlur={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/info`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            time: `${eventRemoteTimeH}:${eventRemoteTimeM}`
                                        }) 
                                    }} 
                                />
                                :
                                <input 
                                    className='event-modal-eventremote-td-input' 
                                    maxLength={2} 
                                    minLength={2} 
                                    type="text" 
                                    placeholder='--' 
                                    value={eventRemoteTimeM}
                                    onChange={(e) => { setEventRemoteTimeM(e.target.value) }}
                                    onBlur={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/info`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            time: `${eventRemoteTimeH}:${eventRemoteTimeM}`
                                        }) 
                                    }} 
                                />
                            </span>
                        </div>
                    </div>

                    
                    <button className='event-modal-eventremote-button-openEvent' onClick={ handleOpenEvent }>
                        Открыть миссию
                    </button>
                    <p style={{ color: '#ffffff50', width: '400px', margin: '0px' }}>Отменить действие будет нельзя, придется удалять миссию и создавать заново.</p>
                    <button className='event-modal-eventremote-button-deleteEvent' onClick={ handleDeleteEvent }>
                        Удалить миссию
                    </button>
                </div>




                {/* СЛОТЫ */}
                <div className='event-modal-eventremote-slots-container'>


                    {/* ХЭДЭР */}
                    <div className='event-modal-eventremote-slots-header-container'>
                        <div className='event-modal-eventremote-slots-header'>
                            <h2 className='event-modal-eventremote-slots-header-title' style={{ color: '#C0392B' }}>Красная команда</h2>
                            <div className='event-modal-eventremote-slots-header-decorative-line' style={{ backgroundColor: '#C0392B'}}/>
                            <textarea 
                                maxLength={60} 
                                className='event-modal-eventremote-slots-header-name' 
                                value={eventRemoteTeam1}
                                onChange={(e) => { setEventRemoteTeam1(e.target.value) }}
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team1: eventRemoteTeam1
                                    }) 
                                }} 
                            />
                        </div>
                        <div className='event-modal-eventremote-slots-header'>
                            <h2 className='event-modal-eventremote-slots-header-title' style={{ color: '#0B94E0' }}>Синяя команда</h2>
                            <div className='event-modal-eventremote-slots-header-decorative-line' style={{ backgroundColor: '#0B94E0'}}/>
                            <textarea 
                                maxLength={60} 
                                className='event-modal-eventremote-slots-header-name'
                                value={eventRemoteTeam2}
                                onChange={(e) => { setEventRemoteTeam2(e.target.value) }}
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team2: eventRemoteTeam2
                                    }) 
                                }}     
                            />
                        </div>
                    </div>



                    {/* ГЛАВНЫЙ КОНТЕЙНЕР */}
                    <div className='event-modal-eventremote-main-container'>

                        {/* КОНТЕЙНЕР ЛЕВОЙ КОМАНДЫ */}
                        <div className='event-modal-eventremote-main-team-container' style={{ marginRight: '0px' }}>

                            {/* КОНТЕЙНЕР СЛОТОВ ТЕХНИКИ */}
                            <div className='event-modal-eventremote-main-vehicle-container'>
                                <div className='event-modal-eventremote-team-container'>
                                    { eventRemoteVeh1.map((element, index) => (
                                        <div className='event-modal-eventremote-main-vehicle-slot-container'>
                                            <div className='event-modal-eventremote-main-vehicle-slot-input-container'>
                                                <input type="text" 
                                                    value={element.title}
                                                    onChange={(e) => { 
                                                        setEventRemoteVeh1(prevState => 
                                                            prevState.map((item, i) => 
                                                                i === index ? { ...item, title: e.target.value } : item
                                                            )
                                                        );
                                                    }}
                                                    onBlur={() => { 
                                                        axios.patch(`${host}/api/developer/event/edit/vehicle/`, { 
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            vehId: index,
                                                            team: "Red",
                                                            title: eventRemoteVeh1[index].title
                                                        }) 
                                                    }}
                                                />
                                                <button onClick={() => {
                                                    axios.delete(`${host}/api/developer/event/edit/vehicle/delete`, { 
                                                        data: {
                                                            key: JSON.parse(Cookies.get("userData")).key,
                                                            eventId: modalRemoteEvent.id,
                                                            vehId: index,
                                                            team: "Red"
                                                        }
                                                    }) 

                                                    setEventRemoteVeh1(prevState => prevState.filter((_, i) => i !== index))
                                                }}/>
                                            </div>
                                            <input 
                                                type="text" 
                                                maxLength={2} 
                                                value={element.count}
                                                onChange={(e) => { 
                                                    setEventRemoteVeh1(prevState => 
                                                        prevState.map((item, i) => 
                                                            i === index ? { ...item, count: e.target.value } : item
                                                        )
                                                    );
                                                }}
                                                onBlur={() => { 
                                                    axios.patch(`${host}/api/developer/event/edit/vehicle/`, { 
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        vehId: index,
                                                        team: "Red",
                                                        count: eventRemoteVeh1[index].count
                                                    }) 
                                                }}
                                                />
                                        </div>
                                    ))}
                                    <button className='event-modal-eventremote-main-vehicle-button-newSlot' onClick={() => {
                                        axios.post(`${host}/api/developer/event/edit/vehicle/add`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            team: "Red",
                                        }) 
                                        setEventRemoteVeh1(prevState => [...prevState, {title: 'New Vehicle', count: 1}] );
                                    }}/>
                                </div>
                            </div>

                            {/* Сквады контейнер */}
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', paddingTop: '30px', flexDirection: 'column'}} className='event-modal-eventremote-main-squad-container'>
                                <div className='event-modal-eventremote-kit-container' style={{ marginBottom: '0px' }}>
                                    <input type="text" className='event-modal-eventremote-kit-input' value={'Командир стороны'} />
                                </div>
                                { eventRemoteSlots1.map((element, index) => (
                                    <div className='event-modal-eventremote-squad-container'>
                                        <div className='event-modal-eventremote-squad-header-container'>
                                            <input 
                                                type="text" 
                                                value={element.title}
                                                onChange={(e) => { 
                                                    setEventRemoteSlots1(prevState => 
                                                        prevState.map((item, i) => 
                                                            i === index ? { ...item, title: e.target.value } : item
                                                        )
                                                    )
                                                }}
                                                onBlur={() => { 
                                                    axios.patch(`${host}/api/developer/event/edit/squad/rename`, { 
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        squadId: index+1,
                                                        team: "Red",
                                                        title: element.title
                                                    }) 
                                                }} 
                                            />
                                            <button className='event-modal-eventremote-button-squad-delete' onClick={() => {
                                                axios.delete(`${host}/api/developer/event/edit/squad/delete`, { 
                                                    data: {
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        squadId: index+1,
                                                        team: "Red"
                                                    }
                                                }) 

                                                setEventRemoteSlots1(prevState => prevState.filter((_, i) => i != index))
                                            }} />
                                        </div>
                                        { element.slots.map((element2, index2) => (
                                            <div className='event-modal-eventremote-kit-container'>
                                                <input 
                                                    type="text" 
                                                    className='event-modal-eventremote-kit-input' 
                                                    placeholder='Кит' 
                                                    value={element2.title}
                                                    onChange={(e) => { 
                                                        setEventRemoteSlots1(prevState => { 
                                                            const newState = [...prevState]; 
                                                            newState[index].slots[index2] = { 
                                                                ...newState[index].slots[index2], 
                                                                title: e.target.value 
                                                            }; 
                                                            return newState;
                                                        });
                                                    }}
                                                    onBlur={() => { 
                                                        axios.patch(`${host}/api/developer/event/edit/squad/slots/rename`, { 
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            squadId: index+1,
                                                            slotId: index2,
                                                            team: "Red",
                                                            title: element2.title
                                                        }) 
                                                    }}
                                                />
                                                { index2 != 0 ? <button onClick={() => {
                                                    axios.delete(`${host}/api/developer/event/edit/squad/slots/delete`, { 
                                                        data: {
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            squadId: index+1,
                                                            slotId: index2,
                                                            team: "Red"
                                                        }
                                                    })

                                                    setEventRemoteSlots1(prevState => {
                                                        let newState = [...prevState]
                                                        let newSquad = newState[index]
        
                                                        newSquad.slots = newSquad.slots.filter((_, i) => i != index2)
        
                                                        newState[index] = newSquad
                                                        return newState
                                                    })
                                                }} /> : null }
                                            </div>
                                        ))}
                                        <button className='event-modal-eventremote-newKit' onClick={() => {
                                            axios.post(`${host}/api/developer/event/edit/squad/slots/add`, { 
                                                key: JSON.parse(Cookies.get("userData")).key, 
                                                eventId: modalRemoteEvent.id,  
                                                squadId: index+1,
                                                team: "Red"
                                            })
                                            setEventRemoteSlots1(prevState => {
                                                let newState = [...prevState]
                                                let newSquad = newState[index]

                                                newSquad.slots = [
                                                    ...newSquad.slots,
                                                    {
                                                        SL: false,
                                                        player: null,
                                                        title: 'Riffleman'
                                                    }
                                                ]

                                                newState[index] = newSquad
                                                return newState
                                            })
                                        }}>Добавить слот</button>
                                    </div>
                                ))}
                                <button className='event-modal-eventremote-button-squad-add' onClick={() => {
                                    axios.post(`${host}/api/developer/event/edit/squad/add`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team: "Red"
                                    })

                                    setEventRemoteSlots1(prevState => [...prevState, { title: 'Squad', slots: [{ title: 'Squad Leader', player: null, SL: true }] }])
                                }}>Добавить отделение</button>
                            </div>
                        </div>


                        {/* КОНТЕЙНЕР ПРАВОЙ КОМАНДЫ */}
                        { eventRemoteType == "PVP" ?
                        <div className='event-modal-eventremote-main-team-container'>

                            <div className='event-modal-eventremote-main-vehicle-container'>
                                <div className='event-modal-eventremote-team-container'>
                                    { eventRemoteVeh2.map((element, index) => (
                                        <div className='event-modal-eventremote-main-vehicle-slot-container'>
                                            <div className='event-modal-eventremote-main-vehicle-slot-input-container'>
                                                <input type="text" 
                                                    value={element.title}
                                                    onChange={(e) => { 
                                                        setEventRemoteVeh2(prevState => 
                                                            prevState.map((item, i) => 
                                                                i === index ? { ...item, title: e.target.value } : item
                                                            )
                                                        );
                                                    }}
                                                    onBlur={() => { 
                                                        axios.patch(`${host}/api/developer/event/edit/vehicle/`, { 
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            vehId: index,
                                                            team: "Blue",
                                                            title: eventRemoteVeh2[index].title
                                                        }) 
                                                    }}      
                                                />
                                                <button onClick={() => {
                                                    axios.delete(`${host}/api/developer/event/edit/vehicle/delete`, { 
                                                        data: {
                                                            key: JSON.parse(Cookies.get("userData")).key,
                                                            eventId: modalRemoteEvent.id,
                                                            vehId: index,
                                                            team: "Blue"
                                                        }
                                                    }) 

                                                    setEventRemoteVeh2(prevState => prevState.filter((_, i) => i !== index))
                                                }}/>
                                            </div>
                                            <input 
                                                type="text" 
                                                maxLength={2} 
                                                value={element.count}
                                                onChange={(e) => { 
                                                    setEventRemoteVeh2(prevState => 
                                                        prevState.map((item, i) => 
                                                            i === index ? { ...item, count: e.target.value } : item
                                                        )
                                                    );
                                                }}
                                                onBlur={() => { 
                                                    axios.patch(`${host}/api/developer/event/edit/vehicle/`, { 
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        vehId: index,
                                                        team: "Blue",
                                                        count: eventRemoteVeh2[index].count
                                                    }) 
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <button className='event-modal-eventremote-main-vehicle-button-newSlot' onClick={() => {
                                        axios.post(`${host}/api/developer/event/edit/vehicle/add`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            team: "Blue",
                                        }) 
                                        setEventRemoteVeh2(prevState => [...prevState, {title: 'New Vehicle', count: 1}] );
                                    }}/>
                                </div>
                                
                            </div>

                            <div style={{ position: 'relative', left: '15px', width: '100%', display: 'flex', alignItems: 'center', paddingTop: '30px', flexDirection: 'column'}} className='event-modal-eventremote-main-squad-container'>
                                <div className='event-modal-eventremote-kit-container' style={{ marginBottom: '0px' }}>
                                    <input type="text" className='event-modal-eventremote-kit-input' value={'Командир стороны'} />
                                </div>
                                { eventRemoteSlots2.map((element, index) => (
                                    <div className='event-modal-eventremote-squad-container'>
                                        <div className='event-modal-eventremote-squad-header-container'>
                                            <input 
                                                type="text" 
                                                value={element.title}
                                                onChange={(e) => { 
                                                    setEventRemoteSlots2(prevState => 
                                                        prevState.map((item, i) => 
                                                            i === index ? { ...item, title: e.target.value } : item
                                                        )
                                                    )
                                                }}
                                                onBlur={() => { 
                                                    axios.patch(`${host}/api/developer/event/edit/squad/rename`, { 
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        squadId: index+1,
                                                        team: "Blue",
                                                        title: element.title
                                                    }) 
                                                }} 
                                            />
                                            <button className='event-modal-eventremote-button-squad-delete' onClick={() => {
                                                axios.delete(`${host}/api/developer/event/edit/squad/delete`, { 
                                                    data: {
                                                        key: JSON.parse(Cookies.get("userData")).key, 
                                                        eventId: modalRemoteEvent.id,  
                                                        squadId: index+1,
                                                        team: "Blue"
                                                    }
                                                }) 

                                                setEventRemoteSlots2(prevState => prevState.filter((_, i) => i != index))
                                            }} />
                                        </div>
                                        { element.slots.map((element2, index2) => (
                                            <div className='event-modal-eventremote-kit-container'>
                                                <input 
                                                    type="text" 
                                                    className='event-modal-eventremote-kit-input' 
                                                    placeholder='Кит' 
                                                    value={element2.title}
                                                    onChange={(e) => { 
                                                        setEventRemoteSlots2(prevState => { 
                                                            const newState = [...prevState]; 
                                                            newState[index].slots[index2] = { 
                                                                ...newState[index].slots[index2], 
                                                                title: e.target.value 
                                                            }; 
                                                            return newState;
                                                        });
                                                    }}
                                                    onBlur={() => { 
                                                        axios.patch(`${host}/api/developer/event/edit/squad/slots/rename`, { 
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            squadId: index+1,
                                                            slotId: index2,
                                                            team: "Blue",
                                                            title: element2.title
                                                        }) 
                                                    }}
                                                />
                                                { index2 != 0 ? <button onClick={() => {
                                                    axios.delete(`${host}/api/developer/event/edit/squad/slots/delete`, { 
                                                        data: {
                                                            key: JSON.parse(Cookies.get("userData")).key, 
                                                            eventId: modalRemoteEvent.id,  
                                                            squadId: index+1,
                                                            slotId: index2,
                                                            team: "Blue"
                                                        }
                                                    })

                                                    setEventRemoteSlots2(prevState => {
                                                        let newState = [...prevState]
                                                        let newSquad = newState[index]
        
                                                        newSquad.slots = newSquad.slots.filter((_, i) => i != index2)
        
                                                        newState[index] = newSquad
                                                        return newState
                                                    })
                                                }} /> : null }
                                            </div>
                                        ))}
                                        <button className='event-modal-eventremote-newKit' onClick={() => {
                                            axios.post(`${host}/api/developer/event/edit/squad/slots/add`, { 
                                                key: JSON.parse(Cookies.get("userData")).key, 
                                                eventId: modalRemoteEvent.id,  
                                                squadId: index+1,
                                                team: "Blue"
                                            })
                                            setEventRemoteSlots2(prevState => {
                                                let newState = [...prevState]
                                                let newSquad = newState[index]

                                                newSquad.slots = [
                                                    ...newSquad.slots,
                                                    {
                                                        SL: false,
                                                        player: null,
                                                        title: 'Riffleman'
                                                    }
                                                ]

                                                newState[index] = newSquad
                                                return newState
                                            })
                                        }}>Добавить слот</button>
                                    </div>
                                ))}
                                <button className='event-modal-eventremote-button-squad-add' onClick={() => {
                                    axios.post(`${host}/api/developer/event/edit/squad/add`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team: "Blue"
                                    })

                                    setEventRemoteSlots2(prevState => [...prevState, { title: 'Squad', slots: [{ title: 'Squad Leader', player: null, SL: true }] }])
                                }}>Добавить отделение</button>
                                <button 
                                    onClick={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/type`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            isPvpOn: false
                                        }) 

                                        setEventRemoteType("PVE") 
                                    }} 
                                    className='event-modal-eventremote-button-pvpon' 
                                    style={{ marginTop: '0px', position: 'relative', left: '15px' }}
                                >
                                    Выключить 2ую сторону
                                </button>
                            </div>
                        </div>
                        : // Сменить тип игры
                        <div style={{ width: '340px', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                onClick={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/type`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        isPvpOn: true
                                    }) 

                                    setEventRemoteType("PVP") 
                                }} 
                                className='event-modal-eventremote-button-pvpon'
                            >
                                Включить 2ую сторону
                            </button>
                        </div> }



                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalEventRemote;
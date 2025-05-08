import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

import Vehicle from './eventRemote/vehicle';
import Squad from './eventRemote/squad';

import './Style/modalEventRemote.css'
import { faDownload, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';

const ModalEventRemote = ({ host, setIsModalEventRemote, isModalEventRemote, modalRemoteEvent, setErrorMessage, isDevBranch, setModalRemoteEvent }) => {
    const [eventRemoteIsImg, setEventRemoteIsImg] = useState(false)
    const [eventRemoteIsMod, setEventRemoteIsMod] = useState(false)

    // M1 - New
    const [settingConfig, setSettingConfig] = useState({
        title: '',
        metar: '',
        desc: '',
        date: '',
        timeM: '',
        timeH: '',
        redTeam: '',
        blueTeam: '',
        type: 'PVE',
        vehicle: [[], []],
        slots: [[], []]
    })

    const settingsChange = (key, value) => {
        try {
            const keyWhiteList = ['title', 'metar', 'desc', 'date', 'timeM', 'timeH', 'redTeam', 'blueTeam', 'type']
            if(!keyWhiteList.some(obj => obj === key)) return console.error('settingsChange error: unknown key value')

            setSettingConfig(prev => ({...prev, [key]: value}))
        } catch (e) {
            console.error(`settingsChange error: ${e}`)
        }
    }

    const settingsKitsChange = (key, index, value) => {
        try {
            const keyWhiteList = ['vehicle', 'slots']
            if(!keyWhiteList.some(obj => obj === key)) return console.error('settingsChange error: unknown key value')
        
            setSettingConfig(prev => ({
                ...prev, 
                [key]: [
                    index === 0 ? value : prev[key][0], 
                    index === 1 ? value : prev[key][1]
                ]
            }))
        } catch (e) {
            console.error(`settingsKitsChange error: ${e}`)
        }
    }

    useEffect(() => {
        setSettingConfig(prev => ({
            ...prev,
            title: modalRemoteEvent.title,
            metar: modalRemoteEvent.metar,
            desc: modalRemoteEvent.description,
            date: modalRemoteEvent.date,
            redTeam: modalRemoteEvent.team1,
            blueTeam: modalRemoteEvent.team2,
            type: modalRemoteEvent.type
        }))


        if(modalRemoteEvent.time) {
            const [hours, minutes] = modalRemoteEvent.time.split(":")
            settingsChange('timeM', minutes)
            settingsChange('timeH', hours)
        }



        // Veh team 1 array check
        if (modalRemoteEvent.vehTeam1 && typeof modalRemoteEvent.vehTeam1 === "string") {
            const parsedData = JSON.parse(modalRemoteEvent.vehTeam1);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                settingsKitsChange('vehicle', 0, parsedData)
            }
        } else if(modalRemoteEvent.vehTeam1 && Array.isArray(modalRemoteEvent.vehTeam1)) {
            settingsKitsChange('vehicle', 0, modalRemoteEvent.vehTeam1)
        }
        
        // Veh team 2 array check
        if (modalRemoteEvent.vehTeam2 && typeof modalRemoteEvent.vehTeam2 === "string") {
            const parsedData = JSON.parse(modalRemoteEvent.vehTeam2);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                settingsKitsChange('vehicle', 1, parsedData)
            }
        } else if(modalRemoteEvent.vehTeam2 && Array.isArray(modalRemoteEvent.vehTeam2)) {
            settingsKitsChange('vehicle', 1, modalRemoteEvent.vehTeam2)
        }
        



        if(modalRemoteEvent.slotsTeam1) {
            const tempSlots = modalRemoteEvent.slotsTeam1.filter((_, i) => i != 0)
            settingsKitsChange('slots', 0, tempSlots)
        }
        if(modalRemoteEvent.slotsTeam2) {
            const tempSlots = modalRemoteEvent.slotsTeam2.filter((_, i) => i != 0)
            settingsKitsChange('slots', 1, tempSlots)
        }
    }, [modalRemoteEvent])


    const handleOpenEvent = async () => {
        if(window.confirm('Вы уверены, что хотите открыть событие?')){
            const res = await axios.post(`${host}/api/developer/event/edit/status/open`, {
                eventId: modalRemoteEvent.id,
                key: JSON.parse(Cookies.get("userData")).key,
                devBranch: isDevBranch
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
            } else {
                setEventRemoteIsImg(true)
            }
        }
    }


    const eventRemoteModChange = async (e) => {
        const file = e.target.files[0]

        if(file) {
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
            } else {
                setEventRemoteIsMod(true)
            }
        }
    }

    const handleNewSquad = (teamIndex) => {
        axios.post(`${host}/api/developer/event/edit/squad/add`, { 
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            team: teamIndex === 0 ? "Red" : "Blue",
        })

        settingsKitsChange('slots', teamIndex, [
            ...settingConfig.slots[teamIndex], { 
                title: 'Squad', 
                slots: [
                    { 
                        title: 'Squad Leader', 
                        player: null, 
                        SL: true 
                    }
                ] 
            }
        ])
    }

    const selectHQ = async (teamIndex, squadIndex) => {
        setSettingConfig(prev => {
            const updatedTeamSlots = prev.slots[teamIndex].map((squad, i) => ({
                ...squad,
                hq: i === squadIndex ? !squad.hq : false
            }));
    
            const updatedSlots = [...prev.slots];
            updatedSlots[teamIndex] = updatedTeamSlots;

            return {
                ...prev,
                slots: updatedSlots
            };
        });

        const res = await axios.patch(`${host}/api/developer/event/edit/squad/setHQ`, {
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,
            squadId: squadIndex + 1,
            team: teamIndex === 0 ? 'Red' : 'Blue',
            isHQ: !settingConfig.slots[teamIndex][squadIndex].hq
        })

        if(res.data.status != 200) {
            setErrorMessage(res.data.err)
            setTimeout(() => setErrorMessage(""), 3000)
        }
    };

    const handleSaveImport = async (e) => {
        const file = e.target.files[0]

        if(file) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("key", JSON.parse(Cookies.get("userData")).key)
            formData.append("eventId", modalRemoteEvent.id)

            const res = await axios.post(`${host}/api/developer/event/edit/saveUpload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            if(res.data.status != 200) {
                setErrorMessage(res.data.err)
                setTimeout(() => {setErrorMessage("")}, 3000)
            } else {
                const res = await axios.get(`${host}/api/developer/event/data/all`)

                const event = res.data.container.filter(event => event.id === modalRemoteEvent.id)[0]

                // Veh team 1 array check
                if (event.vehTeam1 && typeof event.vehTeam1 === "string") {
                    const parsedData = JSON.parse(event.vehTeam1);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        settingsKitsChange('vehicle', 0, parsedData)
                    }
                } else if(event.vehTeam1 && Array.isArray(event.vehTeam1)) {
                    settingsKitsChange('vehicle', 0, event.vehTeam1)
                }
                
                // Veh team 2 array check
                if (event.vehTeam2 && typeof event.vehTeam2 === "string") {
                    const parsedData = JSON.parse(event.vehTeam2);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        settingsKitsChange('vehicle', 1, parsedData)
                    }
                } else if(event.vehTeam2 && Array.isArray(event.vehTeam2)) {
                    settingsKitsChange('vehicle', 1, event.vehTeam2)
                }

                if(event.slotsTeam1) {
                    const tempSlots = event.slotsTeam1.filter((_, i) => i != 0)
                    settingsKitsChange('slots', 0, tempSlots)
                }
                if(event.slotsTeam2) {
                    const tempSlots = event.slotsTeam2.filter((_, i) => i != 0)
                    settingsKitsChange('slots', 1, tempSlots)
                }
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
                                title: settingConfig.title
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-title' 
                        placeholder='Название миссии'
                        onChange={(e) => { settingsChange('title', e.target.value) }} 
                        value={settingConfig.title}
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
                                metar: settingConfig.metar
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-metar' 
                        placeholder='Погодные условия и рельеф'
                        onChange={(e) => { settingsChange('metar', e.target.value) }} 
                        value={settingConfig.metar}
                        maxLength={40}
                    />


                    <textarea
                        onBlur={() => { 
                            axios.patch(`${host}/api/developer/event/edit/info`, { 
                                key: JSON.parse(Cookies.get("userData")).key, 
                                eventId: modalRemoteEvent.id,  
                                description: settingConfig.desc
                            }) 
                        }} 
                        type="text" 
                        className='event-modal-eventremote-info-description' 
                        placeholder='Описание'
                        onChange={(e) => { settingsChange('desc', e.target.value) }} 
                        value={settingConfig.desc}
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
                                onChange={(e) => { settingsChange('date', e.target.value) }}
                                value={ settingConfig.date }
                                placeholder='дд.мм.гг'
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        date: settingConfig.title
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
                                    value={settingConfig.timeH}
                                    onChange={(e) => { settingsChange('timeH', e.target.value) }}
                                    onBlur={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/info`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            time: `${settingConfig.timeH}:${settingConfig.timeM}`
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
                                    value={settingConfig.timeM}
                                    onChange={(e) => { settingsChange('timeM', e.target.value) }}
                                    onBlur={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/info`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            time: `${settingConfig.timeH}:${settingConfig.timeM}`
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
                    <div style={{ display: 'flex', marginTop: '40px' }}>
                        <button className='event-modal-eventremote-button-deleteEvent' onClick={ handleDeleteEvent }>
                            Удалить миссию
                        </button>

                        <input 
                            type="file" 
                            accept=".json" 
                            className='event-modal-eventremote-inputfile' 
                            id='event-modal-eventremote-inputfile-saveimport' 
                            onChange={ (e) => handleSaveImport(e) } 
                            style={{ display: 'none' }}
                        />
                        <a style={{ textDecoration: 'none' }} htmlFor='event-modal-eventremote-inputfile-saveexport' className='event-modal-eventremote-button-save' href={ `${host}/api/developer/event/edit/data/download/save/${modalRemoteEvent.id}` }>
                            <div className='event-reglist-contextmenu-icon-container'>
                                <FontAwesomeIcon icon={faDownload} />
                            </div>
                            Экспорт
                        </a>
                        <label htmlFor='event-modal-eventremote-inputfile-saveimport' className='event-modal-eventremote-button-save'>
                            <div className='event-reglist-contextmenu-icon-container'>
                            <FontAwesomeIcon icon={faFileArrowUp} />
                            </div>
                            Импорт
                        </label>
                    </div>
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
                                placeholder='Красная команда'
                                value={settingConfig.redTeam}
                                onChange={(e) => { settingsChange('redTeam', e.target.value) }}
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team1: settingConfig.redTeam
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
                                placeholder='Синяя команда'
                                value={settingConfig.blueTeam}
                                onChange={(e) => { settingsChange('blueTeam', e.target.value) }}
                                onBlur={() => { 
                                    axios.patch(`${host}/api/developer/event/edit/info`, { 
                                        key: JSON.parse(Cookies.get("userData")).key, 
                                        eventId: modalRemoteEvent.id,  
                                        team2: settingConfig.blueTeam
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
                                    { settingConfig.vehicle[0].map((element, index) => (
                                        <Vehicle 
                                            vehItem={element} 
                                            vehIndex={index} 
                                            settingsKitsChange={settingsKitsChange} 
                                            settingConfig={settingConfig} 
                                            teamIndex={0} 
                                            modalRemoteEvent={modalRemoteEvent} 
                                            host={host}
                                        />
                                    ))}
                                    <button className='event-modal-eventremote-main-vehicle-button-newSlot' onClick={() => {
                                        axios.post(`${host}/api/developer/event/edit/vehicle/add`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            team: "Red",
                                        }) 

                                        settingsKitsChange('vehicle', 0, [ ...settingConfig.vehicle[0], { title: 'New Vehicle', count: 1 } ])
                                    }}/>
                                </div>
                            </div>

                            {/* Сквады контейнер */}
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', paddingTop: '30px', flexDirection: 'column'}} className='event-modal-eventremote-main-squad-container'>
                                <div className='event-modal-eventremote-kit-container' style={{ marginBottom: '0px' }}>
                                    <input type="text" className='event-modal-eventremote-kit-input' value={'Командир стороны'} />
                                </div>
                                {Array.isArray(settingConfig.slots[0]) &&
                                    settingConfig.slots[0].map((element, index) => (
                                        <Squad
                                            squadItem={element}
                                            squadIndex={index}
                                            settingsKitsChange={settingsKitsChange}
                                            settingConfig={settingConfig}
                                            teamIndex={0}
                                            modalRemoteEvent={modalRemoteEvent}
                                            host={host}
                                            selectHQ={selectHQ}
                                        />
                                ))}
                                <button className='event-modal-eventremote-button-squad-add' onClick={() => { handleNewSquad(0) }}>Добавить отделение</button>
                            </div>
                        </div>


                        {/* КОНТЕЙНЕР ПРАВОЙ КОМАНДЫ */}
                        { settingConfig.type == "PVP" ?
                        <div className='event-modal-eventremote-main-team-container'>

                            <div className='event-modal-eventremote-main-vehicle-container'>
                                <div className='event-modal-eventremote-team-container'>
                                    { settingConfig.vehicle[1].map((element, index) => (
                                        <Vehicle 
                                            vehItem={element} 
                                            vehIndex={index} 
                                            settingsKitsChange={settingsKitsChange} 
                                            settingConfig={settingConfig} 
                                            teamIndex={1} 
                                            modalRemoteEvent={modalRemoteEvent} 
                                            host={host}
                                        />
                                    ))}
                                    <button className='event-modal-eventremote-main-vehicle-button-newSlot' onClick={() => {
                                        axios.post(`${host}/api/developer/event/edit/vehicle/add`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            team: "Blue",
                                        }) 

                                        settingsKitsChange('vehicle', 1, [ ...settingConfig.vehicle[1], { title: 'New Vehicle', count: 1 } ])
                                    }}/>
                                </div>
                                
                            </div>

                            <div style={{ position: 'relative', left: '15px', width: '100%', display: 'flex', alignItems: 'center', paddingTop: '30px', flexDirection: 'column'}} className='event-modal-eventremote-main-squad-container'>
                                <div className='event-modal-eventremote-kit-container' style={{ marginBottom: '0px' }}>
                                    <input type="text" className='event-modal-eventremote-kit-input' value={'Командир стороны'} />
                                </div>
                                {Array.isArray(settingConfig.slots[1]) &&
                                    settingConfig.slots[1].map((element, index) => (
                                        <Squad
                                            squadItem={element}
                                            squadIndex={index}
                                            settingsKitsChange={settingsKitsChange}
                                            settingConfig={settingConfig}
                                            teamIndex={1}
                                            modalRemoteEvent={modalRemoteEvent}
                                            host={host}
                                            selectHQ={selectHQ}
                                        />
                                ))}
                                <button className='event-modal-eventremote-button-squad-add' onClick={ () => handleNewSquad(1) }>Добавить отделение</button>
                                <button 
                                    onClick={() => { 
                                        axios.patch(`${host}/api/developer/event/edit/type`, { 
                                            key: JSON.parse(Cookies.get("userData")).key, 
                                            eventId: modalRemoteEvent.id,  
                                            isPvpOn: false
                                        }) 

                                        settingsChange('type', 'PVE') 
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

                                    settingsChange('type', 'PVP') 
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
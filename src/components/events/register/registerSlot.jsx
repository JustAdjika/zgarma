import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const RegisterSlot = ({ slotItem, mapData, setTeam, setSquad, setSlot, team, squad, slot, host, handleLoadChange, slotsOriginal, setErrorMessage, isCMDtype }) => {

    const [title, setTitle] = useState('')
    const [registeredUser, setRegisteredUser] = useState(null)

    const blockedStyle = {
        color: '#000000',
        cursor: 'not-allowed',
        borderColor: '#C0392B',
        backgroundColor: '#D9D9D9'
    }
    const classicStyle = {
        color: '#000000a1',
        cursor: 'pointer',
        borderColor: '#30762D',
        backgroundColor: '#D9D9D9'
    }
    const selectedStyle = {
        color: '#000000a1',
        cursor: 'pointer',
        borderColor: '#066DA7',
        backgroundColor: '#153B51'
    }

    const [currentStyle, setCurrentStyle] = useState(selectedStyle)

    useEffect(() => {
        if(!slotItem) return

        // Функция назначения registeredUser
        const getRegUser = async (id) => {
            if(!id) return

            handleLoadChange(true)
            const res = await axios.get(`${host}/api/developer/account/data/id?id=${id}`)

            if(res.data.status == 200) {
                setTitle(res.data.container.steam.personaname)
                handleLoadChange(false)
            } else {
                setTimeout(() => setErrorMessage(res.data.err), 3000)
                handleLoadChange(false)
            }
        }
        
        // Назначение заголовка слота в зависимости от типа
        if(isCMDtype) {
            if(slotsOriginal[0].length === 0) return

            if(slotsOriginal[mapData.team][0].player) {
                getRegUser(slotsOriginal[mapData.team][0].player)
                    
                setIsKitOccupied(true)
            } else {
                setTitle(slotsOriginal[mapData.team][0].title)
                setIsKitOccupied(false)
            }
        } else {
            if(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player) {
                getRegUser(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player)

                setIsKitOccupied(true)
            } else {
                setTitle(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].title)
                setIsKitOccupied(false)
            }
        }



    }, [slotItem])


    const updateStyle = () => {
        // Назначение стилей слота в зависимости от типа и условий
        if(isCMDtype) {
            if(slotsOriginal[0].length === 0) return

            if(slotsOriginal[mapData.team][0].player) {
                setCurrentStyle(blockedStyle)
            } else {
                if(squad === 0 && team === mapData.team) {
                    setCurrentStyle(selectedStyle)
                } else {
                    setCurrentStyle(classicStyle)
                }
            }
        } else {
            if(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player) {
                setCurrentStyle(blockedStyle)
            } else {
                if(slot === mapData.slotIndex && squad === mapData.squadIndex+1 && team === mapData.team) {
                    setCurrentStyle(selectedStyle)
                } else {
                    setCurrentStyle(classicStyle)
                }
            }
        }
    }

    useEffect(() => {
        if(!slotItem) return

        updateStyle()
    }, [team, squad, slot, slotsOriginal])

    const handleSelectSlot = () => {
        if(isCMDtype) {
            if(!slotsOriginal[mapData.team][0].player) {
                setTeam(mapData.team)
                setSquad(0)
                setSlot(0)

                updateStyle()
            }
        } else {
            if(!slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player) {
                setTeam(mapData.team)
                setSquad(mapData.squadIndex+1)
                setSlot(mapData.slotIndex)

                updateStyle()
            }
        }
    }

    const [kitTooltip, setKitTooltip] = useState(false)
    const [isKitOccupied, setIsKitOccupied] = useState(false)
    const timerRef = useRef(null)

    const handleMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setKitTooltip(true)
        }, 550)
    }

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setKitTooltip(false);
    }

    return (
        <div style={{ position: 'relative', marginTop: isCMDtype ? '20px' : '0px' }}>
            <div
                onMouseEnter={ isKitOccupied ? handleMouseEnter : null } 
                onMouseLeave={ handleMouseLeave } 
            >
                <button 
                    onClick={ handleSelectSlot } 
                    className='event-modal-eventreg-slot-container'
                    style={ currentStyle }
                >
                    {/* { title } */}
                    <span>DSASAFOPSJAOPFSASDSADSADASDSADSAA</span>
                    {/* <div className='event-modal-eventreg-slot-marker msl'>MSL</div> */}
                </button>
            </div>
            <div className={`event-modal-eventreg-slot-tooltip${ mapData.team === 0 ? '' : '2' } ${kitTooltip ? 'visible' : ''}`}>
                { slotItem.title }
            </div>
        </div>
    );
};

export default RegisterSlot;
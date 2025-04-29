import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const RegisterSlot = ({ slotItem, mapData, setTeam, setSquad, setSlot, team, squad, slot, host, handleLoadChange, slotsOriginal, setErrorMessage, isCMDtype, eventid, handleContextMenu }) => {

    const [title, setTitle] = useState('')
    const [registeredUser, setRegisteredUser] = useState(null)
    const [MTL, setMTL] = useState(false)
    const [MSL, setMSL] = useState(false)
    const [BTH, setBTH] = useState(false)

    const [isCurrentUser, setIsCurrentUser] = useState(false)

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

        const getMarkers = async (playerid) => {
            handleLoadChange(true)
            const res = await axios.get(`${host}/api/developer/event/request/data/accepted/id?id=${eventid}`)

            if(res.data.status == 200) {
                const playerRequestData = res.data.container.filter(item => item.userId === playerid )
                
                if(playerRequestData.length === 0) return handleLoadChange(false)

                if(playerRequestData[0].maybeTL && playerRequestData[0].maybeSL) setBTH(true)
                else if(playerRequestData[0].maybeTL) setMTL(true)
                else if(playerRequestData[0].maybeSL) setMSL(true)
                
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
                getMarkers(slotsOriginal[mapData.team][0].player)

                setIsCurrentUser(slotsOriginal[mapData.team][0].player === JSON.parse(Cookies.get('userData')).id)
                    
                setIsKitOccupied(true)
            } else {
                setTitle(slotsOriginal[mapData.team][0].title)
                setIsKitOccupied(false)
            }
        } else {
            if(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player) {
                getRegUser(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player)
                getMarkers(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player)

                setIsCurrentUser(slotsOriginal[mapData.team][mapData.squadIndex].slots[mapData.slotIndex].player === JSON.parse(Cookies.get('userData')).id)

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
        <div style={{ position: 'relative', marginTop: isCMDtype ? '20px' : '0px' }} onContextMenu={isCurrentUser ? handleContextMenu : null}>
            <div
                onMouseEnter={ isKitOccupied ? handleMouseEnter : null } 
                onMouseLeave={ handleMouseLeave } 
            >
                <button 
                    onClick={ handleSelectSlot } 
                    className='event-modal-eventreg-slot-container'
                    style={ {...currentStyle, cursor: isCurrentUser ? 'pointer' : currentStyle.cursor } }
                >
                    { title }
                    <div style={{ display: BTH || MTL || MSL ? 'flex' : 'none' }} className={`event-modal-eventreg-slot-marker ${ BTH ? 'bth' : MTL ? 'mtl' : MSL ? 'msl' : '' }`}>{ BTH ? 'BTH' : MTL ? 'MTL' : MSL ? 'MSL' : '' }</div>
                </button>
            </div>
            <div className={`event-modal-eventreg-slot-tooltip${ mapData.team === 0 ? '' : '2' } ${kitTooltip ? 'visible' : ''}`}>
                { slotItem.title }
            </div>
        </div>
    );
};

export default RegisterSlot;
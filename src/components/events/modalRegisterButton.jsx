import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './Style/modalRegister.css'
import '../../pages/Style/fonts.css'

const ModalRegisterButton = ({ butType, setTeam, setSquad, setSlot, slotsOriginal, squadIndex, squadItem, slotIndex, slotItem, slot, team, squad, host, handleLoadChange }) => {

    const [registeredUsername, setRegisteredUsername] = useState('')

    const getUsername = async () => {
        let id
        if(butType == "SL_red") id = slotsOriginal[squadIndex].slots[0].player 
        if(butType == "red") id = slotsOriginal[squadIndex].slots[slotIndex].player
        if(butType == "SL_blue") id = slotsOriginal[squadIndex].slots[0].player
        if(butType == "blue") id = slotsOriginal[squadIndex].slots[slotIndex].player
        if(butType == "CMD_red" || butType == "CMD_blue") id = slotsOriginal.player 
        
        if(id == null) return setIsKitOccupied(false)

        handleLoadChange(true)

        const res = await axios.get(`${host}/api/developer/account/data/id?id=${id}`)

        if(res.data.status == 200) {
            setIsKitOccupied(true)
            const tempData = res.data.container.steam
            setRegisteredUsername(tempData.personaname)

            handleLoadChange(false)
        } else {
            console.error(res.data.err)
            handleLoadChange(false)
        }
    }

    useEffect(() => {
        getUsername()
    }, [slotsOriginal])


    const [kitTooltip, setKitTooltip] = useState(false)
    const [isKitOccupied, setIsKitOccupied] = useState(false)
    const timerRef = useRef(null)

    const handleButtonAcceptMouseEnter = () => {
        timerRef.current = setTimeout(() => {
            setKitTooltip(true)
        }, 550)
    }

    const handleButtonAcceptMouseLeave = () => {
        clearTimeout(timerRef.current);
        setKitTooltip(false);
    }

    
    if(butType == 'SL_red') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        onClick={() => { 
                            if(slotsOriginal[squadIndex].slots[0].player == null) {
                                setTeam(0); 
                                setSquad(squadIndex); 
                                setSlot('SL') 
                            }
                        }} 
                        className='event-modal-eventreg-slot-container'
                        style={{
                            color: slotsOriginal[squadIndex].slots[0].player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal[squadIndex].slots[0].player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal[squadIndex].slots[0].player != null ? '#C0392B' : slot == 'SL' && team == 0 && squad == squadIndex ? '#066DA7' : '#30762D',
                            backgroundColor: slot == 'SL' && team == 0 && squad == squadIndex ? '#153B51' : '#D9D9D9'
                        }}
                    >
                        { slotsOriginal[squadIndex].slots[0].player == null ? slotItem.title : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip ${kitTooltip ? 'visible' : ''}`}>
                    { slotItem.title }
                </div>
            </div>
        );
    }
    if(butType == 'red') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        onClick={() => { 
                            if(slotsOriginal[squadIndex].slots[slotIndex].player == null) {
                                setTeam(0); 
                                setSquad(squadIndex); 
                                setSlot(slotIndex)
                            }
                        }} 
                        style={{
                            color: slotsOriginal[squadIndex].slots[slotIndex].player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal[squadIndex].slots[slotIndex].player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal[squadIndex].slots[slotIndex].player != null ? '#C0392B' : slot == slotIndex && team == 0 && squad == squadIndex ? '#066DA7' : '#30762D',
                            backgroundColor: slot == slotIndex && team == 0 && squad == squadIndex ? '#153B51' : '#D9D9D9'
                        }}
                        className='event-modal-eventreg-slot-container'
                    >
                        { slotsOriginal[squadIndex].slots[slotIndex].player == null ? slotItem.title : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip ${kitTooltip ? 'visible' : ''}`}>
                    { slotItem.title }
                </div>
            </div>
        )
    }
    if(butType == 'SL_blue') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        onClick={() => { 
                            if(slotsOriginal[squadIndex].slots[0].player == null) {
                                setTeam(1); 
                                setSquad(squadIndex); 
                                setSlot('SL') 
                            }
                        }} 
                        className='event-modal-eventreg-slot-container'
                        style={{
                            color: slotsOriginal[squadIndex].slots[0].player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal[squadIndex].slots[0].player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal[squadIndex].slots[0].player != null ? '#C0392B' : slot == 'SL' && team == 1 && squad == squadIndex ? '#066DA7' : '#30762D',
                            backgroundColor: slot == 'SL' && team == 1 && squad == squadIndex ? '#153B51' : '#D9D9D9'
                        }}
                    >
                        { slotsOriginal[squadIndex].slots[0].player == null ? slotItem.title : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip2 ${kitTooltip ? 'visible' : ''}`}>
                    { slotItem.title }
                </div>
            </div>
        )
    }
    if(butType == 'blue') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        onClick={() => { 
                            if(slotsOriginal[squadIndex].slots[slotIndex].player == null) {
                                setTeam(1); 
                                setSquad(squadIndex); 
                                setSlot(slotIndex) 
                            }
                        }} 
                        className='event-modal-eventreg-slot-container'
                        style={{
                            color: slotsOriginal[squadIndex].slots[slotIndex].player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal[squadIndex].slots[slotIndex].player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal[squadIndex].slots[slotIndex].player != null ? '#C0392B' : slot == slotIndex && team == 1 && squad == squadIndex ? '#066DA7' : '#30762D',
                            backgroundColor: slot == slotIndex && team == 1 && squad == squadIndex ? '#153B51' : '#D9D9D9'
                        }}
                    >
                        { slotsOriginal[squadIndex].slots[slotIndex].player == null ? slotItem.title : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip2 ${kitTooltip ? 'visible' : ''}`}>
                    { slotItem.title }
                </div>
            </div>
        )
    }
    if(butType == 'CMD_red') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        className='event-modal-eventreg-slot-container' 
                        style={{ 
                            marginTop: '20px', 
                            color: slotsOriginal.player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal.player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal.player != null ? '#C0392B' : slot == 'CMD' && team == 0 ? '#066DA7' : '#30762D',
                            backgroundColor: slot == 'CMD' && team == 0 ? '#153B51' : '#D9D9D9'
                        }} 
                        onClick={ () => { 
                            if(slotsOriginal.player == null) {
                                setTeam(0)
                                setSlot('CMD') 
                            }
                        }}
                    >
                        { slotsOriginal.player == null ? 'Командир стороны' : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip ${kitTooltip ? 'visible' : ''}`}>
                    { 'Командир стороны' }
                </div>
            </div>
        )
    }
    if(butType == 'CMD_blue') {
        return (
            <div style={{ position: 'relative' }}>
                <div
                    onMouseEnter={ isKitOccupied ? handleButtonAcceptMouseEnter : null } 
                    onMouseLeave={ handleButtonAcceptMouseLeave } 
                >
                    <button 
                        className='event-modal-eventreg-slot-container' 
                        style={{ 
                            marginTop: '20px', 
                            color: slotsOriginal.player == null ? '#000000a1' : '#000000',
                            cursor: slotsOriginal.player == null ? 'pointer' : 'not-allowed',
                            borderColor: slotsOriginal.player != null ? '#C0392B' : slot == 'CMD' && team == 1 ? '#066DA7' : '#30762D',
                            backgroundColor: slot == 'CMD' && team == 1 ? '#153B51' : '#D9D9D9'
                        }}  
                        onClick={ () => { 
                            if(slotsOriginal.player == null) {
                                setTeam(1)
                                setSlot('CMD') 
                            }
                        }}
                    >
                        { slotsOriginal.player == null ? 'Командир стороны' : registeredUsername }
                    </button>
                </div>
                <div className={`event-modal-eventreg-slot-tooltip2 ${kitTooltip ? 'visible' : ''}`}>
                    { 'Командир стороны' }
                </div>
            </div>
        )
    }
};

export default ModalRegisterButton;
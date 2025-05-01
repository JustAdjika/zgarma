import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import Slot from './slot';

const Squad = ({ squadItem, squadIndex, settingsKitsChange, settingConfig, teamIndex, modalRemoteEvent, host }) => {
    const onChange = (e) => {
        const slotsArray = settingConfig.slots[teamIndex]

        slotsArray[squadIndex].title = e.target.value

        settingsKitsChange('slots', teamIndex, slotsArray)
    }

    const onBlur = () => {
        axios.patch(`${host}/api/developer/event/edit/squad/rename`, { 
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            squadId: squadIndex+1,
            team: teamIndex === 0 ? "Red" : "Blue",
            title: squadItem.title
        }) 
    }

    const handleDelete = () => {
        axios.delete(`${host}/api/developer/event/edit/squad/delete`, { 
            data: {
                key: JSON.parse(Cookies.get("userData")).key, 
                eventId: modalRemoteEvent.id,  
                squadId: squadIndex+1,
                team: teamIndex === 0 ? "Red" : "Blue",
            }
        }) 

        settingsKitsChange('slots', teamIndex, settingConfig.slots[teamIndex].filter((_, i) => i !== squadIndex))
    }

    const handleNewSlot = () => {
        axios.post(`${host}/api/developer/event/edit/squad/slots/add`, { 
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            squadId: squadIndex+1,
            team: teamIndex === 0 ? "Red" : "Blue",
        })

        let newState = [...settingConfig.slots[teamIndex]]
        let newSquad = newState[squadIndex]

        newSquad.slots = [
            ...newSquad.slots,
            {
                SL: false,
                player: null,
                title: 'Riffleman'
            }
        ]

        newState[squadIndex] = newSquad

        settingsKitsChange('slots', teamIndex, newState)
    }

    return (
        <div className='event-modal-eventremote-squad-container'>
            <div className='event-modal-eventremote-squad-header-container'>
                <input 
                    type="text" 
                    value={squadItem.title}
                    onChange={(e) => onChange(e)}
                    onBlur={ onBlur } 
                />
                <div className='event-modal-eventremote-button-hqTurn'>CMD</div>
                <button className='event-modal-eventremote-button-squad-delete' onClick={ handleDelete } />
            </div>
            { squadItem.slots.map((element, index) => (
                <Slot
                    squadIndex={squadIndex} 
                    slotItem={element} 
                    slotIndex={index} 
                    settingsKitsChange={settingsKitsChange} 
                    settingConfig={settingConfig} 
                    teamIndex={teamIndex} 
                    modalRemoteEvent={modalRemoteEvent} 
                    host={host}
                />
            ))}
            <button className='event-modal-eventremote-newKit' onClick={ handleNewSlot }>Добавить слот</button>
        </div>
    );
};

export default Squad;
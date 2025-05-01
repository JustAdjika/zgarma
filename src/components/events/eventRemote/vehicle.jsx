import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const Vehicle = ({ vehItem, vehIndex, settingsKitsChange, settingConfig, teamIndex, modalRemoteEvent, host }) => {

    const onChange = (e, type) => {
        const vehArray = settingConfig.vehicle[teamIndex]

        if(type === 'name') vehArray[vehIndex].title = e.target.value
        if(type === 'count') vehArray[vehIndex].count = e.target.value

        settingsKitsChange('vehicle', teamIndex, vehArray)
    }

    const onBlur = (e, type) => {
        let loadData 
        if(type === 'name') loadData = {
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            vehId: vehIndex,
            team: teamIndex === 0 ? "Red" : "Blue",
            title: settingConfig.vehicle[teamIndex][vehIndex].title
        }
        if(type === 'count') loadData = {
            key: JSON.parse(Cookies.get("userData")).key, 
            eventId: modalRemoteEvent.id,  
            vehId: vehIndex,
            team: teamIndex === 0 ? "Red" : "Blue",
            count: settingConfig.vehicle[teamIndex][vehIndex].count
        }
        

        axios.patch(`${host}/api/developer/event/edit/vehicle/`, loadData) 
    }

    const handleDelete = () => {
        axios.delete(`${host}/api/developer/event/edit/vehicle/delete`, { 
            data: {
                key: JSON.parse(Cookies.get("userData")).key,
                eventId: modalRemoteEvent.id,
                vehId: vehIndex,
                team: teamIndex === 0 ? "Red" : "Blue"
            }
        }) 

        settingsKitsChange('vehicle', teamIndex, settingConfig.vehicle[teamIndex].filter((_, i) => i !== vehIndex))
    }

    return (
        <div className='event-modal-eventremote-main-vehicle-slot-container'>
            <div className='event-modal-eventremote-main-vehicle-slot-input-container'>
                <input type="text" 
                    value={vehItem.title}
                    onChange={ (e) => onChange(e, 'name') }
                    onBlur={ (e) => onBlur(e, 'name') }
                />
                <button onClick={ handleDelete }/>
            </div>
            <input 
                type="text" 
                maxLength={2} 
                value={vehItem.count}
                onChange={ (e) => onChange(e, 'count') }
                onBlur={ (e) => onBlur(e, 'count') }
                />
        </div>
    );
};

export default Vehicle;
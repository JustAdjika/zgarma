import React from 'react';

import RegisterSlot from './registerSlot';

const RegisterSquad = ({ squadItem, squadIndex, slotsOriginal, teamIndex, setSlot, setSquad, setTeam, team, squad, slot, host, handleLoadChange, setErrorMessage, eventid }) => {
    return (
        <div className='event-modal-eventreg-squad-container'>
            <h3>{squadItem.title}</h3>

            {
                squadItem.slots.map((slotItem, slotIndex) => (
                    <RegisterSlot 
                        slotItem={slotItem}
                        mapData={{slotIndex: slotIndex, squadIndex: squadIndex, team: teamIndex}}
                        setTeam={setTeam}
                        setSquad={setSquad}
                        setSlot={setSlot}
                        host={host}
                        handleLoadChange={handleLoadChange}
                        slotsOriginal={slotsOriginal}
                        setErrorMessage={setErrorMessage}
                        isCMDtype={false}
                        team={team}
                        squad={squad}
                        slot={slot}
                        eventid={eventid}
                    />
                ))
            }
        </div>
    );
};

export default RegisterSquad;
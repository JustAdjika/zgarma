import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon'
import Cookies from 'js-cookie';


const ReglistReport = ({ host, currentRequest, setErrorMessage, isContextmenu }) => {
    const [steamName, setSteamName] = useState("Undefined")
    const [discordName, setDiscordName] = useState("Undefined")
    const [discordid, setDiscordid] = useState("Undefined")
    const [regDate, setRegDate] = useState("Undefined")

    useEffect(() => {
        if(!currentRequest) {
            setSteamName("Undefined")
            setDiscordName("Undefined")
            setDiscordid("Undefined")
            setRegDate("Undefined")
            
            return
        }
        
        const getUser = async () => {
            const res = await axios.get(`${host}/api/developer/account/data/id?id=${currentRequest.userId}`)
            
            if(res.data.status == 200) {
                setSteamName(res.data.container.steam.personaname)
                setDiscordName(res.data.container.discord.username)
                setDiscordid(res.data.container.discord.id)

                try {
                    const moscowDate = res.data.container.date
                    const parts = moscowDate.match(/(\d{2})\.(\d{2})\.(\d{2}) \((\d{2}):(\d{2})\)/)

                    if(parts) {
                        const [_, day, month, year, hour, minute] = parts;

                        const fullYear = 2000 + parseInt(year);

                        const ISOmoscowDate = DateTime.fromObject(
                            {
                            day: parseInt(day),
                            month: parseInt(month),
                            year: fullYear,
                            hour: parseInt(hour),
                            minute: parseInt(minute),
                            },
                            { zone: 'Europe/Moscow' }
                        );

                        const localDate = ISOmoscowDate.setZone(DateTime.local().zoneName);
                        const displayTime = localDate.toFormat('dd.MM.yy (HH:mm)');

                        setRegDate(displayTime)
                    }
                } catch (e) {
                    console.error(e)
                }

                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            } else {
                setErrorMessage(res.data.err)
                setTimeout(() => { setErrorMessage("") }, 3000)
            }
        }


        if(!isContextmenu) getUser()
        else {
            setSteamName(currentRequest.steamName)
            setDiscordName(currentRequest.discordName)
            setDiscordid(currentRequest.discordid)
            setRegDate(currentRequest.regDate)
        }

    }, [currentRequest])

    return (
        <div className='event-modal-reglist-report-container'>
            <h2>Сводка аккаунта</h2>
            <div />
            <h3>Ник Steam</h3>
            <span>{ steamName }</span>
            <h3>Ник Discord</h3>
            <span> { discordName } </span>
            <h3>DiscordID</h3>
            <span>{ discordid }</span>
            <h3>Часы в ARMA</h3>
            <span>-Не реализовано-</span>
            <h3>Дата регистрации</h3>
            <span>{ regDate }</span>
            <h3>Unit</h3>
            <span>-Не реализовано-</span>
        </div>
    );
};

export default ReglistReport;
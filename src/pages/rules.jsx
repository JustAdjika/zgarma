import React from "react";
import './Style/rules.css';
import '../App.css'
import './Style/annoucement.css'
import rulesBunner from '../assets/rulesBunner.png';

const RulesPage = ({isDevBranch}) => {
    return (
        <div className="main-container-rules">
            <div className="banner-container-rules">
                <div className="bunner-text-rules">
                    <div className="title-bunner-rules"><span className="bunner-rules-title">Правила проекта</span></div>
                    <div className="decorative-container-bunner" style={{ boxShadow: '0px 0px 10px 10px #00000050' }}></div>
                    <div className="text-bunner" style={{ fontSize: '15pt', color: '#7D7D7D' }}>Об  изменениях в правилах мы оповестим всех в дискорде и уведомлением на сайте. Пожалуйста ознакомьтесь со всеми пунктами и соблюдайте их, так вы проявите уважение ко всем, кто играет на данном проекте и хочет весело провести время</div>
                </div>
                <div className="img-banner-rules">
                    {/* <img src={rulesBunner} alt="Rules Banner" style={{ width: '710px', marginTop: "120px" }}/> */}
                </div>
            </div>
            <div className="decoration-line-rules"></div>
            <div className="rules-paragraph">
                <h2>Правила на игре:</h2>
                <ul>
                    <li>У каждого игрока должен быть на готове <b>Team Speak</b> и <b>Radmin VPN</b></li>
                    <li><b>Авторитет персонала</b> должен уважаться. Если <b>GM</b> или <b>Админ</b> просят вас прекратить какие-либо действия — вы обязаны немедленно остановиться.</li>

                    <li><b>Политические высказывания и символика</b> запрещены:
                        <ul>
                            <li>Запрещено выражение политических предпочтений.</li>
                            <li>Запрещена демонстрация символики (шовинистического, ксенофобского, расистского толка и т.п.).</li>
                            <li>Запрещено использование политических лозунгов, ников, аватаров, статусов и фонов профиля.</li>
                        </ul>
                    </li>

                    <li><b>Запрещено употребление</b> уничижительных выражений в отношении национальностей, народов и групп (например, "пиндосы", "хохлы", "москали" и т.д.).</li>

                    <li><b>Национальная и культурная идентичность</b> может выражаться через государственные флаги/гербы (признанные ООН).  
                        <br/><b>Строго запрещено:</b> притеснение людей по национальному/расовому признаку, а также разжигание ненависти или вражды.</li>

                    <li><b>Запрещено препятствовать нормальной игре.</b></li>

                    <li><b>Запрещено использование ПО</b>, дающего игровое преимущество, таких как <i>Teamspeak Overwolf, ReShade</i> и другие моды или плагины.</li>
                </ul>

                <h2>Правила регистрации:</h2>
                <ul>
                    <li>Ваш никнейм не должен содержать посторонние символы и должен быть либо на кириллице, либо на латинице.</li>
                    <li>Запрещено использование альтернативных аккаунтов.</li>
                </ul>
            </div>
        </div>
    );
};

export default RulesPage;
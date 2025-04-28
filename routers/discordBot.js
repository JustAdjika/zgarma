import express from 'express';
import bodyParser from 'body-parser';
import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import dotenv from 'dotenv'

import ACCOUNTS_TAB from '../database/accounts.js';
import BUG_TICKETS_TAB from '../database/bugTickets.js'
import ADMINS_TAB from '../database/adminList.js';

import GetDateInfo from '../modules/dateInfo.js'
import BotPermissionsCheck from '../modules/botPerms.js'

dotenv.config()
const router = express.Router();
router.use(bodyParser.json());

const prefix = 'a!'

const client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ]
})

const token = process.env.DISCORD_BOT_TOKEN
const serverid = process.env.DISCORD_SERVER_ID



// Выполнение при запуске
client.on('ready', async () => {
    console.log(`\x1b[35m |!--- DISCORD_BOT IS READY ---!|\x1b[0m`);

    try {
        // Authorized role add
        const accounts = await ACCOUNTS_TAB.findAll()
        const guild = await client.guilds.fetch(serverid)

        let discordAccs = []

        accounts.forEach(account => {
            const parsedData = account.discord
            
            discordAccs.push(parsedData.id)
        });

        const role = guild.roles.cache.get('1343535112373145610');
        if (!role) {
            console.error(`[${GetDateInfo().all}] Роль с ID 1343535112373145610 не найдена!`);
            return;
        }

        await Promise.allSettled(discordAccs.map(async (id) => {
            try {
                const member = await guild.members.fetch(id);
                if (!member) {
                    console.log(`[${GetDateInfo().all}] Пользователь ${id} не найден в гильдии`);
                    return;
                }

                await member.roles.add(role);
                console.log(`[${GetDateInfo().all}] Роль 'Authorized (1343535112373145610)' выдана пользователю ${id}`);
            } catch (error) {
                console.error(`[${GetDateInfo().all}] Ошибка при выдаче роли пользователю ${id}:`, error.message);
            }
        }));


        // Web Administrator role add
        const admins = await ADMINS_TAB.findAll()

        await Promise.allSettled(admins.map(async (admin) => {
            try {
                const role = guild.roles.cache.get('1343548802455310358');
                if (!role) {
                    console.error(`[${GetDateInfo().all}] Роль с ID 1343548802455310358 не найдена!`);
                    return;
                }

                const adminAcc = await ACCOUNTS_TAB.findOne({
                    where: {
                        key: admin.key
                    }
                })

                if (!adminAcc) {
                    console.log(`[${GetDateInfo().all}] Администратор не найден в гильдии`);
                    return;
                }

                const member = await guild.members.fetch(adminAcc.dataValues.discord.id);

                if (!member) {
                    console.log(`[${GetDateInfo().all}] Пользователь ${adminAcc.dataValues.discord.id} не найден в гильдии`);
                    return;
                }

                await member.roles.add(role);
                console.log(`[${GetDateInfo().all}] Роль 'Web Administrator (1343548802455310358)' выдана пользователю ${adminAcc.dataValues.discord.id}`);
            } catch (error) {
                console.error(`[${GetDateInfo().all}] Ошибка при выдаче роли пользователю ${adminAcc.dataValues.discord.id}:`, error.message);
            }
        }));
    } catch (e) {
        console.error(`Discord preload bot error: ${e}`);
    }
})




////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////////           BOT TRIGGER                  ///////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////




// Ping - pong
client.on('messageCreate', async(message) => {
    const command = 'ping'
    try {

        if(message.author.bot) return

        if (message.content.toLowerCase() === `${ prefix }${ command }`) {
            message.reply(`pong`);
            console.log(`[${GetDateInfo().all}] ${message.author.id} executed command ${command}`)
        }

    } catch (e) {
        console.log(`[${GetDateInfo().all}] Bot error: ${command} - ${e}`)
    }
})


// Clear channel
client.on('messageCreate', async(message) => {
    const command = 'clear'
    try {
        if(message.author.bot) return

        const messageCommand = message.content.split(" ")[0]

        if (messageCommand.toLowerCase() === `${ prefix }${ command }`) {
            
            const channel = message.channel
            const argument = message.content.split(" ")[1]

            if(!channel.isTextBased()) return

            const messages = await channel.messages.fetch({ limit: argument })
            // const messagesid = messages.map(msg => msg.id)

            messages.map(msg => msg.delete())

            console.log(`[${GetDateInfo().all}] ${message.author.id} executed command ${command}`)
        }

    } catch (e) {
        console.log(`[${GetDateInfo().all}] Bot error: ${command} - ${e}`)
    }
})


// Выдача Authorized при присоединении
client.on('guildMemberAdd', async (member) => {
    
    const allAccounts = await ACCOUNTS_TAB.findAll()

    const guild = await client.guilds.fetch(serverid)
    let isAuth = false

    allAccounts.forEach(account => {
        const discordData = account.dataValues.discord

        if(discordData.id == member.id) {
            isAuth = true
        }
    });

    if(isAuth) {
        try {
            const foundMember = await guild.members.fetch(member.id);
            if (!foundMember) {
                console.log(`[${GetDateInfo().all}] Пользователь ${member.id} не найден в гильдии`);
                return;
            }

            await member.roles.add('1343535112373145610');
            console.log(`[${GetDateInfo().all}] Роль 'Authorized' выдана пользователю ${member.id}`);
        } catch (error) {
            console.error(`[${GetDateInfo().all}] Ошибка при выдаче роли пользователю ${member.id}:`, error.message);
        }
    }
});







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////////           BOT ROUTERS                  ///////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////






router.post('/role/add/authorized', BotPermissionsCheck, async(req,res) => {
    try {
        const discordid = req.body.discordid
        const guild = await client.guilds.fetch(serverid)

        const foundMember = await guild.members.fetch(discordid);
        if (!foundMember) {
            console.log(`[${GetDateInfo().all}] Пользователь ${discordid} не найден в гильдии`);
            return;
        }

        await foundMember.roles.add('1343535112373145610');
        console.log(`[${GetDateInfo().all}] Роль 'Authorized' выдана пользователю ${discordid}`);

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bot/role/add/authorized - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/role/add/authorized - ${e}`
        });
    };
})




// Получить всех участников дискорда
router.get('/members/data/all', async(req, res) => {
    try {
        const guild = await client.guilds.fetch(serverid)
        const members = await guild.members.fetch()

        const memberList = members.map(member => ({
            id: member.id,
            username: member.user.username
        }))

        console.log(`[${GetDateInfo().all}] Список участников сервера выдан`)

        res.json({
            status: 200,
            container: memberList
        })

    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bot/members/data/all - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/members/data/all - ${e}`
        });
    };
})



// Отправка нового поста
router.post('/post', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1354470729403465879') 
        else channel = await client.channels.fetch('1343553783824650240') 

        const embed = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(data.content)
            .setColor(0x3c7920) // Синий цвет
            .addFields(
                { name: '', value: ``, inline: false },
                { name: '', value: ``, inline: false },
                ...[
                    data.option1 && { name: 'Вариант 1', value: `${data.option1}`, inline: true },
                    data.option2 && { name: 'Вариант 2', value: `${data.option2}`, inline: true },
                    data.option3 && { name: 'Вариант 3', value: `${data.option3}`, inline: true },
                    data.option4 && { name: 'Вариант 4', value: `${data.option4}`, inline: true },
                ].filter(Boolean), // Убираем `undefined`
                { name: '', value: `*Чтобы проголосовать, [зарегистрируйтесь на сайте](https://zgarma.ru/announcement#postAnchor-${data.postid}).*`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'ZG ARMA 3 | Администрация' });

        await channel.send({ content: data.devBranch ? 'everyone' : '@everyone', embeds: [embed] });

        console.log(`[${GetDateInfo().all}] Announcement send`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bot/post - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/post - ${e}`
        });
    };
})



// Отправка нового патчноута
router.post('/patchnote', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1354465781819379742')
        else channel = await client.channels.fetch('1343952216901423205')
        

        const embed = new EmbedBuilder()
            .setTitle(`Ченджлог #${data.id} за ${data.date} - ${data.title}`)
            .setDescription(data.content)
            .setColor(0xecc011) // Синий цвет
            .setFooter({ text: 'Системный Администратор ZG' });

        await channel.send({ embeds: [embed] });

        console.log(`[${GetDateInfo().all}] Patchnote send`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bot/patchnote - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/patchnote - ${e}`
        });
    };
})



// Отправка нового баг тикета
router.post('/bugtickets', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1354468883150536804')
        else channel = await client.channels.fetch('1343949638025216133')

        // const buttons = new ActionRowBuilder()
        //     .addComponents(
        //         new ButtonBuilder()
        //             .setCustomId('CHECKED')
        //             .setLabel('Исправляется')
        //             .setStyle(ButtonStyle.Primary),
        //         new ButtonBuilder()
        //             .setCustomId('NOT FOUND')
        //             .setLabel('Не обнаружен')
        //             .setStyle(ButtonStyle.Primary),
        //         new ButtonBuilder()
        //             .setCustomId('FAIL')
        //             .setLabel('Не решен')
        //             .setStyle(ButtonStyle.Danger),
        //         new ButtonBuilder()
        //             .setCustomId('PRE_COMPLETE')
        //             .setLabel('Решен')
        //             .setStyle(ButtonStyle.Success)
        //     )

        const embed = new EmbedBuilder()
            .setTitle(`Баг тикет`)
            .setDescription(`**${data.title}**`)
            .setColor(0xecc011) // Синий цвет
            .addFields(
                { name: 'Описание', value: `${data.content}`, inline: false },
                { name: 'Дата', value: `${data.date}`, inline: false },
                { name: 'Автор', value: `${data.author}`, inline: false },
                { name: 'ID тикета', value: `${data.id}`, inline: false },
                // { name: 'Статус', value: `${data.status}`, inline: true },
                { name: 'Пользователь уже обращался', value: `${ data.isRepeat ? 'Да' : 'Нет' }`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Система ZG ARMA 3 WEBSITE ' });

        await channel.send({ embeds: [embed], content: '<@&1343515117819789382>' });

        console.log(`[${GetDateInfo().all}] Ticket send`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: bot/bugtickets - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/bugtickets - ${e}`
        });
    };
})


router.post('/eventAnnouncements/ready', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1287145544837238925')
        else channel = await client.channels.fetch('1344865229246566522')

        const embed = new EmbedBuilder()
        .setTitle(`Анонсирована игра`)
        .setDescription(`**${data.eventTitle}**`)
        .setColor(0x066da7) // Синий цвет
        .addFields(
            { name: 'Тип игры', value: `${data.eventType}`, inline: false },
            { name: 'Дата проведения', value: `${data.eventDate}`, inline: false },
            { name: 'Красные', value: `${data.eventTeam1}`, inline: true },
            { name: 'Синие', value: `${data.eventTeam2}`, inline: true },
            { name: '', value: ``, inline: false },
            { name: '', value: `*[Подробнее на странице сайта](https://zgarma.ru/events#anchor-${data.eventid})*`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: 'ZG ARMA 3 | Администрация' });

        await channel.send({ content: data.devBranch ? 'everyone' : '@everyone', embeds: [embed] });

        console.log(`[${GetDateInfo().all}] Event notice send (READY)`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: eventAnnouncements/ready - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: eventAnnouncements/ready - ${e}`
        });
    };
})


router.post('/eventAnnouncements/close', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1287145544837238925')
        else channel = await client.channels.fetch('1344865229246566522')

        const embed = new EmbedBuilder()
        .setTitle(`Игра окончена`)
        .setDescription(`**${data.eventTitle}**`)
        .setColor(0xc0392b) // Синий цвет
        .addFields(
            { name: 'Красные', value: `${data.eventTeam1}`, inline: true },
            { name: 'Синие', value: `${data.eventTeam2}`, inline: true },
            { name: '', value: `**Благодарим всех за участие в данном событии, просим оставить отзыв в дискорде, а так же приглашаем на другие наши игры.**`, inline: false },
            { name: '', value: ``, inline: false },
            { name: '', value: `*Следите за играми на нашем [сайте](https://zgarma.ru/events)*`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: 'ZG ARMA 3 | Администрация' });

        await channel.send({ embeds: [embed] });

        console.log(`[${GetDateInfo().all}] Event notice send (CLOSE)`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: eventAnnouncements/close - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: eventAnnouncements/close - ${e}`
        });
    };
})



router.post('/eventAnnouncements/open', BotPermissionsCheck, async(req, res) => {
    try {
        const data = req.body
        let channel

        if(!data.devBranch) channel = await client.channels.fetch('1287145544837238925')
        else channel = await client.channels.fetch('1344865229246566522')

        const embed = new EmbedBuilder()
        .setTitle(`Игра открыта для регистрации!`)
        .setDescription(`**${data.eventTitle}**`)
        .setColor(0x30762d) // Синий цвет
        .addFields(
            { name: 'Тип игры', value: `${data.eventType}`, inline: false },
            { name: 'Дата проведения', value: `${data.eventDate} (${data.eventTime})`, inline: false },
            { name: 'Красные', value: `${data.eventTeam1}`, inline: true },
            { name: 'Синие', value: `${data.eventTeam2}`, inline: true },
            { name: '', value: ``, inline: false },
            { name: '', value: `*[Подробнее на странице сайта](https://zgarma.ru/events#anchor-${data.eventid})*`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: 'ZG ARMA 3 | Администрация' });

        await channel.send({ content: data.devBranch ? 'everyone' : '@everyone', embeds: [embed] });

        console.log(`[${GetDateInfo().all}] Event notice send (OPEN)`)

        res.end()
    }catch(e){
        console.error(`\x1b[31m[${GetDateInfo().all}] Api developer error: eventAnnouncements/open - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: eventAnnouncements/open - ${e}`
        });
    };
})


client.login(token)

export default router;





// Кнопки баг тикетов
// client.on('interactionCreate', async (interaction) => {
//     try {
//         if (!interaction.isButton()) return;

//         let newStatus
//         let updateComponents = null;

//         if(interaction.customId === 'PRE_COMPLETE') {
//             const confirmRow = new ActionRowBuilder().addComponents(
//                 new ButtonBuilder()
//                     .setCustomId('COMPLETE')
//                     .setLabel('✅ Подтвердить')
//                     .setStyle(ButtonStyle.Success),
//                 new ButtonBuilder()
//                     .setCustomId('CANCEL_COMPLETE')
//                     .setLabel('❌ Отмена')
//                     .setStyle(ButtonStyle.Danger)
//             );

//             return await interaction.update({ components: [confirmRow] });
//         }else{
//             switch(interaction.customId) {
//                 case 'COMPLETE': newStatus = '🟢 Решен'; break;
//                 case 'CHECKED': newStatus = '🔵 Исправляется'; break;
//                 case 'NOT FOUND': newStatus = '🟠 Не обнаружен'; break;
//                 case 'FAIL': newStatus = '🔴 Не решен'; break;
//                 case 'CANCEL_COMPLETE': 
//                     const buttons = new ActionRowBuilder()
//                         .addComponents(
//                             new ButtonBuilder()
//                                 .setCustomId('CHECKED')
//                                 .setLabel('Исправляется')
//                                 .setStyle(ButtonStyle.Primary),
//                             new ButtonBuilder()
//                                 .setCustomId('NOT FOUND')
//                                 .setLabel('Не обнаружен')
//                                 .setStyle(ButtonStyle.Primary),
//                             new ButtonBuilder()
//                                 .setCustomId('FAIL')
//                                 .setLabel('Не решен')
//                                 .setStyle(ButtonStyle.Danger),
//                             new ButtonBuilder()
//                                 .setCustomId('PRE_COMPLETE')
//                                 .setLabel('Решен')
//                                 .setStyle(ButtonStyle.Success)
//                         );
                    
//                     return await interaction.update({ components: [buttons] });
//             }
//         }

//         if (newStatus) {
//             const oldEmbed = interaction.message.embeds[0];

//             if (!oldEmbed) {
//                 return console.error('Ошибка: эмбед отсутствует');
//             }

//             const updatedFields = oldEmbed.fields.map(field =>
//                 field.name === 'Статус'
//                     ? { name: field.name, value: newStatus, inline: field.inline ?? false }
//                     : field
//             );

//             const updatedEmbed = EmbedBuilder.from(oldEmbed).setFields(updatedFields);

//             if (interaction.customId === 'COMPLETE') {
//                 await interaction.update({ embeds: [updatedEmbed] });
//                 await interaction.message.edit({ components: [] });
//             } else {
//                 await interaction.update({ embeds: [updatedEmbed], components: updateComponents ?? interaction.message.components });
//             }

//             // Обновление базы данных
//             const ticketField = oldEmbed.fields.find(field => field.name === 'ID тикета');
//             const ticketid = ticketField ? ticketField.value : null;

//             if (!ticketid) {
//                 return console.error('Ошибка: ID тикета не найден');
//             }

//             const foundTicket = await BUG_TICKETS_TAB.findOne({ where: { id: ticketid } });

//             if (!foundTicket) {
//                 return console.error('Ошибка: тикет не найден');
//             }

//             await foundTicket.update({ status: interaction.customId });
//         }
//     } catch (e) {
//         console.error(`\x1b[31mBot interaction error - ${e} \x1b[31m`);
//     }
// });
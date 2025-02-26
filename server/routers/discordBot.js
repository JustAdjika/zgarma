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

client.on('ready', async () => {
    console.log(`\x1b[35m |!--- DISCORD_BOT IS READY ---!|\x1b[0m`);


    // Authorized role add
    const accounts = await ACCOUNTS_TAB.findAll()
    const guild = await client.guilds.fetch(serverid)

    let discordAccs = []

    accounts.forEach(account => {
        const parsedData = JSON.parse(account.discord)
        
        discordAccs.push(parsedData.id)
    });

    const role = guild.roles.cache.get('1343535112373145610');
    if (!role) {
        console.error("Роль с ID 1343535112373145610 не найдена!");
        return;
    }

    await Promise.allSettled(discordAccs.map(async (id) => {
        try {
            const member = await guild.members.fetch(id);
            if (!member) {
                console.log(`Пользователь ${id} не найден в гильдии`);
                return;
            }

            await member.roles.add(role);
            console.log(`Роль 'Authorized' выдана пользователю ${id}`);
        } catch (error) {
            console.error(`Ошибка при выдаче роли пользователю ${id}:`, error.message);
        }
    }));

    // Web Administrator role add
    const admins = await ADMINS_TAB.findAll()

    await Promise.allSettled(admins.map(async (admin) => {
        try {
            const role = guild.roles.cache.get('1343548802455310358');
            if (!role) {
                console.error("Роль с ID 1343548802455310358 не найдена!");
                return;
            }

            const adminAcc = await ACCOUNTS_TAB.findOne({
                where: {
                    key: admin.key
                }
            })

            if (!adminAcc) {
                console.log(`Администратор не найден в гильдии`);
                return;
            }

            const member = await guild.members.fetch(JSON.parse(adminAcc.dataValues.discord).id)

            if (!member) {
                console.log(`Пользователь ${JSON.parse(adminAcc.dataValues.discord).id} не найден в гильдии`);
                return;
            }

            await member.roles.add(role);
            console.log(`Роль 'Web Administrator' выдана пользователю ${JSON.parse(adminAcc.dataValues.discord).id}`);
        } catch (error) {
            console.error(`Ошибка при выдаче роли пользователю ${JSON.parse(adminAcc.dataValues.discord).id}:`, error.message);
        }
    }));
})


// Ping - pong
client.on('messageCreate', async(message) => {
    const command = 'ping'
    try {

        if(message.author.bot) return

        if (message.content.toLowerCase() === `${ prefix }${ command }`) {
            message.reply(`pong`);
        }

    } catch (e) {
        console.log(`Bot error: ${command} - ${e}`)
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
        }

    } catch (e) {
        console.log(`Bot error: ${command} - ${e}`)
    }
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

        res.json({
            status: 200,
            container: memberList
        })

    }catch(e){
        console.error(`\x1b[31mApi developer error: bot/members/data/all - ${e} \x1b[31m`);
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
        const channel = await client.channels.fetch('1343553783824650240')

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
                { name: '', value: '*Чтобы проголосовать, [зарегистрируйтесь на сайте](http://localhost:5173/announcement).*', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'ZG ARMA 3 | Администрация' });

        await channel.send({ embeds: [embed] });
    }catch(e){
        console.error(`\x1b[31mApi developer error: bot/post - ${e} \x1b[31m`);
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
        const channel = await client.channels.fetch('1343952216901423205')

        const embed = new EmbedBuilder()
            .setTitle(`Ченджлог #${data.id} за ${data.date} - ${data.title}`)
            .setDescription(data.content)
            .setColor(0xecc011) // Синий цвет
            .setFooter({ text: 'Системный Администратор ZG' });

        await channel.send({ embeds: [embed] });
    }catch(e){
        console.error(`\x1b[31mApi developer error: bot/patchnote - ${e} \x1b[31m`);
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
        const channel = await client.channels.fetch('1343949638025216133')

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
            .setFooter({ text: 'Система ZG ARMA 3 WEBSITE' });

        await channel.send({ embeds: [embed], content: '<@&1343515117819789382>' });
    }catch(e){
        console.error(`\x1b[31mApi developer error: bot/bugtickets - ${e} \x1b[31m`);
        res.json({
            status: 500,
            err: `Api developer error: bot/bugtickets - ${e}`
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
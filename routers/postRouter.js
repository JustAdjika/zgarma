import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

import POSTS_TAB from '../database/posts.js';
import ACCOUNTS_TAB from '../database/accounts.js';

import GetDateInfo from '../modules/dateInfo.js'
import PermissionsCheck from '../modules/permissions.js'
import AccountCheck from '../modules/accountCheck.js'



const router = express.Router();
router.use(bodyParser.json());

const botKey = process.env.BOT_ACCESS_KEY
const host = process.env.BASIC_URL

console.log(`\x1b[34m |!|    POST ROUTER READY     |!| \x1b[0m`);

// ADD POST
router.post('/add', AccountCheck, PermissionsCheck, async(req, res) => {
    try{
        const data = req.body;

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        })

        if(!user){
            res.json({
                status: 404,
                err: 'User undefined'
            })
            return
        }
        
        const newPost = await POSTS_TAB.create({
            title: data.title,
            content: data.content,
            date: GetDateInfo.date,
            option1: data.option1,
            option2: data.option2,
            option3: data.option3,
            option4: data.option4,
            votes: [],
            devBranch: data.devBranch
        });

        axios.post(`${host}/api/developer/bot/post`, { ...newPost.dataValues, botKey: botKey, devBranch: data.devBranch })

        res.json({
            status: 200
        });
    }catch(e){
        console.error(`\x1b[31mApi developer error: post/add - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: post/add - ${e}`
        });
    };
});

// GET POSTS
router.get('/data/all', async(req, res) => {
    try{
        const posts = await POSTS_TAB.findAll()

        if(!posts){
            res.json({
                status: 200,
                container: []
            });
        }else{
            res.json({
                status: 200,
                container: posts
            });
        }
    }catch(e){
        console.error(`\x1b[31mApi developer error: post/data/all - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: post/data/all - ${e}`
        });
    };
});

// ADD VOTE 
router.put('/vote/add', AccountCheck, async(req, res) => {
    try{
        const data = req.body;

        if(!data.key) {
            return res.json({
                status: 404,
                err: 'You are not registered'
            })
        } 

        const user = await ACCOUNTS_TAB.findOne({
            where: {
                key: data.key
            }
        });

        if(!user){
            res.json({
                status: 404,
                err: 'Api developer error: post/vote/add - key undefined'
            });
            return;
        };

        const post = await POSTS_TAB.findOne({
            where: {
                id: data.postId
            }
        });

        if(!post){
            res.json({
                status: 404,
                err: 'Api developer error: post/vote/add - post undefined'
            });
            return;
        };

        const votes = post.dataValues.votes

        const userVote = votes.find(vote => vote.userId === user.id)
        const newVote = {
            userId: user.id,
            option: data.option
        }

        if(userVote){
            const filtredVotes = votes.filter(vote => vote.userId !== user.id)
            const updatedVotes = [...filtredVotes, newVote]
            await post.update({ votes: updatedVotes })
        }else{
            const updatedVotes = [...votes, newVote]
            await post.update({ votes: updatedVotes })
        }

        res.json({
            status: 200
        })
    }catch(e){
        console.error(`\x1b[31mApi developer error: post/vote/add - ${e} \x1b[0m`);
        res.json({
            status: 500,
            err: `Api developer error: post/vote/add - ${e}`
        });
    };
});

export default router;
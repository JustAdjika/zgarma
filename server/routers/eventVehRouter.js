import express from 'express';
import bodyParser from 'body-parser';

const router = express.Router();
router.use(bodyParser.json());

console.log(`\x1b[34m |!|   EVENT_V ROUTER READY   |!|\x1b[0m`);


export default router;
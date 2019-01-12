const router = require('koa-router')();
const db = require('../controllers/db');
const upload = require('../controllers/upload');

router.post('/upload', async (ctx) => {
    console.log('request!');
    let response = await upload(ctx.request.body);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

router.get('/getImages', async (ctx) => {
    console.log('got request');
    const response = await db.getImages();
    console.log(response);
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(response);
});

module.exports = router;
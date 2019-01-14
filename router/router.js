const router = require('koa-router')();
const db = require('../controllers/db');
const upload = require('../controllers/upload');

router.post('/api/upload', async (ctx) => {
    let response = await upload(ctx.request.body);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

router.get('/api/images', async (ctx) => {
    const response = await db.getImages();
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(response);
});

router.get('/api/image/:id', async (ctx) => {
    const response = await db.imageInfo(ctx.params.id);
    console.log(response);
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(response);
});

module.exports = router;
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

router.post('/api/auth', async (ctx) => {
    let response = await db.auth(ctx.request.body);
    console.log(response);
    if (response) {
        ctx.response.status = 200;
    } else {
        ctx.response.status = 403;
    }
});

router.get('/api/allData/auth=:auth', async (ctx) => {
    let response = await db.allData(ctx.params.auth);
    if (response) {
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(response);
    } else {

    }
});

module.exports = router;
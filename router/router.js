const router = require('koa-router')();

const upload = require('../controllers/upload');

router.post('/upload', async (ctx) => {
    console.log('request!');
    let response = await upload(ctx.request.body);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

module.exports = router;
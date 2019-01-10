const router = require('koa-router')();

const upload = require('../controllers/upload');

router.post('/upload.html', async (ctx) => {
    let response = await upload(ctx.request.body);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

module.exports = router;
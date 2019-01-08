const router = require('koa-router')();

const upload = require('../controllers/upload');

router.post('/upload.html', (ctx) => {
    console.log(upload(ctx.request.body));
});

module.exports = router;
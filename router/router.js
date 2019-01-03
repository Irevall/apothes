const router = require('koa-router')();

const upload = require('../controllers/upload');

router.post('/upload.html', (ctx) => {
    upload(ctx.request.files.img_upload, ctx.request.body)
});


module.exports = router;
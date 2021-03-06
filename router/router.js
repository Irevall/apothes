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
    if (response) {
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(response);
    } else {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
    }

});

router.get('/api/image/:id', async (ctx) => {
    const response = await db.imageInfo(ctx.params.id);
    if (response) {
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(response);
    } else {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
    }
});

router.post('/api/downloadCount/:id', async (ctx) => {
    const response = await db.downloadCount(ctx.params.id);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

router.post('/api/report/:id', async (ctx) => {
    const response = await db.reportImage(ctx.params.id, ctx.request.body);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

router.post('/api/auth', async (ctx) => {
    let response = await db.auth(ctx.request.body);
    if (response === null) {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
        return false;
    } else if (!response) {
        ctx.response.status = 403;
        ctx.response.message = 'Auth error';
        return false;
    } else {
        ctx.response.status = 200;
        ctx.response.message = 'Authed!';
    }
});

router.get('/api/allData/auth=:auth', async (ctx) => {
    let response = await db.auth(ctx.params.auth);
    if (response === null) {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
        return false;
    } else if (!response) {
        ctx.response.status = 403;
        ctx.response.message = 'Auth error';
        return false;
    }

    response = await db.allData();
    if (response) {
        ctx.response.status = 200;
        ctx.response.body = JSON.stringify(response);
    } else {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
    }
});

router.post('/api/delete/auth=:auth', async (ctx) => {
    let response = await db.auth(ctx.params.auth);
    if (response === null) {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
        return false;
    } else if (!response) {
        ctx.response.status = 403;
        ctx.response.message = 'Auth error';
        return false;
    }

    response = await db.deleteImage(JSON.parse(ctx.request.body).id);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

router.post('/api/approve/auth=:auth', async (ctx) => {
    let response = await db.auth(ctx.params.auth);
    if (response === null) {
        ctx.response.status = 500;
        ctx.response.message = 'Database error';
        return false;
    } else if (!response) {
        ctx.response.status = 403;
        ctx.response.message = 'Auth error';
        return false;
    }

    const body = JSON.parse(ctx.request.body);
    response = await db.approveImage(body.id, body.approved);
    ctx.response.status = response.status;
    ctx.response.message = response.message;
});

module.exports = router;
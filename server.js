const fs = require('fs');

const Koa = require('koa');
const serve = require('koa-static');
const router = require('./router');
const koaBody = require('koa-body');
const db = require('./controllers/db');

const app = new Koa();

if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
}

if (!fs.existsSync('data/images')) {
    fs.mkdirSync('data/images');
}

db.start();

app.use(koaBody({ multipart: true }));

app.use(serve('dist'));
app.use(serve('data/images'));

app.use(router.routes());

app.listen(9010);
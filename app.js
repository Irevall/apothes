const fs = require('fs');

const Koa = require('koa');
const serve = require('koa-static');
const router = require('./router');
const koaBody = require('koa-body');
const db = require('./controllers/db');

const app = new Koa();

if (!fs.existsSync('database')) {
    fs.mkdirSync('database');
}

if (!fs.existsSync('database/images')) {
    fs.mkdirSync('database/images');
}

db.start();

app.use(koaBody({ multipart: true }));

app.use(serve('dist'));
app.use(serve('node_modules'));
app.use(serve('database'));

app.use(router.routes());

app.listen(9010);
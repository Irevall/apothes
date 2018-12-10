const koa = require('koa');
const serve = require('koa-static');
const router = require('./router/');

const app = new koa();

app.use(serve('public'));
app.use(serve('node_modules/normalize.css'));
app.use(serve('database/'));
app.use(router.routes());

app.listen(9010);
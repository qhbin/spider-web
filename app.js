const Koa = require('koa')
const app = new Koa();
const logger = require('koa-logger')
const json = require('koa-json')
const views = require('koa-views')
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')


const index = require('./routes/index');
const huobi = require('./routes/huobi.spider');
const users = require('./routes/users');
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

app.use(async (ctx, next) => {
  const start = new Date;
  await next();
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(huobi.routes(), huobi.allowedMethods());


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;

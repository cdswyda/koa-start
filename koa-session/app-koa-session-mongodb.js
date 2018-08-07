const Koa = require('koa')
const session = require('koa-session')
const DbStore = require('./mongodb-store')
const app = new Koa()

app.keys = ['this is koa session test']

// mongodbb base
// 过期时间还未处理
app.use(session({
    key: 'koa-session-test',
    maxAge: 86400000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    store: new DbStore()
}, app))

app.use(ctx => {
    // ignore favicon
    if (ctx.path === '/favicon.ico') return;

    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.body = n + ' views';
})

app.listen(3000)
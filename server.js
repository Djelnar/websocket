const
    server = new (require('koa')),
    logger = require('koa-morgan'),
    _ = require('lodash'),
    serve = require('koa-static'),
    path = require('path'),
    views = require('koa-views'),
    router = require('koa-router')(),
    bodyParser = require('koa-body'),
    WebSocketServer = new require('ws')

let wss = new WebSocketServer.Server({port: 1488})

let store = {
    balls: [

    ],
    clients: [

    ]
}

wss.on('connection', (e) => {
    let uniqId = store.clients.length
    store.clients.push(e)
    store.balls.push({
        x: 0,
        y: 0,
        uniqId
    })
    
    e.on('message', (m) => {
        let msg = JSON.parse(m)        
        store.balls[uniqId] = {
            x: msg.x,
            y: msg.y,
            uniqId
        }
        store.clients.forEach((el, idx, arr) => {
            try {
                el.send(JSON.stringify(_.compact(store.balls)))
            } catch(err) {
                console.log('Websocket error: %s', err);
            }
        })
    })

    e.on('close', (params) => {
        store.balls[uniqId] = null
    })
})







router.get('/', async ctx => {
    await ctx.render('index')
})

server
    .use(views(path.join(__dirname, '/views'), { extension: 'ejs' }))
    .use(serve('static'))
    // .use(logger('tiny'))
    .use(router.routes())
    .listen(1338, () => {
    console.log(`Listening...`)
})
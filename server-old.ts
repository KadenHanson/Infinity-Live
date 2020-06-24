import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { platformServer, renderModuleFactory } from '@angular/platform-server'
import { enableProdMode } from '@angular/core'
// import { AppServerModuleNgFactory } from '../dist/ngfactory/src/app/app.server.module.ngfactory';
import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as Pusher from 'pusher';
import * as crypto from 'crypto';

const PORT = 3000;

enableProdMode();

const app = express();

const pusher = new Pusher({
    appId: '1016839',
    key: '8f5d8c8479ce914e18b5',
    secret: '631d6f6c2e2c24215236',
    cluster: 'us3',
    encrypted: false
});

let template = readFileSync(join(__dirname, '..', 'dist', 'index.html')).toString();

// app.engine('html', (_, options, callback) => {
//     const opts = { document: template, url: options.req.url };

//     renderModuleFactory(AppServerModuleNgFactory, opts)
//         .then(html => callback(null, html));
// });

app.set('view engine', 'html');
app.set('views', 'src')

app.get('*.*', express.static(join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
    res.render('index', { req });
});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.post('/pusher/auth', function (req, res) {
    let socketId = req.body.socket_id;
    let channel = req.body.channel_name;
    let presenceData = {
        user_id: crypto.randomBytes(16).toString("hex")
    };
    let auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
});

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}!`);
});

// initialise Pusher.
// Replace with your credentials from the Pusher Dashboard
// const pusher = new Pusher({
//     appId: '1016839',
//     key: '8f5d8c8479ce914e18b5',
//     secret: '631d6f6c2e2c24215236',
//     cluster: 'us3',
//     encrypted: false
// });

// // to serve our JavaScript, CSS and index.html
// app.use(express.static('./assets/'));

// // CORS
// app.all('/*', function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     next();
// });

// // endpoint for authenticating client
// app.post('/pusher/auth', function (req, res) {
//     let socketId = req.body.socket_id;
//     let channel = req.body.channel_name;
//     let presenceData = {
//         user_id: crypto.randomBytes(16).toString("hex")
//     };
//     let auth = pusher.authenticate(socketId, channel, presenceData);
//     res.send(auth);
// });

// // direct all other requests to the built app view
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, './src/index.html'));
// });

// // start server
// var port = process.env.PORT || 3000;
// app.listen(port, () => console.log('Listening at http://localhost:' + port));
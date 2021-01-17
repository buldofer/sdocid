const https = require('https');

var http = require('http');

const fs = require('fs'), path = require('path');

const parse = require('mrz').parse;

var express = require('express');

const sharp = require('sharp');

var bodyParser = require('body-parser');

const fetch = require('node-fetch');

const axios = require('axios');

const { createWorker, PSM } = require('tesseract.js');

const { Image, createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext('2d');


const app = express();
/*
app.listen(3000, () => {
    console.log('server started')
})
*/
const cors = require('cors')({ origin: true });

var router = express.Router();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// Create a document
// Muy importante esto: 
// https://expressjs.com/es/api.html
router.use(bodyParser.json({ limit: "50mb" }));
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
// https://expressjs.com/es/api.html#req.body
router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
router.use(cors);
router.use(express.static('public'));
//https://cmsdk.com/javascript/receiving-neterremptyresponse-with-nodejs-post-request.html
router.use(function (req, res, next) {
    console.log('request', req.url, req.body, req.method);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-token");
    if (req.method === 'OPTIONS') {
        res.end();
    }
    else {
        next();
    }
});
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
router.post('/ocr', function (req, res, next) {

    var base64Datab = req.body.blob;
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.onerror = err => { throw err }

    img.src = base64Datab;

    (async () => {

       // console.log("img.srcimg.srcimg.src::: " + img.src);

        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('mrz');
        await worker.initialize('mrz');
        const rectangle = { left: 0, top: 0, width: 500, height: 250 };
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.AUTO,
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<',
            preserve_interword_spaces: '0',
        })
        const { data: { text } } = await worker.recognize(img.src, { rectangle });
        console.log(text);
        console.log("sucia1::::" + text);
        var textolimpio = text;
        var linea1a = textolimpio;
        console.log("sucia2::::" + linea1a);
        var specialChars = "!@#$^&%*()+=-[]\/{}|_>:?,.¡¿'`´";
        for (var i = 0; i < specialChars.length; i++) {

            linea1a = linea1a.replace(new RegExp('\\' + specialChars[i], 'gmi'), '');
        }
        linea1a = linea1a.toString().replace('', '');
        console.log("limpia0::::" + linea1a);
        linea1a = linea1a.match(/\b([A-Z0-9<]{15,}[<].+[\W\D].*)/gmi);

        console.log("limpia1::::" + linea1a);
        linea1a = linea1a.toString().replace('', '');
        linea1a = linea1a.match(/\b(.+[A-Z0-9<][<]{1,}.+[A-Z0-9<][\W]{1,}.+)/gmi);
        linea1a = linea1a.toString().replace('\n', ',');
        linea1a.toString().replace(',', ',');
        console.log("limpia2::::" + linea1a);

        await worker.terminate();

        var resultado = linea1a.toString().replace(',', '\r\n').toString().replace(',', '\r\n');
        console.log("Valor resultado::::::: " + resultado);
        var result = parse(resultado);
        console.log("Valor result mrz::::::: " + result);
        res.send(result);
    })().catch((err) => {
        console.error(err)
        //next(err)	
    })

});


//////////////////////////////////////////////////////////////////////////////
router.post('/crear', function (req, res, next) {

	var nomImagenDocumento = req.body.nomImagenDocumento;

    var base64Datab = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '')

	sharp.cache({ files: 0 });

    console.log("kakka::" + base64Datab)

	var pathimagen = "./public/imagenes/imagentemp.jpg";

	//const imgname = new Date().getTime().toString();
	const imgname = Math.floor(Math.random() * 10000).toString();

    //esto hace que funcione tanto jpg como png, etc..
    
    console.log("kakkappp::" + base64Datab)

	fs.writeFileSync(pathimagen, base64Datab, 'base64', function (err) {
		// If an error occurred, show it and return
		if (err) return console.error(err);
		// Successfully wrote to the file!
	});

	var nuevonombreimagen = imgname + "_imgdoc.jpg";

	global.test = nuevonombreimagen;

	sharp(pathimagen).resize({ width: 700 }).toFile("./public/imagenes/" + nuevonombreimagen)
		.then(function (newFileInfo) {

			console.log("Success");

		}).then(function () {
			fs.unlink(pathimagen, function (err) {
				if (err) throw err;
				console.log('fffffffffffffFile deleted!');
			});
        });
});

//////////////////////////////////////////////////////////////////////////////
router.post('/crearimagenvideo', function (req, res, next) {

	var nomImagenDocumento = req.body.nomImagenDocumento;

	sharp.cache({ files: 0 });

	console.log(req.body)

	console.log(nomImagenDocumento)

	var pathimagen = "./public/imagenes/videoimagentemp.jpg";

	//const imgname = new Date().getTime().toString();
	const imgname = Math.floor(Math.random() * 10000).toString();

	//esto hace que funcione tanto jpg como png, etc..
	var base64Datab = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	fs.writeFileSync(pathimagen, base64Datab, 'base64', function (err) {
		// If an error occurred, show it and return
		if (err) return console.error(err);
		// Successfully wrote to the file!
	});

    var nuevonombreimagen = nomImagenDocumento + ".jpg";
    
	global.test = nuevonombreimagen;

	sharp(pathimagen).resize({ width: 700 }).toFile("./public/imagenes/" + nuevonombreimagen)
		.then(function (newFileInfo) {

			console.log("Success");
			//var nomImagenDocumento = "imgvideo";
		}).then(function () {
			fs.unlink(pathimagen, function (err) {
				if (err) throw err;
				console.log('fffffffffffffFile deleted!');
			});
		});
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.post('/guardarimagendocumento', function (req, res, next) {

	var base64Datab = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '');
	var nomImagenDocumento = req.body.nomImagenDocumento;
	var pathimagen = "./public/imagenes/" + nomImagenDocumento + ".jpg";

	fs.writeFileSync(pathimagen, base64Datab, 'base64', function (err) {
		// If an error occurred, show it and return
		if (err) return console.error(err);
		// Successfully wrote to the file!
	});

	sharp(pathimagen).resize({ width: 700 }).toFile("./public/imagenes/" + nomImagenDocumento + ".jpg")
		.then(function (newFileInfo) {

			console.log("Success");

		}).then(function () {
			fs.unlink(pathimagen, function (err) {
				if (err) throw err;
				console.log('fffffffffffffFile deleted!');
			});
		});
});

//////////////////////////////////////////////////////////////////////////////

// https://expressjs.com/es/api.html#req.body

router.post('/guardarfirma', function (req, res, next) {

	//const imgname = new Date().getTime().toString();

	const imgname = Math.floor(Math.random() * 10000).toString();

	var pathfirma = "./public/imagenesfirma/" + imgname + "_firma.jpg";

	var base64DataFirma = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	//var path = "./public/imagenes/" + req.body.nomImagenFirma;

	fs.writeFile(pathfirma, base64DataFirma, "base64", function (err) {

		if (err) {

			console.log(err);
		} else {
			console.log("success" + pathfirma);
		}
	});

	//res.end();
});

app.use(function (req, res, next) {
	res.setHeader('Content-Type', 'text/event-stream');
	next();
});


app.use(router);

//const srvr = http.createServer(app).listen(8081);

http.createServer(app).listen(8081);

//srvr.timeout = 16000;
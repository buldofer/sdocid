const https = require('https');

var http = require('http');

const fs = require('fs');

const parse = require('mrz').parse;

var express = require('express');

var jsonxml = require('jsontoxml');

var bodyParser = require('body-parser');

var Tesseract = require('./public/js/tesseract.js');

	
		 global.window = Tesseract.create({
            // Path to worker
         workerPath: 'https://cdn.rawgit.com/naptha/tesseract.js/0.2.0/dist/worker.js',
    corePath: 'https://cdn.rawgit.com/naptha/tesseract.js-core/0.1.0/index.js',
    langPath: 'http://192.168.0.36:8081/lang/',
		
		});

// https://desarrolloweb.com/articulos/generar-pdf-desde-nodejs.html
//var pdf = require('html-pdf');
// http://pdfkit.org/

const PDFDocument = require('pdfkit');

const app = express();

// Create a document
// Muy importante esto: 
// https://expressjs.com/es/api.html
app.use(bodyParser.json({ limit: "50mb" }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

// https://expressjs.com/es/api.html#req.body
app.use(express.json()) // for parsing application/json

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// 

const cors = require("cors")({origin:true});

app.use(cors);

var router = express.Router();

app.use(express.static('public'));


app.get('/ap', function (req, res) { 

	if (req.url === '/ap') {

	fs.createReadStream('./public/index.html').pipe(res);
	
	return res;
	}else	
	if (req.url === '/tesseract') {

  fs.readFile('./public/js/tesseract.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
			// console.log('kakakaka');
            return;
        });


 
	//return res;
	}
	  console.log('jjjjjjjjjjjjjjjj')
});


router.get('/tessy/:linea1', function (req, res, next) {
		
		var linea1 = req.params.linea1;
		 
		console.log(linea1);

		if (linea1==='hora') {

		var lineamrzz = "kakakakadsfdfdf";
  
		// res.json({title:"api",message:"root"});
   
		res.setHeader('Content-Type', 'text/html');

			//res.setHeader('Content-Type', 'application/json');

		res.write('<html>');
		
		res.write('<head> <title> Hello TutorialsPoint </title><script type="text/javascript" src="http://192.168.0.36:8081/js/tesseract.js"></script></head>');

		res.write(`<body> Hello Tutorials Point <script>var x = document.createElement('IMG');x.setAttribute('src', 'http://192.168.0.36:8081/imagenes/006.jpg');x.setAttribute('width', '304');x.setAttribute('height', '228');x.setAttribute('alt', 'The Pulpit Rock');document.body.appendChild(x);window.Tesseract = Tesseract.create({workerPath: 'http://192.168.0.36:8081/js/worker.js',langPath: 'http://192.168.0.36:8081/lang/',corePath: 'http://192.168.0.36:8081/js/index.js',});let tesseractSettings = {lang: 'mrz'};Tesseract.recognize('http://192.168.0.36:8081/imagenes/006.jpg', tesseractSettings).then(function (result){var textolimpio = result.text;console.log(textolimpio);var lineasmrz = textolimpio.match(/\\b([A-Z[A-Z0-9<]{18,44}[<][A-Z0-9<]+)/gm);console.log(lineasmrz);var linea1 = lineasmrz.toString().replace(',','/');console.log(linea1.replace(',','/'));console.log(linea1);testnode(linea1.replace(",","/"), "", "");});var name = "${lineamrzz}";`);

	  

  //res.render(__dirname + "/views/layouts/main.html", {name:name});
	


	//var ficheros = JSON.stringify(res);

	//res.write(ficheros);

	//res.end();

	
	
		res.write(`function testnode(linea1, linea2, linea3) {

				var papa="";
			var xmlhttp = new XMLHttpRequest();

			if (window.XMLHttpRequest) {
				// Objeto para IE7+, Firefox, Chrome, Opera, Safari
				xmlhttpx = new XMLHttpRequest();
			} else {
				// Objeto para IE6, IE5
				xmlhttpx = new ActiveXObject("Microsoft.XMLHTTP");
			}
			
			var ficheros;

			xmlhttp.onreadystatechange = function () {

				if (this.readyState == 4 && this.status == 200) {
				
					ficheros = JSON.parse(this.response);
					
					papa = ficheros;

					console.log(ficheros);
					
					console.log(ficheros['fields']['documentCode']); 		

					alert("Nombre:"+ficheros['fields']['firstName']+"Tipo documento"+ficheros['fields']['documentCode']);
					
				}
			};

				if (!linea3) {

					//var cadenaurlconsultamrz = "https://us-central1-scandoc-834fe.cloudfunctions.net/app/" + linea1 + "/" + linea2;
					
					var cadenaurlconsultamrz = "http://192.168.0.36:8081/mrz/" + linea1 + "/" + linea2;

				} else {

					var cadenaurlconsultamrz = "http://192.168.0.36:8081/mrz/" + linea1 + "/" + linea2 + "/" + linea3;
				
				}

			var cadenaurlconsultamrzlimpia =  decodeURI(cadenaurlconsultamrz);

			xmlhttp.open("GET", cadenaurlconsultamrzlimpia, true);

			xmlhttp.send();
			
		return papa;

		};console.log(name);</script></body></html>`); 

 //res.setHeader('Content-Type', 'application/json');
 
   // res.end();

console.log(lineamrzz);


		
		//res.json({title:"api",message:"root"});

 
		res.end();
		
		
		}else{
		res.setHeader('Content-Type', 'text/html');
		res.write(linea1);
		res.end();
		}
		

});

var tessa = fs.readFile('./public/js/tesseract.js', function (err, data) {
	
if (err) { throw err; }

return;

});
		
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
});

// define the home page route
router.get('/', function (req, res) { 

});

router.param('linea1', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE1')
    next()
});

router.param('linea2', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE2')
    next()
});

router.param('linea3', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE3')
    next()
});

router.get('/mrz/:linea1/:linea2', function (req, res) {

    var linea1 = req.params.linea1;

    var linea2 = req.params.linea2;

    var resultado = linea1 + '\r\n' + linea2;

    res.send(parse(resultado));

});

router.get('/mrz/:linea1/:linea2/:linea3', function (req, res) {

    var linea1 = req.params.linea1;

    var linea2 = req.params.linea2;

    var linea3 = req.params.linea3;

    var resultado = linea1 + '\r\n' + linea2 + '\r\n' + linea3;

    res.send(parse(resultado));


});

router.get('/tesstest', function (req, res) {

	var linea1 = "IDESPBCY193496548298715A<<<<<<";

	var linea2 = "7411191M2409043ESP<<<<<<<<<<<2";

	var linea3 = "PAZOS<SANCHEZ<<JOSE<RAMON<<<<<";

	var resultado = linea1 + '\r\n' + linea2 + '\r\n' + linea3;

	res.send(parse(resultado));

	var ficheros = JSON.stringify(res);

	res.write(ficheros);

	res.end();

	return ficheros;
	           
});

router.get('/ficheros', function (req, res) {

	fs.readdir('./public/1234-5678-9012/', function (err, files) {

		if (err) throw err;

			files.forEach(function (file) {

				fs.readFile('./public/1234-5678-9012/' + file, 'utf8', function (err, data) {               

				});
			});

		var ficheros = JSON.stringify(files);

		res.write(ficheros);

		res.end();

		return ficheros;

	});
	
});

router.get('/crearxml/:nomf/:datos', function (req, res) {

    var nomf = req.params.nomf;

    var datos = req.params.datos;

    var result = jsonxml(datos);

    res.send(fs.writeFile("./public/1234-5678-9012/" + nomf, result, function (err) {
        // la funcion es la que maneja lo que sucede despues de termine el evento
        if (err) {
            return console.log(err);
        }
        // las funciones de javascript en nodejs son asincronicas
        // por lo tanto lo que se quiera hacer debe hacerse dentro de la funcion que maneja el evento
        // si uno declara una variable arriba de la funcion, la manipula dentro y la quiere usar
        // despues afuera, se corre el riezgo de que nunca se realice la manipulacion.
		
        console.log(result);
		
    }));
	
});

// https://expressjs.com/es/api.html#req.body

app.post('/guardarfirma', function (req, res, next) {
	
    var base64DataFirma = req.body.imgFirma.replace(/^data:image\/png;base64,/, "");

    var path = "./public/imagenes/" + req.body.nomImagenFirma;
    
    fs.writeFile(path, base64DataFirma, "base64", function (err) {
		
        if (err) {
			
            console.log(err);
        }else{
           console.log("success" + path);
        }
    });
	
    res.end();
});

app.post('/crear', function (req, res, next) {
	
  console.log(req.body)

  var base64Data = req.body.blob.replace(/^data:image\/png;base64,/, "");

  var path = "./public/imagenes/doctemp.png"

  fs.writeFileSync(path, base64Data, "base64");
  
  const archivomrz = " --dir ./public/imagenes/";

  exec('node ./node_modules/mrz-detection-master/run/getMrz.js ' + archivomrz, (error, stdout, stderr) => {

  });
  res.end();
  
});
// https://medium.com/@deepika.gunda/all-you-need-to-know-about-uploading-and-displaying-pictures-using-node-js-express-js-pug-jade-d89fbeb19947

app.post('/guardarimagendocumento', function (req, res, next) {

    var base64DataDocumento = req.body.imgDocumento.replace(/^data:image\/png;base64,/, "");

    var nomImagenDocumento = req.body.nomImagenDocumento;

    var pathdoc = "./public/imagenes/" + nomImagenDocumento;

    fs.writeFileSync(pathdoc, base64DataDocumento, "base64");

    console.log("success" + pathdoc);
	
    res.end();
	
});

app.use(router);

http.createServer(app).listen(8081);

//https.createServer(option, app).listen(443);




const https = require('https');

var http = require('http');

const url = require('url');

const fs = require('fs');

const parse = require('mrz').parse;

var express = require('express');

var jsonxml = require('jsontoxml');

var bodyParser = require('body-parser');

const fetch = require('node-fetch');

let urlj = "https://www.reddit.com/r/popular.json";

const { createWorker, PSM } = require('tesseract.js');

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

const cors = require("cors")({origin:true});

app.use(cors);

var router = express.Router();

app.use(express.static('public'));

app.get('/ap/:linea1', function (req, res, next) {
		
		var linea1 = req.params.linea1;
	
//const rectangle = { left: 0, top: 0, width: 500, height: 250 };

const worker = createWorker();
(async () => {
  await worker.load();
  await worker.loadLanguage('mrz');
  await worker.initialize('mrz');
  await worker.setParameters({
	    tessedit_pageseg_mode: PSM.AUTO,
		tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<',
		preserve_interword_spaces: '0',
  });
  
  // const { data: { text } } = await worker.recognize('http://192.168.0.36:8081/imagenes/006.jpg');
  
	const { data: { text } } = await worker.recognize('http://192.168.0.36:8081/imagenes/'+linea1);
	
	// const { data } = await worker.detect('http://192.168.0.36:8081/imagenes/006.jpg');
	  
	console.log(text);
	
	var textolimpio = text;

	var linea1a = textolimpio;
	
	//var linea1a = textolimpio.replace(' ','').toString();
	
	var specialChars = "!@#$^&%*()+=-[]\/{}|_>:?,.¡¿'`´ ";

			for (var i = 0; i < specialChars.length; i++) {

				linea1a = linea1a.replace(new RegExp('\\' + specialChars[i], 'gm'), '');
			}
			
			linea1a = linea1a.match(/\b([A-Z[A-Z0-9<]{18,44}[<][A-Z0-9<]+)/gmi); 
			
	console.log(linea1a);
	
//res.write(linea1a.toString().replace(',','/').toString().replace(',','/').toString());

await worker.terminate();

let settings = { method: "Get" };

fetch("http://192.168.0.36:8081/mrz/"+linea1a.toString().replace(',','/').toString().replace(',','/').toString(), settings)
    .then(res => res.json())
     .then((json) =>{
		 
		 
		 var documentCode = "";
		
		var issuingState = "";
		
		var documentNumber = "";
		
		var documentNumberCheckDigit = "";
		
		var optional1 = "";
		
		var birthDate = "";
		
		var sex = "";
		
		var expirationDate = "";
		
		var nationality = "";
		
		var firstName = "";
		
		var lastName = "";
		
		 
		//documentCode = json.fields.documentCode.toString()+"\n";
		
		//issuingState = json.fields.issuingState.toString()+"\n";
		
		//documentNumber = json.fields.documentNumber.toString()+"\n";
		
		//documentNumberCheckDigit = json.fields.documentNumberCheckDigit.toString()+"\n";
		
		//optional1 = json.fields.optional1.toString()+"\n";
		
		//birthDate = json.fields.birthDate.toString()+"\n";
		
		//sex = json.fields.sex.toString()+"\n";
		
		//expirationDate = json.fields.expirationDate.toString()+"\n";
		
		//nationality = json.fields.nationality.toString()+"\n";
		
		//firstName = json.fields.firstName.toString()+"\n";
		
		// lastName = json.fields.lastName.toString()+"\n";
		
		 if (json.fields.documentCode !== null) {	 
		 
			documentCode = json.fields.documentCode.toString()+"\n";

			res.write(documentCode);
		 
		 };
		 
		  if (json.fields.issuingState !== null) {	 

			issuingState = json.fields.issuingState.toString()+"\n";

			res.write(issuingState);
			
		 };

		if (json.fields.documentNumber !== null) {	 
		 
			documentNumber = json.fields.documentNumber.toString()+"\n";
			res.write(documentNumber)
		 
		 };
		 
		 if (json.fields.documentNumberCheckDigit !== null) {	 
		 
			documentNumberCheckDigit = json.fields.documentNumberCheckDigit.toString()+"\n";
			res.write(documentNumberCheckDigit);
		 };
		 		  
		 if (json.fields.optional1 !== null) {	 
			optional1 = json.fields.optional1+"\n";
			res.write(optional1);
		 }else{
			 optional1 ="nada\n";
			res.write(optional1);
		 };
		 	  
		 if (json.fields.birthDate !== null) {	 
		 
			birthDate = json.fields.birthDate.toString()+"\n";
			res.write(birthDate);
		 };
		 
		 if (json.fields.sex !== null) {	 
		 
			sex = json.fields.sex.toString()+"\n";
			res.write(sex);
		 
		 };
		 
		  if (json.fields.expirationDate !== null) {	 
		 
			expirationDate = json.fields.expirationDate.toString()+"\n";
			
			res.write(expirationDate);
			
		 };
		 
		  if (json.fields.nationality !== null) {	 
		 
				nationality = json.fields.nationality.toString()+"\n";
				res.write(nationality);
		 };
		 	  
		  if (json.fields.firstName !== null) {	 
		 
				firstName = json.fields.firstName.toString()+"\n";
				res.write(firstName);
		 };
		 
		   if (json.fields.lastName !== null) {	 
		 
				lastName = json.fields.lastName.toString()+"\n";
				
				res.write(lastName);
		 };
		 
		//res.write(documentCode);
		
		//res.write(issuingState);
		
		//res.write(documentNumber);
		
		//res.write(documentNumberCheckDigit);
		
		//res.write(optional1);
		
		//res.write(birthDate);
		
		//res.write(sex);
		
		//res.write(expirationDate);
		
		//res.write(nationality);
		
		//res.write(firstName);
		
		//res.write(lastName);
		 
		console.log(json.fields);
		
		res.end();
		
    });



})().then(function() {
  console.log('oh, no!'); // "Success!"
  throw 'oh, no!';
}).catch(function(e) {
  console.log(e); // "oh, no!"
}).then(function(){
  console.log('after a catch the chain is restored');
}, function () {
  console.log('Not fired due to the catch');
});

});


router.get('/tessy/:linea1', function (req, res, next) {
		
		var linea1 = req.params.linea1;
		 
		console.log(linea1);

		if (linea1==='hora') {

		var lineamrzz = "kakakakadsfdfdf";
  
			res.setHeader('Content-Type', 'text/html');

			//res.setHeader('Content-Type', 'application/json');

		res.write('<html>');
		
		res.write('<head> <title> Hello TutorialsPoint </title><script type="text/javascript" src="http://192.168.0.36:8081/js/tesseract.js"></script></head>');

		res.write(`<body> Hello Tutorials Point <script>var x = document.createElement('IMG');x.setAttribute('src', 'http://192.168.0.36:8081/imagenes/006.jpg');x.setAttribute('width', '304');x.setAttribute('height', '228');x.setAttribute('alt', 'The Pulpit Rock');document.body.appendChild(x);window.Tesseract = Tesseract.create({workerPath: 'http://192.168.0.36:8081/js/worker.js',langPath: 'http://192.168.0.36:8081/lang/',corePath: 'http://192.168.0.36:8081/js/index.js',});let tesseractSettings = {lang: 'mrz'};Tesseract.recognize('http://192.168.0.36:8081/imagenes/006.jpg', tesseractSettings).then(function (result){var textolimpio = result.text;console.log(textolimpio);var lineasmrz = textolimpio.match(/\\b([A-Z[A-Z0-9<]{18,44}[<][A-Z0-9<]+)/gm);console.log(lineasmrz);var linea1 = lineasmrz.toString().replace(',','/');console.log(linea1.replace(',','/'));console.log(linea1);testnode(linea1.replace(",","/"), "", "");});var name = "${lineamrzz}";`);


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

					//alert("Nombre:"+ficheros['fields']['firstName']+"Tipo documento"+ficheros['fields']['documentCode']);
					
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
		
	console.log(lineamrzz);

	res.end();
	
}});

app.get('/jose', function (req, res) {
	

let settings = { method: "Get" };

fetch("http://192.168.0.36:8081/mrz/PEROUEIUCA<<BOGDAN<MIHAIL<<<<<<<<<<<<<<<<<<</0542706671ROU8307233M21111421830723450023<88", settings)
    .then(res => res.json())
     .then((json) =>{
		 
		res.write(json.fields.documentCode.toString()+"\n");
		
		res.write(json.fields.issuingState.toString()+"\n");
		
		res.write(json.fields.documentNumber.toString()+"\n");
		
		res.write(json.fields.documentNumberCheckDigit.toString()+"\n");
		
		//res.write(json.fields.optional1.toString()+"\n");
		
		res.write(json.fields.birthDate.toString()+"\n");
		
		res.write(json.fields.sex.toString()+"\n");
		
		res.write(json.fields.expirationDate.toString()+"\n");
		
		res.write(json.fields.nationality.toString()+"\n");
		
		res.write(json.fields.firstName.toString()+"\n");
		
		res.write(json.fields.lastName.toString()+"\n");
		 
		console.log(json.fields);
	
		res.end();
		
    });
	
	


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

	//var ficheros = JSON.stringify(res);

	//res.json(ficheros);

	//res.end();

	//return ficheros;
	           
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

/*
http.createServer((req,res)=>{

    const parseObj =  url.parse(req.url,true);
	
    const users = [{id:1,name:'soura'},{id:2,name:'soumya'}]

    if(parseObj.pathname == '/user-details' && req.method == "GET") {
		
        let Id = parseObj.query.id;
		
        let user_details = {};
		
        users.forEach((data,index)=>{
			
            if(data.id == Id){
				
                user_details = data;
            }
        });
		
        res.writeHead(200,{'x-auth-token':'Auth Token'})
		
        res.write(JSON.stringify(user_details)) // Json to String Convert
		
        res.end();
    }
}).listen(8000);
*/
//https.createServer(option, app).listen(443);




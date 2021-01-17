const https = require('https');

var http = require('http');

const fs = require('fs'), path = require('path');

const parse = require('mrz').parse;

var express = require('express');

const sharp = require('sharp');

var jsonxml = require('jsontoxml');

var bodyParser = require('body-parser');

const fetch = require('node-fetch');

const { createWorker, PSM } = require('tesseract.js');

const app = express();

const cors = require('cors')({ origin: true });

var router = express.Router();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

const head = fs.readFileSync("./componentes/html/head.html", "utf8");

const body = fs.readFileSync("./componentes/html/body.html", "utf8");

const estilos = fs.readFileSync("./componentes/css/estilos.css", "utf8");

const chosen = fs.readFileSync("./componentes/src/chosen/chosen.css", "utf8");

const imageselect = fs.readFileSync("./componentes/src/ImageSelect.css", "utf8");

const flat = fs.readFileSync("./componentes/src/Flat.css", "utf8");

const estilos_boots = fs.readFileSync(
	"./componentes/css/bootstrap.min.css",
	"utf8"
);

const script_jquery = fs.readFileSync(
	"./componentes/js/jquery-1.7.2.min.js",
	"utf8"
);

//const script_dexie = fs.readFileSync("./componentes/js/dexie.js", "utf8");

//const bbdd = require("./componentes/js/bbddlocal").funciones;

const script_jquery3s = fs.readFileSync(
	"./componentes/js/jquery-3.3.1.slim.min.js",
	"utf8"
);

const script_jquery3m = fs.readFileSync(
	"./componentes/js/jquery-3.4.1.min.js",
	"utf8"
);

const script_boots = fs.readFileSync(
	"./componentes/js/bootstrap.min.js",
	"utf8"
);

const string = `
	<!doctype html>
		<html lang="es">
			<head>
				${head}
				<style>
					${estilos_boots}
					${estilos}
					${chosen}
					${imageselect}
					${flat}
				</style>	
			</head>
		<body>
			${body}
		</body>
			<script>
				${script_jquery}
			
				${script_jquery3s}
				${script_jquery3m}
				${script_boots}
				$(document).ready(function() {

							$("#ficheroscan").on("change", function(e) {
								$("#imagendoc").css("display", "block");
								var reader = new FileReader();
								reader.onload = function(e) {
								$("#imagendoc").attr("src", e.target.result);
								$("#loading").css("display", "block");
								$("#imagendoc").css("width", "33%");
								imagendocumento = document.getElementById("imagendoc").src;
								};
								if (e.target.files.length) {
								reader.readAsDataURL(e.target.files[0]);
								}
								setTimeout(function() {
								crearimagen();
								}, 500);

							});

			async function crearimagen() {
				var imagendocumento = document.getElementById("imagendoc");
				var canvasimagendocu = document.createElement("canvas");
				canvasimagendocu.width = imagendocumento.naturalWidth; // or 'width' if you want a special/scaled size
				canvasimagendocu.height = imagendocumento.naturalHeight; // or 'height' if you want a special/scaled size
				canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
				$.ajax({
					type: "POST",
					url: "http://192.168.0.36:8081/crear",
					data: {
					blob: document.getElementById("imagendoc").src
					}
					}).done(function(o) {
					setTimeout(function() {
					}, 1000);
				});
				window.open("http://192.168.0.36:8081/test1","_self");
			};
		});
 			</script>
	</html>`;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function walkSync(currentDirPath, callback) {
	fs.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = path.join(currentDirPath, name);
		var stat = fs.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
};

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var workerFarm = require('worker-farm'),
	workers = workerFarm(require.resolve('./hilo'));

var kaka = './public/imagenes/';
//
//global.test = "i6.jpg";

/*
workers(kaka, function(gen,s) {

	console.log(global.test);
	console.log(gen);
	
});
*/
/*
walkSync('./public/imagenes', function (filePath, stat) {
	var frt;
	frt = filePath.replace(/^public\\imagenes\\/, "");
	//	console.log(frt);
	res.write(`<option data-img-src="http://192.168.0.36:8081/imagenes/${frt}">${frt}</option>`)
});
*/
router.get("/test1", function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');

	res.setHeader('Content-Type', 'text/html; charset=utf-8');

	res.setHeader('Transfer-Encoding', 'chunked');

	res.header("Cache-Control", "no-cache, no-store, must-revalidate");

	res.header("Pragma", "no-cache");

	res.header("Expires", 0);

	res.write(string);

	res.end();

});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


const estilos_func_ap = fs.readFileSync("./componentes/css/estilos_func_ap.css", "utf8");

const func_ap_p1 = fs.readFileSync("./componentes/html/func_ap_p1.html", "utf8");

router.get('/ap/:linea1', function (req, res, next) {

	res.setHeader('Connection', 'Transfer-Encoding');

	res.setHeader('Content-Type', 'text/html; charset=utf-8');

	res.setHeader('Transfer-Encoding', 'chunked');

	var linea1 = req.params.linea1;

	const AbortController = require("abort-controller")

	const controller = new AbortController()

	const timeout = setTimeout(
		() => { controller.abort(); },
		1000,
	);

	res.write(`<html>
					<head>
					${head}
					
					<script>
						${script_jquery}
						${script_jquery3s}
						${script_jquery3m}
						${script_boots}
					</script>

					<style>
						${chosen}
						${imageselect}
						${flat}
						${estilos_func_ap}

					</style>

					</head>

					<body>`);

	res.write(`<div id="contador"></div><div id="contadorresultado"></div>`);

	res.write(`<div class="selectz">

					<select id="mySelect" class="my-select" style="display: block;" onchange="getOption()">`);

	walkSync('./public/imagenes', function (filePath, stat) {
		var frt;
		frt = filePath.replace(/^public\\imagenes\\/, "");
		//	console.log(frt);
		res.write(`<option data-img-src="http://192.168.0.36:8081/imagenes/${frt}">${frt}</option>`)
	});

	res.write(`</select>
	
	</div>`);

	res.write(`<div class="contentp">`);

	const worker = createWorker();
	(async () => {
		await worker.load();
		await worker.loadLanguage('mrz');
		await worker.initialize('mrz');
		const rectangle = { left: 0, top: 0, width: 500, height: 250 };
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.AUTO,
			tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<',
			preserve_interword_spaces: '0',
		});

		var urlimagen = 'http://192.168.0.36:8081/imagenes/' + linea1;

		res.write(`${func_ap_p1}`);

		const { data: { text } } = await worker.recognize(urlimagen, { rectangle });

		console.log(text);

		console.log("sucia1::::" + text);

		var textolimpio = text;

		var linea1a = textolimpio;

		console.log("sucia2::::" + linea1a);

		var specialChars = "!@#$^&%*()+=-[]\/{}|_>:?,.¡¿'`´ ";

		for (var i = 0; i < specialChars.length; i++) {

			linea1a = linea1a.replace(new RegExp('\\' + specialChars[i], 'gmi'), '');
		}

		console.log("limpia0::::" + linea1a);

		linea1a = linea1a.match(/\b([A-Z0-9<]{15,}[<].+[\W\D].*)/gmi);

		linea1a = linea1a.toString().replace('', '');

		console.log("limpia1::::" + linea1a);

		linea1a = linea1a.match(/\b(.+[A-Z0-9<][<]{1,}.+[A-Z0-9<][\W]{1,}.+)/gmi);

		linea1a = linea1a.toString().replace('\n', ',');

		linea1a.toString().replace(',', ',');

		console.log("limpia2::::" + linea1a);

		await worker.terminate();

		let settings = { method: "Get" };

		fetch("http://192.168.0.36:8081/mrz/" + linea1a.toString().replace(',', '/').toString().replace(',', '/').toString(), settings).then(res => res.json()).then((json) => {

			if (json.ok) return json.json();

			var errordocumento = "";

			var valid = "";

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

			if (json.details[3].error) {

				errordocumento = json.details[3].error;

				console.error("esto es el valor de errordocumento" + errordocumento);

				res.write(`<p class='uno'>Error errordocumento: <b>${errordocumento}</b></p>`);
			}

			if (json.valid) {

				valid = json.valid.toString();

				res.write(`<p class='dos'>Documento válido?: <b>${valid}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Documento válido?: <b>Revisar, faltan datos!!</b></p>`);
			};

			if (json.fields.documentCode) {

				documentCode = json.fields.documentCode.toString();

				res.write(`<p class='uno'>Tipo Doc: <b>${documentCode}</b></p>`);

			} else {

				res.write("<p class='uno' style='color: red;'>Tipo Doc: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (json.fields.issuingState) {

				issuingState = json.fields.issuingState.toString();

				res.write(`<p class='dos'>País Emisor Doc: <b>${issuingState}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>País Emisor Doc: <b>------</b></p>`);
			};

			if (json.fields.documentNumber) {

				documentNumber = json.fields.documentNumber.toString();

				res.write(`<p class='uno'>Num. Doc: <b>${documentNumber}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Num. Doc: <b>------</b></p>`);
			};

			if (json.fields.documentNumberCheckDigit) {

				documentNumberCheckDigit = json.fields.documentNumberCheckDigit.toString();

				res.write(`<p class='dos'>Digito control: <b>${documentNumberCheckDigit}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Digito control: <b>------</b></p>`);
			};

			if (json.fields.optional1) {

				optional1 = json.fields.optional1;

				res.write(`<p class='uno'>Num. id País: <b>${optional1}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Num. id País: <b>------</b></p>`);
			};

			if (json.fields.birthDate) {

				birthDate = json.fields.birthDate.toString();

				res.write(`<p class='dos'>F. Nacimiento: <b>${birthDate}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>F. Nacimiento: <b>------</b></p>`);
			};

			if (json.fields.sex) {

				sex = json.fields.sex.toString();

				res.write(`<p class='uno'>Sexo: <b>${sex}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Sexo: <b>------</b></p>`);
			};

			if (json.fields.expirationDate) {

				expirationDate = json.fields.expirationDate.toString();

				res.write(`<p class='dos'>F.Caducidad:<b>${expirationDate}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>F.Caducidad:<b>------</b></p>`);
			};

			if (json.fields.nationality) {

				nationality = json.fields.nationality.toString();

				res.write(`<p class='uno'>Nacionalidad: <b>${nationality}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Nacionalidad: <b>------</b></p>`);
			};

			if (json.fields.firstName) {

				firstName = json.fields.firstName.toString() + "\n";

				res.write(`<p class='dos'>Nombre: <b>${firstName}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Nombre: <b>------</b></p>`);
			};

			if (json.fields.lastName) {

				lastName = json.fields.lastName.toString();

				res.write(`<p class='uno'>Apellidos: <b>${lastName}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Apellidos: <b>------</b></p>`);
			};

			res.write(`</div><div class="contenidop"><label style="text-align: center;padding:30px;">Firmar Documento:</label></div>`);

			console.log(json.fields);


			res.write(`<script>		
			
			document.getElementById('phototest').width = "100";
			var l = document.getElementById("contador");
			var lr = document.getElementById("contadorresultado");

		function changeColor(obj) {

			var i;
			
			for (i = 0; i < obj.length ;i++) {
				if (i %2 == 0) {
					obj[i].style.backgroundColor = 'rgb(240, 240, 240)';
				}else{
					obj[i].style.backgroundColor = 'rgb(140, 180, 240)';
				}
			}
		};

			function getOption(){

			var sx = document.getElementById('mySelect');

			document.getElementById('imagendoc').src = "http://192.168.0.36:8081/imagenes/"+sx.value;

			document.getElementById('imagendoc').style.display = "block";

			window.open("http://192.168.0.36:8081/ap/"+sx.value,"_self");

		};

		function quitarcontador() {

			l.style.display="none";
			
			lr.innerHTML =  l.innerHTML;
			
			lr.style.display="block";
			
			lr.style.color ="red";
			
			changeColor(document.getElementsByTagName('p'));

		}

			function guardarfirma() {
			var imagendocumento = document.getElementById("imagendoc");
			var canvasimagendocu = document.createElement("canvas");
			canvasimagendocu.width = imagendocumento.naturalWidth;
			canvasimagendocu.height = imagendocumento.naturalHeight;
			canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
			$.ajax({
			type: "POST",
			url: "http://192.168.0.36:8081/guardarfirma",
			data: {
			blob: canvass.toDataURL()
			}
			}).done(function(o) {
			setTimeout(function() {
			}, 100);
			});
		};

			</script>`);

			res.write(`<div class="contenedor" id="contenedorlienzofirma">
							<div id="lienzo"></div>
							<input name="guardar" type="button" value="guardar" onclick="guardarfirma();">
						</div>

						<div id="canvasdiv"><canvas id="canvas"></canvas></div>

			<div id="capacamara">

				<video id="video"></video>

					<div id="salida">

				<img id="photo" src="http://192.168.0.36:8081/recursos/imgblanco.png" alt="Sin imagen">

					</div>
			</div>`);

			res.write(`	<script>
	
	$(document).ready(function() {

		//getLoad();

		function getLoad(){

		document.getElementById('phototest').src = "http://192.168.0.36:8081/imagenes/${linea1}";
		
		};
		
		function startup() {

			var capacamaradiv = document.getElementById('capacamara');

			capacamaradiv.style.visibility ="visible";

			var salida = document.getElementById('salida');
			
			var startbutton = document.getElementById('startbutton');

			salida.style.display = "none";

			video.style.display = "block";

			const constraints = {
				advanced: [{
					facingMode: "environment",
					width: {
						min: 600,
						ideal: 600,
						max: 600
					},
					height: {
						min: 400,
						ideal: 400,
						max: 400
					}
				}]
			};

			navigator.mediaDevices.getUserMedia({

				video: constraints,
				audio: false

			}).then(function (stream) {

				video.srcObject = stream;

				video.play();
				
			}).catch(function (err) {
					console.log("An error occurred: " + err);
				});

			video.addEventListener('canplay', function (ev) {
				if (!streaming) {

					height = video.videoHeight / (video.videoWidth / width);
					// Firefox currently has a bug where the height can't be read from
					// the video, so we will make assumptions if this happens.
					if (isNaN(height)) {
						height = width / (4 / 3);
					}

					video.setAttribute('width', width);

					video.setAttribute('height', height);

					canvas.setAttribute('width', width);

					canvas.setAttribute('height', height);

					streaming = true;
				}
			}, false);

			startbutton.addEventListener('click', function (ev) {

				takepicture();

				ev.preventDefault();

			}, false);

			clearphoto();
		}

		function takepicture() {
						
			if (width && height) {
				
			canvas.width = width;
				
			canvas.height = height;
				
			context.drawImage(video, 0, 0, width, height);
					
			var data = canvas.toDataURL('image/png');
				
			photo.setAttribute('src', data);
				
			salida.style.display = "block";
				
			video.style.display  = "none";

			canvas.style.display = "none";
				
			} else {
			
				clearphoto();
			}
			//continuarescaneando();
		}
			
		function clearphoto() {
			
			salida.style.display = "none";
				
			video.style.display  = "block";
			
			context.fillStyle = "#AAA";
			
			context.fillRect(0, 0, canvas.width, canvas.height);

			var data = canvas.toDataURL('image/png');
			
			photo.setAttribute('src', data);
		}


							var movimientos = new Array();

							var pulsado;

							crearLienzo();

							$("#ficheroscan").on("change", function(e) {

							$("#imagendoc").css("display", "block");

							var reader = new FileReader();

							reader.onload = function(e) {

								$("#imagendoc").attr("src", e.target.result);

								$("#loading").css("display", "block");

								$("#imagendoc").css("width", "33%");

								//imagendocumento = document.getElementById("imagendoc").src;

							};
							if (e.target.files.length) {
							reader.readAsDataURL(e.target.files[0]);
							}
							setTimeout(function() {
							crearimagen();
							}, 1000);

						});

						async function crearimagen() {
							var nomImagenDocumento = "kakahhjhj";
							var imagendocumento = document.getElementById("imagendoc");
							var canvasimagendocu = document.createElement("canvas");
							canvasimagendocu.width = imagendocumento.naturalWidth;
							canvasimagendocu.height = imagendocumento.naturalHeight;
							canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
							$.ajax({
							type: "POST",
							url: "http://192.168.0.36:8081/crear",
							data: {
							blob: document.getElementById("imagendoc").src,
							nomImagenDocumento,
							}
							}).done(function(o) {
							setTimeout(function() {
							}, 100);
							});
						};

						$("#photo").on("click", function(e) {

							//$("#imagendoc").css("display", "block");

							setTimeout(function() {

							crearimagenvideo();

							}, 1000);

						});

						async function crearimagenvideo() {

							var nomImagenDocumento = "imgvideo";
							
							var imagendocumento = document.getElementById("imagendoc");
							var canvasimagendocu = document.createElement("canvas");
							canvasimagendocu.width = imagendocumento.naturalWidth;
							canvasimagendocu.height = imagendocumento.naturalHeight;
							canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
							$.ajax({
							type: "POST",
							url: "http://192.168.0.36:8081/crearimagenvideo",
							data: {
							blob: document.getElementById("photo").src,
							nomImagenDocumento,
							}
							}).done(function(o) {
							setTimeout(function() {

								salida.style.display = "none";
		
								video.style.display  = "block";
								
								context.fillStyle = "#AAA";
								
								context.fillRect(0, 0, canvas.width, canvas.height);

								var data = canvas.toDataURL('image/png');
								
								photo.setAttribute('src', data);
								
							}, 5000);

								window.open("http://192.168.0.36:8081/ap/imgvideo.jpg","_self");
							});

							
						};


		var l = document.getElementById("contador");

		var lr = document.getElementById("contadorresultado");

		function changeColor(obj) {

			var i;
			
			for (i = 0; i < obj.length ;i++) {
				if (i %2 == 0) {
					obj[i].style.backgroundColor = 'rgb(240, 240, 240)';
				}else{
					obj[i].style.backgroundColor = 'rgb(140, 180, 240)';
				}
			}
		};

		function quitarcontador() {

			l.style.display="none";
			
			lr.innerHTML =  l.innerHTML;
			
			lr.style.display="block";
			
			lr.style.color ="red";
			
			changeColor(document.getElementsByTagName('p'));

		}

function crearLienzo() {

		var canvasDiv = document.getElementById('lienzo');

		var video = document.getElementById('video');

		var canvas = document.getElementById('canvas');
								
	//Aquí es donde vamos a insertar el código javascript para crear el lienzo

	var canvass = document.createElement('canvas');

	canvass.setAttribute('width', 300);

	canvass.setAttribute('height', 300);

	canvass.setAttribute('id', 'canvass');

	canvasDiv.appendChild(canvass);

	if (typeof G_vmlCanvasManager != 'undefined') {

		canvas = G_vmlCanvasManager.initElement(canvass);

	}
	contextlienzo = canvass.getContext("2d");

	// Para poder firmar desde el ratón

	$('#canvass').mousedown(function (e) {
		pulsado = true;
		movimientos.push([e.pageX - this.offsetLeft,
		e.pageY - this.offsetTop,
			false]);
		repinta();
	});

	$('#canvass').mousemove(function (e) {
		if (pulsado) {
			movimientos.push([e.pageX - this.offsetLeft,
			e.pageY - this.offsetTop,
				true]);
			repinta();
		}
	});

	$('#canvass').mouseup(function (e) {
		pulsado = false;
	});

	$('#canvass').mouseleave(function (e) {
		pulsado = false;
	});


	// Para firmar solo desde la opción táctil

	$('#canvass').bind('touchstart', function (event) {

		var e = event.originalEvent;

		e.preventDefault();

		pulsado = true;

		movimientos.push([e.targetTouches[0].pageX - this.offsetLeft,
		e.targetTouches[0].pageY - this.offsetTop,
			false]);

		repinta();
	});

	$('#canvass').bind('touchmove', function (event) {

		var e = event.originalEvent;

		e.preventDefault();

		if (pulsado) {

			movimientos.push([e.targetTouches[0].pageX - this.offsetLeft,
			e.targetTouches[0].pageY - this.offsetTop,
				true]);

			repinta();
		}
	});

	$('#canvass').bind('touchend', function (event) {

		var e = event.originalEvent;

		e.preventDefault();

		pulsado = false;
		
	});

	repinta();
}

function repinta() {

	canvass.width = canvass.width; // Limpia el lienzo

	contextlienzo.strokeStyle = "#00000";

	contextlienzo.lineJoin = "round";

	contextlienzo.lineWidth = 2;

		for (var i = 0; i < movimientos.length; i++) {

			contextlienzo.beginPath();

			if (movimientos[i][2] && i) {

				contextlienzo.moveTo(movimientos[i - 1][0], movimientos[i - 1][1]);

			} else {

				contextlienzo.moveTo(movimientos[i][0], movimientos[i][1]);
			}
			contextlienzo.lineTo(movimientos[i][0], movimientos[i][1]);

			contextlienzo.closePath();

			contextlienzo.stroke();
		}
	};

	function guardarfirma() {
			var imagendocumento = document.getElementById("imagendoc");
			var canvasimagendocu = document.createElement("canvas");
			canvasimagendocu.width = imagendocumento.naturalWidth;
			canvasimagendocu.height = imagendocumento.naturalHeight;
			canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
			$.ajax({
			type: "POST",
			url: "http://192.168.0.36:8081/guardarfirma",
			data: {
			blob: canvass.toDataURL()
			}
			}).done(function(o) {
			setTimeout(function() {
			}, 100);
			});
		};

		var width = 800;    // We will scale the photo width to this

		var height = 0;     // This will be computed based on the input stream

		var streaming = false;

		var context = canvas.getContext('2d');

		document.getElementById('startbutton').onclick = function() {startup()};

////////////
						
					});

				</script>
				
						
		</body>

	</html>`);
	
			
			res.end();

		}).catch((err) => {
			console.error("kakakakaka:::::::::::::::::::::: " + err + " ::::::::::::pppasdasdasdasdasdasdasdad")
			//next(err)
			//res.write(`<p class='uno' style='color: red;'>Fallo!!!:<b>${err}</b></p>`);
			res.write(`
			
			<script>

			
				var l = document.getElementById("contador");
				var lr = document.getElementById("contadorresultado");
				l.style.display="none";
				lr.innerHTML =  l.innerHTML;
				lr.style.display="block";
				l.style.display="none";
				lr.style.color ="red";

				//quitarcontador();

			</script>
						
				<p class='uno' style='color: red;'><b>No ha sido posible detectar correctamente el documento</b></p>`);
			res.end();
		});

	})().catch((err) => {
		console.error(err)
		next(err)
	});

	
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.get('/mrz/:linea1/:linea2', function (req, res) {

	var linea1 = req.params.linea1;
	var linea2 = req.params.linea2;

	var resultado = linea1 + '\r\n' + linea2;

	try {
		var result = parse(resultado, function (req, res) {
			res => res.json().then(response => { }).catch(error => {
				console.log(error);
			})
		})
	} catch (error) {
		res.status(error.response.status)
		return res.send(error.message);
	}

	res.send(result);

});

app.get('/ocr/:linea1', function (req, res, next) {


	res.setHeader('Content-Type', 'text/html; charset=utf-8');

	var linea1 = req.params.linea1;

	var urlimagen = 'http://192.168.0.36:8081/imagenes/' + linea1;

	const worker = createWorker();

	(async () => {
		await worker.load();
		await worker.loadLanguage('mrz');
		await worker.initialize('mrz');
		const rectangle = { left: 0, top: 0, width: 500, height: 250 };
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.AUTO,
			tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<',
			preserve_interword_spaces: '0',
		})

		const { data: { text } } = await worker.recognize(urlimagen, { rectangle });

		console.log(text);

		console.log("sucia1::::" + text);

		var textolimpio = text;

		var linea1a = textolimpio;

		console.log("sucia2::::" + linea1a);

		var specialChars = "!@#$^&%*()+=-[]\/{}|_>:?,.¡¿'`´ ";

		for (var i = 0; i < specialChars.length; i++) {

			linea1a = linea1a.replace(new RegExp('\\' + specialChars[i], 'gmi'), '');
		}

		console.log("limpia0::::" + linea1a);

		linea1a = linea1a.match(/\b([A-Z0-9<]{15,}[<].+[\W\D].*)/gmi);

		linea1a = linea1a.toString().replace('', '');

		console.log("limpia1::::" + linea1a);

		linea1a = linea1a.match(/\b(.+[A-Z0-9<][<]{1,}.+[A-Z0-9<][\W]{1,}.+)/gmi);

		linea1a = linea1a.toString().replace('\n', ',');

		linea1a.toString().replace(',', ',');

		var rrr = linea1a.toString().replace(',', ',');

		console.log("limpia2::::" + linea1a);

		await worker.terminate();
		
		var resultado = linea1a.toString().replace(',', '\r\n').toString().replace(',', '\r\n');

		console.log("Valor resultado::::::: " + resultado);

		var result = parse(resultado);


		console.log("Valor result mrz::::::: " + result);

		//res.write("<html><body><p>" + result + "</p></body></html>");
		
		res.send(result);

		//res.end();

			let settings = { method: "Get" };

		fetch("http://192.168.0.36:8081/mrz/" + rrr.toString().replace(',', '/').toString().replace(',', '\r\n').toString().replace(',', '\r\n'), settings).then(res => res.json()).then((json) => {

			
			console.log("Valor result mrzjson::::::: " + json.fields.documentCode.toString());


		}).catch((err) => {
			console.error("kakakakaka:::::::::::::::::::::: " + err + " ::::::::::::pppasdasdasdasdasdasdasdad")
			//next(err)
			//res.write(`<p class='uno' style='color: red;'>Fallo!!!:<b>${err}</b></p>`);
			
			res.end();
		});
		
		
	})().catch((err) => {
		console.error(err)
		next(err)
	});

});


app.get('/ocrk', function (req, res, next) {


	res.setHeader('Content-Type', 'text/html; charset=utf-8');

	var urlimagen = 'http://192.168.0.36:8081/imagenes/imgvideo.jpg';

	const worker = createWorker();

	(async () => {
		await worker.load();
		await worker.loadLanguage('mrz');
		await worker.initialize('mrz');
		const rectangle = { left: 0, top: 0, width: 500, height: 250 };
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.AUTO,
			tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<',
			preserve_interword_spaces: '0',
		})

		const { data: { text } } = await worker.recognize(urlimagen, { rectangle });

		console.log(text);

		console.log("sucia1::::" + text);

		var textolimpio = text;

		var linea1a = textolimpio;

		console.log("sucia2::::" + linea1a);


		await worker.terminate();

		//res.send(linea1a);

		//res.end();

		let settings = { method: "Get" };

		fetch("http://192.168.0.36:8081/ocr/imgvideo.jpg/", settings).then(res => res.json()).then((json) => {


			if (json.ok) return json.json();

			var errordocumento = "";

			var valid = "";

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

			if (json.details[3].error) {

				errordocumento = json.details[3].error;

				console.error("esto es el valor de errordocumento" + errordocumento);

				res.write(`<p class='uno'>Error errordocumento: <b>${errordocumento}</b></p>`);
			}

			if (json.valid) {

				valid = json.valid.toString();

				res.write(`<p class='dos'>Documento válido?: <b>${valid}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Documento válido?: <b>Revisar, faltan datos!!</b></p>`);
			};

			if (json.fields.documentCode) {

				documentCode = json.fields.documentCode.toString();

				res.write(`<p class='uno'>Tipo Doc: <b>${documentCode}</b></p>`);

			} else {

				res.write("<p class='uno' style='color: red;'>Tipo Doc: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (json.fields.issuingState) {

				issuingState = json.fields.issuingState.toString();

				res.write(`<p class='dos'>País Emisor Doc: <b>${issuingState}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>País Emisor Doc: <b>------</b></p>`);
			};

			if (json.fields.documentNumber) {

				documentNumber = json.fields.documentNumber.toString();

				res.write(`<p class='uno'>Num. Doc: <b>${documentNumber}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Num. Doc: <b>------</b></p>`);
			};

			if (json.fields.documentNumberCheckDigit) {

				documentNumberCheckDigit = json.fields.documentNumberCheckDigit.toString();

				res.write(`<p class='dos'>Digito control: <b>${documentNumberCheckDigit}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Digito control: <b>------</b></p>`);
			};

			if (json.fields.optional1) {

				optional1 = json.fields.optional1;

				res.write(`<p class='uno'>Num. id País: <b>${optional1}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Num. id País: <b>------</b></p>`);
			};

			if (json.fields.birthDate) {

				birthDate = json.fields.birthDate.toString();

				res.write(`<p class='dos'>F. Nacimiento: <b>${birthDate}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>F. Nacimiento: <b>------</b></p>`);
			};

			if (json.fields.sex) {

				sex = json.fields.sex.toString();

				res.write(`<p class='uno'>Sexo: <b>${sex}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Sexo: <b>------</b></p>`);
			};

			if (json.fields.expirationDate) {

				expirationDate = json.fields.expirationDate.toString();

				res.write(`<p class='dos'>F.Caducidad:<b>${expirationDate}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>F.Caducidad:<b>------</b></p>`);
			};

			if (json.fields.nationality) {

				nationality = json.fields.nationality.toString();

				res.write(`<p class='uno'>Nacionalidad: <b>${nationality}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Nacionalidad: <b>------</b></p>`);
			};

			if (json.fields.firstName) {

				firstName = json.fields.firstName.toString() + "\n";

				res.write(`<p class='dos'>Nombre: <b>${firstName}</b></p>`);

			} else {

				res.write(`<p class='dos' style='color: red;'>Nombre: <b>------</b></p>`);
			};

			if (json.fields.lastName) {

				lastName = json.fields.lastName.toString();

				res.write(`<p class='uno'>Apellidos: <b>${lastName}</b></p>`);

			} else {

				res.write(`<p class='uno' style='color: red;'>Apellidos: <b>------</b></p>`);
			};

		}).catch((err) => {
			console.error("kakakakaka:::::::::::::::::::::: " + err + " ::::::::::::pppasdasdasdasdasdasdasdad")
			//next(err)
			//res.write(`<p class='uno' style='color: red;'>Fallo!!!:<b>${err}</b></p>`);

			res.end();
		});



	})().catch((err) => {
		console.error(err)
		next(err)
	});

});


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.get('/mrz/:linea1/:linea2/:linea3', function (req, res) {

	var linea1 = req.params.linea1;
	var linea2 = req.params.linea2;
	var linea3 = req.params.linea3;

	var resultado = linea1 + '\r\n' + linea2 + '\r\n' + linea3;

	var result = parse(resultado);

	console.log(result);

	res.send(result);

});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.post('/crear', function (req, res, next) {

	var nomImagenDocumento = req.body.nomImagenDocumento;

	sharp.cache({ files: 0 });

	console.log(req.body)

	console.log(nomImagenDocumento)

	var pathimagen = "./public/imagenes/imagentemp.jpg";

	//const imgname = new Date().getTime().toString();
	const imgname = Math.floor(Math.random() * 10000).toString();

	//esto hace que funcione tanto jpg como png, etc..
	var base64Datab = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	fs.writeFileSync(pathimagen, base64Datab, 'base64', function (err) {
		// If an error occurred, show it and return
		if (err) return console.error(err);
		// Successfully wrote to the file!
	});

	var nuevonombreimagen = imgname +"_imgdoc.jpg";

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

const srvr = http.createServer(app).listen(8081);

srvr.timeout = 16000;
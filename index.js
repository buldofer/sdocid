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


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////



	
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

router.post('/ocr', function (req, res, next) {

	//esto hace que funcione tanto jpg como png, etc..
	var base64Datab = req.body.blob.replace(/^data:([A-Za-z-+/]+);base64,/, '');

	sharp.cache({ files: 0 });

	console.log(req.body)

	var pathimagen = "./public/imagenes/temp.jpg";

	const imgname = Math.floor(Math.random() * 10000).toString();

	

	fs.exists(pathimagen, function (exists) {
		if (exists) {
			//Show in green
			console.log("Existe el archivo: " + pathimagen);

		} else {

			fs.writeFileSync(pathimagen, base64Datab, 'base64', function (err) {
				// If an error occurred, show it and return
				if (err) return console.error(err);
				// Successfully wrote to the file!
				console.log("Ha sido creado el archivo: " + pathimagen);
			});
		}
	});

	var nuevonombreimagen = "v_temp.jpg";
	
	var nuevonombreimagena = "./public/imagenes/v_temp.jpg";




	global.test = nuevonombreimagen;

	var imagentemporal = "./public/imagenes/" + nuevonombreimagen +

	sharp(pathimagen).resize({ width: 700 }).toFile("./public/imagenes/" + nuevonombreimagen)
		.then(function (newFileInfo) {

			console.log("Success");

		}).then(function () {
				

			fs.unlink(pathimagen, function (err) {
				if (err) throw err;
				console.log('fffffffffffffFile deleted!');
			});
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

				const { data: { text } } = await worker.recognize("./public/imagenes/" + nuevonombreimagen, { rectangle });

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


				res.send(result);

				fs.unlink("./public/imagenes/v_temp.jpg", function (err) {
					if (err) throw err;
					console.log("El archivo: " + "./public/imagenes/v_temp.jpg" + ", ha sido eliminado");
				});


			})().catch((err) => {
				console.error(err)
				//next(err)	
			})
 

		});
	
	//var linea1 = req.params.linea1;

	//var urlimagen = 'http://192.168.0.36:8081/imagenes/' + linea1;


	//var urlimagen = linea1;



});

app.get('/ocrk/:linea1', function (req, res, next) {

	var linea1 = req.params.linea1;

	if (linea1 == 0) {

		var urlimagen = 'http://192.168.0.36:8081/imagenes/imgvideo.jpg';
		
	} else {

		var urlimagen = 'http://192.168.0.36:8081/imagenes/' + linea1;
	}

	res.setHeader('Content-Type', 'text/html; charset=utf-8');

	//var urlimagen = 'http://192.168.0.36:8081/imagenes/imgvideo.jpg';

	var htmlcabecera =`<html>
					<head>
					${head}
						<style>

							${estilos_func_ap}

							</style>
					</head>
				<body>
				<div class="buscarfichero">
						<label>
							<input style ="display:none;" type="file" name="file-5" id="ficheroscan" accept="image/png, image/jpeg"/>
							<img src="http://192.168.0.36:8081/img/image-search.png"  alt="Buscar imagen">
						</label>
					</div>

					<div class="escanearimagen">
						<label>
						<input style ="display:none;" type="file" name="file-5" id="escanearimagen" accept="image/png, image/jpeg"/>
						<img  src="http://192.168.0.36:8081/img/camera.png" alt="Escanear">
						</label>
					</div>

					<div class="camara">
						<label>
							<button id="startbutton" style="display:contents;"></button>
							<img src="http://192.168.0.36:8081/img/camerairis.png"  alt="Camara">
						</label>
					</div>
					
					<div class="camaratest">
						<label>
							<button id="ocrtest" style="display:contents;></button>
							<img src="http://192.168.0.36:8081/img/camerairis.png"  alt="OCRTEST">
						</label>
					</div>
				<div>
					<img id="phototest" src="${urlimagen}" width="1024px" class="responsive" style="margin-left: 100px;" alt="Foto video">
				</div>

				<div id="contador"></div><div id="contadorresultado"></div>

				<input type="file"><canvas id="canvasocr"></canvas><div id="progress"></div>

<textarea id="textarea"></textarea>

				<div id="canvasdiv"><canvas id="canvas"></canvas></div>

				<div id="capacamara">

					<video id="video"></video>
					
					<div id="salida">

						<img id="photo" src="http://192.168.0.36:8081/recursos/imgblanco.png" alt="Sin imagen">

					</div>

			</div>`;
	
	var scripta = `<script>
	
	$(document).ready(function() {

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

							$("#photo").css("display", "block");

							setTimeout(function() {

							crearimagenvideo();

							}, 1000);

						});

						async function crearimagenvideo() {

							var nomImagenDocumento = "imgvideo";
							
							var imagendocumento = document.getElementById("phototest");
							var canvasimagendocu = document.createElement("canvas");
							canvasimagendocu.width = imagendocumento.naturalWidth;
							canvasimagendocu.height = imagendocumento.naturalHeight;
							canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
							$.ajax({
							type: "POST",
							url: "http://192.168.0.36:8081/crearimagenvideo",
							data: {
							blob: document.getElementById("photo").src.blob.replace(/^data:([A-Za-z-+/]+);base64,/, ''),
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

							startup();

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
	}

	});
		</script>

			<script>

			function startup() {

			var capacamaradiv = document.getElementById('capacamara');

			capacamaradiv.style.visibility ="visible";

			var salida = document.getElementById('salida');
			
			var startbutton = document.getElementById('startbutton');

			var photo = document.getElementById('photo');

			salida.style.display = "none";

			video.style.display = "block";

			const constraints = {
				advanced: [{
					facingMode: "environment",
					width: {
						min: 1024,
						ideal: 1024,
						max: 1024
					},
					height: {
						min: 768,
						ideal: 768,
						max: 768
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

					clearphoto();

				takepicture();

				ev.preventDefault();

			}, false);

			photo.addEventListener('click', function (ev) {

		clearphoto();

				takepicture();

				ev.preventDefault();

			}, false);


			clearphoto();
		}

		function takepicture() {


			//salida.style.display = "none";
				
			//video.style.display  = "block";

			//canvas.style.display = "none";

			photo.setAttribute('src', '');
						
			if (width && height) {
				
			canvas.width = width;
				
			canvas.height = height;
				
			context.drawImage(video, 0, 0, width, height);
					
			var data = canvas.toDataURL('image/png');
				
			photo.setAttribute('src', data);
				
			salida.style.display = "block";
				
			video.style.display  = "block";

			canvas.style.display = "none";


			var base64String = base64String = /,(.+)/.exec(photo.src)[1]; 


		  $.ajax({
			type: "POST",
			url: "http://192.168.0.36:8081/ocr",
			data: {
			blob: photo.src
			}
			}).done(function(o) {

			var sss = JSON.parse(o);

			 console.log(sss.format);

			 alert(sss.fields.documentCode)
			
			setTimeout(function() {

			}, 2000);

			});

			} else {
			
				clearphoto();
			}
			//continuarescaneando();

				clearphoto();
		}
			
		function clearphoto() {
			
			salida.style.display = "none";
				
			video.style.display  = "block";
			
			context.fillStyle = "#AAA";
			
			context.fillRect(0, 0, canvas.width, canvas.height);

			var data = canvas.toDataURL('image/png');
			
			photo.setAttribute('src', data);
		}

	function guardarfirma() {
			var imagendocumento = document.getElementById("phototest");
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

		const progress = document.getElementById('progress')

		const textarea = document.getElementById('textarea')

		const canvasocr = document.getElementById("canvasocr")

		document.querySelector('input[type="file"]').onchange = function() {
			let img = this.files[0]
			let reader = new FileReader()
			reader.readAsDataURL(img)

			reader.onload = function() {
				drawImage(reader.result)
			}
	}

		function drawImage(url) {
			let ctx = canvasocr.getContext('2d')
			let image = new Image()
			image.src = url
			image.crossOrigin = "Anonymous";
			image.onload = () => {
				canvasocr.width = image.width
				canvasocr.height = image.height
				ctx.drawImage(image, 0, 0)

				let src = ctx.getImageData(0, 0, canvasocr.width, canvasocr.height)

				
			$.ajax({
			type: "POST",
			url: "http://192.168.0.36:8081/ocr",
			data: {
			blob: src
			}
			}).done(function(o) {

			var sss = JSON.parse(o);

			 console.log(sss.format);

			 alert(sss.fields.documentCode)
			
			setTimeout(function() {

			}, 2000);

			});

			}
	}

	function runocr() {

			var imagendocumento = document.getElementById("phototest");
			var canvasimagendocu = document.createElement("canvas");
			canvasimagendocu.width = imagendocumento.naturalWidth;
			canvasimagendocu.height = imagendocumento.naturalHeight;
			canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);

			var imgphoto = document.getElementById("phototest");

			var kaka = imgphoto.src.toString();

			kaka = kaka.replace("http://192.168.0.36:8081/imagenes/", "");

			$.ajax({
			type: "GET",
			url: "http://192.168.0.36:8081/ocr/"+ kaka
			}).done(function(o) {

			var sss = JSON.parse(o);

			 console.log(sss.format);

			 alert(sss.fields.documentCode)
			
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
						

				</script>
						
		</body>

	</html>`;
		
	res.write(htmlcabecera);

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

		//console.log("Valor result mrzOCRK::::::: " + result);

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

		// imgvideo

		if (resultado !==null) {

			//return result

			if (result.fields.documentCode) {

				documentCode = result.fields.documentCode.toString();

				res.write("<p class='uno'>Tipo Doc: " + "<b>" + documentCode + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Tipo Doc: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.issuingState) {

				issuingState = result.fields.issuingState.toString();

				res.write("<p class='dos'>País Emisor Doc: " + "<b>" + issuingState + "</b>" + "</p>");

			} else {

				res.write("<p class='dos' style='color: red;'>País Emisor Doc: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.documentNumber) {

				documentNumber = result.fields.documentNumber.toString();

				res.write("<p class='uno'>Num. Doc: " + "<b>" + documentNumber + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Num. Doc: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.documentNumberCheckDigit) {

				documentNumberCheckDigit = result.fields.documentNumberCheckDigit.toString();

				res.write("<p class='dos'>Digito control: " + "<b>" + documentNumberCheckDigit + "</b>" + "</p>");

			} else {

				res.write("<p class='dos' style='color: red;'>Digito control: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.optional1) {

				optional1 = result.fields.optional1;

				res.write("<p class='uno'>Num. id País: " + "<b>" + optional1 + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Num. id País: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.birthDate) {

				birthDate = result.fields.birthDate.toString();

				res.write("<p class='dos'>F. Nacimiento: " + "<b>" + birthDate + "</b>" + "</p>");

			} else {

				res.write("<p class='dos' style='color: red;'>F. Nacimiento: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.sex) {

				sex = result.fields.sex.toString();

				res.write("<p class='uno'>Sexo: " + "<b>" + sex + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Sexo: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.expirationDate) {

				expirationDate = result.fields.expirationDate.toString();

				res.write("<p class='dos'>F.Caducidad: " + "<b>" + expirationDate + "</b>" + "</p>");

			} else {

				res.write("<p class='dos' style='color: red;'>F.Caducidad: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.nationality) {

				nationality = result.fields.nationality.toString();

				res.write("<p class='uno'>Nacionalidad: " + "<b>" + nationality + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Nacionalidad: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.firstName) {

				firstName = result.fields.firstName.toString() + "\n";

				res.write("<p class='dos'>Nombre: " + "<b>" + firstName + "</b>" + "</p>");

			} else {

				res.write("<p class='dos' style='color: red;'>Nombre: " + "<b>" + "------" + "</b>" + "</p>");
			};

			if (result.fields.lastName) {

				lastName = result.fields.lastName.toString();

				res.write("<p class='uno'>Apellidos: " + "<b>" + lastName + "</b>" + "</p>");

			} else {

				res.write("<p class='uno' style='color: red;'>Apellidos: " + "<b>" + "------" + "</b>" + "</p>");
			};

			res.write("</div>");

			res.write(`	<div class="contenedor" id="contenedorlienzofirma">
							<div id="lienzo"></div>
							<input name="guardar" type="button" value="guardar" onclick="guardarfirma();">
						</div>`)

			res.write(scripta);

			res.end();
		}

		//imgvideo

	})().catch((err) => {

		console.error(err)

		//next(err)
		console.error("kakakakaka2:::::::::::::::::::::: " + err + " ::::::::::::pppasdasdasdasdasdasdasdad");

		//res.write(htmlcabecera);


		//res.write("<div class='contenedor' id='contenedorlienzofirma'><div id='lienzo'></div><input name='guardar' type='button' value='guardar' onclick='guardarfirma();'></div>")

		res.write(scripta);

		res.write("<div class='contenedor' id='contenedorlienzofirma'><div id='lienzo'></div><input name='guardar' type='button' value='guardar' onclick='guardarfirma();'></div>")

		res.write(`<p class='uno' style='color: red;'><b>No ha sido posible detectar correctamente el documento</b></p>
		
		<script>
		/*
		function startup() {

			var capacamaradiv = document.getElementById('capacamara');

			capacamaradiv.style.visibility ='visible';

			var salida = document.getElementById('salida');
			
			var startbutton = document.getElementById('startbutton');

			var photo = document.getElementById('photo');

			salida.style.display = 'none';

			video.style.display = 'block';

			const constraints = {
				advanced: [{
					facingMode: 'environment',
					width: {
						min: 1024,
						ideal: 1024,
						max: 1024
					},
					height: {
						min: 768,
						ideal: 768,
						max: 768
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
					console.log('An error occurred: ' + err);
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

			photo.addEventListener('click', function (ev) {

				salida.style.display = 'block';
				
			video.style.display  = 'block';

			canvas.style.display = 'block';

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
				
			salida.style.display = 'block';
				
			video.style.display  = 'none';

			canvas.style.display = 'none';
				
			} else {
			
				clearphoto();
			}
			//continuarescaneando();
		}
			
		function clearphoto() {
			
			salida.style.display = 'none';
				
			video.style.display  = 'block';
			
			context.fillStyle = '#AAA';
			
			context.fillRect(0, 0, canvas.width, canvas.height);

			var data = canvas.toDataURL('image/png');
			
			photo.setAttribute('src', data);
		}
	var width = 800    // We will scale the photo width to this

						var height = 0     // This will be computed based on the input stream

						var streaming = false

						var context = canvas.getContext('2d')

						document.getElementById('startbutton').onclick = function() {startup()}

						*/

			</script>`);

		res.end();
	});

});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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
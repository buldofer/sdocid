var cropper = "";

var request;

var db;

var dbName = "documentos";

var resultado;

var versionsdelabbdd = indexedDB.open(dbName).version;

var customerObjectStore;

var numtablas;

var numtablasactual;

var movimientos = new Array();

var pulsado;

var myObj;

var datosinquilinojson;


var urlsite = "https://" + location.host.split(":")[0]+"/mrz";

var 
	cliente,
	reserva,
	tipoinquilino,
	documentType,
	issuer,
	lastName,
	otherNames,
	documentNumber,
	nationality,
	birthDate,
	sex,
	expiryDate,
	personalNumber,
	urldocimage,
	urlfirmaimage;

	cliente = "1234-5678-9012" ;

	reserva = "";

	tipoinquilino = "";


window.onload = function() {
	

	limpiarvariables();

	crearLienzo();


};

/*
$.ajax({
	url: 'https://154.61.227.201/mrz/guardarimagen.php?documentos=' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber,
	type: 'post',
	data: $('#form').serialize()
});
*/

function limpiarvariables(){

	cliente = "1234-5678-9012";

	reserva = "1221";

	tipoinquilino = "";

	documentType = "";

	issuer = "";

	lastName = "";

	otherNames = "";

	documentNumber = "";

	nationality = "";

	birthDate = "";

	sex = "";

	expiryDate = "";

	personalNumber = "";

	image = "";

	urldocimage = "";

	urlfirmaimage = "";

	nombreficheropdf = "";


}

function crearLienzo() {

	//Aquí es donde vamos a insertar el código javascript para crear el lienzo

	canvass = document.createElement('canvas');

	canvass.setAttribute('width', 300);
	canvass.setAttribute('height', 300);
	canvass.setAttribute('id', 'canvass');
	canvasDiv.appendChild(canvass);
	if (typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvass);
	}
	contextlienzo = canvass.getContext("2d");


	// Para poder firmar desde el ratón
	/*

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

*/

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

function guardarconf() {
	
 // var clienteinfo = document.getElementById("clienteinfo").value;
		
  var reservainfo = document.getElementById("reservainfo").value;
	
	//cliente = clienteinfo ;
	
	reserva = reservainfo ;
	
	tipoinquilino = getRadioButtonSelectedValue(document.datosdocumento.inqui);
	
 // alert(" Cliente: "+clienteinfo+" ; Reserva: "+reservainfo);
	
}

function getRadioButtonSelectedValue(ctrl){
	
    for(i=0;i<ctrl.length;i++){
		
        if(ctrl[i].checked){ 
			return ctrl[i].value;			
		}
	}
}

function config() {
	
	document.getElementById('cuadromrz').style.display  = "none";
	
	document.getElementById('docmrz').style.display     = "none";

	document.getElementById('confmrz').style.display    = "block";
	
}

function scandoc() {
	
	cuadromrz.style.display = "block";
	
	document.getElementById('confmrz').style.display    = "block";
	
	document.getElementById('docmrz').style.display     = "none";

	resetformulario.style.display = "block";
	
	
}

function documentos() {
	
	document.getElementById('cuadromrz').style.display  = "none";

	document.getElementById('confmrz').style.display    = "none";
	
	document.getElementById('docmrz').style.display     = "block";

	limpiarvariables();

}

function inicio(){

	startup();
	
	buscarimagen.style.display = "none";

	labelbuscarimagen.style.display = "none";

	startbutton.style.display = "block";

	tomadedatos.style.display = "none";
}

function startup() {

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

	})
		.catch(function (err) {
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
		
		
    } else {
		
      clearphoto();
		
    }
	
	 continuarescaneando();
	
}
	
function clearphoto() {
	  
	salida.style.display = "none";
		
	video.style.display  = "block";
	  
    context.fillStyle = "#AAA";
	  
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
	  
    photo.setAttribute('src', data);
	  
}

function continuarescaneando(){
	
	cropper = new Cropper(photo, { 
		
					dragMode: 'none',
					viewMode: 1,	
					autoCropArea: 1,
					background: false,
					zoomable: false,
					zoomOnWheel: false,
					restore: false,
					guides: false,
					center: false,
					highlight: true,
					cropBoxMovable: false,
					cropBoxResizable: false,
					toggleDragModeOnDblclick: false,
		

      });

		
	cropper.crop();
	
		
	photo.addEventListener('crop', function () {
		
		var canvascropped = cropper.getCroppedCanvas();
	
		canvascropped.imageSmoothingQuality = "high";
			
		tess(canvascropped,1);
				
		procesobusquedamrz1.style.display = "block";
					
	});

	
	//cropper.reset();
	
}
						  
function parardeescanear() {
	
	new Cropper(photo, {
  	ready() {
    // this.cropper[method](argument1, , argument2, ..., argumentN);
    this.cropper.move(1, -1);

    // Allows chain composition
    this.cropper.move(1, -1).rotate(45).scale(1, -1);
	  
	  console.log(this.cropper === cropper);
		
	tess(cropper.getCroppedCanvas(),0);
		
  },
		
});

	
}




function load_file() {
	
	document.getElementById('inputguardardatosinqui').click();

	var imgthumnil = document.getElementById("thumbnil");
	
	photo.style.display = "block";
	
	var reader = new FileReader();

		reader.onload = function(){

			var img = null;
			
			img = new Image();
			
			img.src = reader.result;

			img.onload = function(){

				document.getElementById('resultado').innerHTML = '';

				document.getElementById('resultado').appendChild(img);

				img.style.visibility = "hidden";

				img.setAttribute('id', 'imagenfichero');
				
				photo.setAttribute('src', img.src);

				continuarescaneando();

				imgthumnil.style.display = "block";

				imgthumnil.setAttribute('src', img.src);

				document.getElementById('base64').value = photo.src;
			
				//document.form.submit();

				document.getElementById('resultado').style.display = "none";
				
			    salida.style.display = "block";

				video.style.display  = "none";
													
				
					
				/*
				buscarimagen.style.display = "none";
	
				labelbuscarimagen.style.display = "none";

				*/

				tomadedatos.style.display = "none";

				//continuarescaneando();

				};				
			
			};
	
	reader.readAsDataURL(document.getElementById('buscarimagen').files[0]);	

	//continuarescaneando();

	
}


function takepicturefile() {
	 		
	capturaarchivo.style.display = "block";
	
	capturaarchivo.addEventListener('click', function(ev){
		
    continuarescaneando();
		 
    ev.preventDefault();
		
    }, false);
		 
}
	
function cleanText(string){

	var specialChars = "!@#$^&%*()+=-[]\/{}|_>:?,.¡¿'`´ ";

	for (var i = 0; i < specialChars.length; i++) {
		
		string = string.replace(new RegExp('\\' + specialChars[i], 'gm'), '');
	}
	
	string = string.replace(/([\r\n\\])+/g, '');
	
	return string;

}

function tess(canvaaa,control){
		
	var resultadodefinitivo;
	
	if (control===1){
			
		let tesseractSettings = {
		
		lang: 'mrz'
   		

		};
		
		
	// Convert an image to text. This task works asynchronously, so you may show
	// your user a loading dialog or something like that, or show the progress with Tesseract
	
	Tesseract.recognize(canvaaa, tesseractSettings).then(function(result){
		
	// The result object of a text recognition contains detailed data about all the text
	// recognized in the image, words are grouped by arrays etc
		
		//document.getElementById('tabladoc').style.display  = "block";
		
		document.getElementById('transcription').style.display="none";
		
		procesobusquedamrz1.style.display = "block";
		
	
		var textolimpio = cleanText(result.text);

		textolimpio = textolimpio.replace(/\n/, '');

		
		console.log(" TODO EL TEXTO " + textolimpio);

	
		var regex = /(((ID*)|(P<[A-Z0-9]*)|(PER)|(C<*))[A-Z0-9<]{30,92}$)/;
		
		var match;
		
		
		match = regex.exec(textolimpio);
	
		
	//	console.log("Match encontrado antes de limpiarlo: " + match);
		
		var matchlimpio = 0;

		if (match[0]!=null){

			matchlimpio = match[0];

			var rematchlimpio;

			rematchlimpio = matchlimpio;


			rematchlimpio = rematchlimpio.replace(/.+(?=ID|(P<\b))/, '');


			console.log("matchlimpio : " + rematchlimpio); // I'm Jack, or johnny, but I prefer Jack.

			// document.getElementById('transcription').innerText = rematchlimpio+ " Tamaño : " + rematchlimpio.length.toString() ;

			console.log("transcription: " + rematchlimpio + " Tamaño : " + rematchlimpio.length.toString());


			CosultaMrz(rematchlimpio);

		}else{


			console.log("match es nulo"); // I'm Jack, or johnny, but I prefer Jack.

		}

		
		
		
    });
		
		
	} else if (control===0){
		
		document.getElementById('transcription').innerText = "Documento encontrado";
			
	}			

}

function tomarfotoDocOut(){
	
	var tomarfotodocumentos = document.getElementById('tomarfoto');
	
	tomarfotodocumentos.style.backgroundColor = "gold";	
	
}

function CosultaMrz(datosocr){
		
var xhttp = new XMLHttpRequest();
	
xhttp.onreadystatechange = function() {
	
if (this.readyState === 4 && this.status === 200) {
	
	myObj = JSON.parse(this.responseText);
	
	if (myObj["error"]){
		
		document.getElementById('errores').innerText = myObj["error"];
		
		//takepicture();

		procesobusquedamrz1.style.display = "none";
		
	} else {
	
	if (!myObj["documentType"]){

			document.getElementById('documentType').innerHTML = "TIPO DE DOCUMENTO NO VÁLIDO";

		}else{

			document.getElementById('documentType').innerHTML = myObj["documentType"];

		}
			
		if (!myObj["issuerOrg"]) {

			document.getElementById('issuer').innerHTML = "PAIS NO VÁLIDO";
		} else {
			document.getElementById('issuer').innerHTML = myObj["issuerOrg"]["abbr"];

		}

		//parardeescanear();

	document.getElementById('otherNames').innerHTML = myObj["names"]["firstName"];

	document.getElementById('lastName').innerHTML = myObj["names"]["lastName"];

	document.getElementById('documentNumber').innerHTML = myObj["documentNumber"];

	document.getElementById('nationality').innerHTML = myObj["nationality"]["abbr"];

	document.getElementById('birthDate').innerHTML = myObj["dob"];

	document.getElementById('sex').innerHTML = myObj["sex"]["abbr"];

	document.getElementById('expiryDate').innerHTML = myObj["expiry"];

	document.getElementById('personalNumber').innerHTML = myObj["optionalData"];
	
	document.getElementById('tablaconf').style.display="none";


	agregardoc.style.display = "block";

	crearxml.style.display = "block";

	//verpartepantalla.style.display = "block";

	resetformulario.style.display = "block";
		
		
	tablamrz.style.display = "inline-table";

		//crearLienzo();
		
	documentType = myObj["documentType"];
		
	issuer = myObj["issuerOrg"]["full"];
	
	lastName = myObj["names"]["lastName"];
	
	otherNames = myObj["names"]["firstName"];
	
	documentNumber = myObj["documentNumber"];
	
	nationality = myObj["nationality"]["full"];
	
	birthDate = myObj["dob"];
	
	sex = myObj["sex"]["full"];
	
	expiryDate = myObj["expiry"];
	
	personalNumber = myObj["optionalData"];

		$.ajax({
			url: 'https://154.61.227.201/mrz/guardarimagen.php?documentos=' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber,
			type: 'post',
			data: $('#form').serialize()
		});



		procesobusquedamrz1.style.display = "none";


		urldocimage = urlsite+'/' + cliente + '/imagenes/' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber + '.png';

		urlfirmaimage = urlsite + '/' + cliente + '/imagenes/' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber + '-' + 'fd.png';

		nombreficheropdf = cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber + '.pdf';

		populateSomeData(cliente, reserva, tipoinquilino, documentType, issuer, lastName, otherNames, documentNumber, nationality, birthDate, sex, expiryDate, personalNumber, urldocimage, urlfirmaimage);
	
		console.log(this.responseText);	

		contenedorlienzofirma.style.display = "block";

		datosinquilinojson = datosocr;


	

}
	
}
};
		
	/*
	
	IMPORTANTE, hay que poner esto al inicio de test2.php, para que funcione 
	
	
	<?php
ob_start();

 header('Content-type: application/json');
        header("Access-Control-Allow-Origin: *");
        ob_end_flush();

include('mrz.php');
$MRZ = new SolidusMRZ;

.........

.......


?>
	
	*/
	
	
xhttp.open("POST", "https://154.61.227.201/mrz/test2.php?documento=" + datosocr, true);
xhttp.send();

	
			
}
		
function guardarfirma() {


	$.post('https://154.61.227.201/mrz/guardarimagen.php?documentos=' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber + '-' + 'fd',
		{
			base64: canvass.toDataURL()
		});

	//parardeescanear();

	crearficherosxml();

	verpartepantalla();

	//guardarparteenpdf();

	//location.reload();

	//leerdatoslocales();

	
}

function guardarparteenpdf() {


	var contenedorvistaparte = document.getElementById('contenedorvistaparte').innerText;

	var contenedorvistaparteh = document.getElementById('contenedorvistaparte').innerHTML;

	var vistapartetextolegal = document.getElementById('vistapartetextolegal').innerText;

	var vistapartetextolegalh = document.getElementById('vistapartetextolegal').innerHTML;


	if (!myObj) {

		alert("No se puede crear el archivo PDF");

	} else {

	var pdf = new jsPDF({
		orientation: 'portrait',
		unit: 'px',
		format: 'a4'
	});



	var imagen2 = canvass.toDataURL("image/png");


	$.post('https://154.61.227.201/mrz/pdf/crearpdf.php?datosparte=' + contenedorvistaparte + vistapartetextolegal + '&nombreficheroparte=' + nombreficheropdf);

	

	//pdf.autoPrint({ variant: 'non-conform' });
	//pdf.text(contenedorvistaparte, 35, 60, align = 'left');
	//pdf.addImage(imagen2, 'PNG', 40, 325);

		pdf.setFontSize(12);

		html2canvas(document.body).then(function (canvasss) {

			var imgr = canvasss.toDataURL("image/png");
			pdf.addImage(imgr, 'PNG', 40, 325);
	
		});

		var blob = pdf.output("blob");
		window.open(URL.createObjectURL(blob));
		pdf.save(nombreficheropdf);

	//pdf.text(vistapartetextolegal, 35, 490, align ='left');
	

}

}


function crearficherosxml() {

	var xmlhttp = new XMLHttpRequest();

	dbdd.inquilinos.each(function (inquilinos) {
		console.log(JSON.stringify(inquilinos));


		var datosenbbddlocal = JSON.stringify(inquilinos);

		xmlhttp.open("POST", "https://154.61.227.201/mrz/crearxml.php?documentos=" + datosenbbddlocal, true);

		xmlhttp.send();

	});

}


function verpartepantalla() {

	//cuadromrz.style.display = "none";

	//confmrz.style.display = "none";


	

	if (!myObj) {

		alert("Noy partes para mostrar");

	} else {

		var contenedorvistaparte = document.getElementById('contenedorvistaparte');

		contenedorvistaparte.style.display = "block";

		var vistapartetextolegal = document.getElementById('vistapartetextolegal');

		vistapartetextolegal.style.display = "block";

		document.getElementById('vptipodoc').innerHTML = myObj["documentType"];

		//document.getElementById('contenedorvistaparte') = myObj["issuerOrg"]["full"];

		document.getElementById('vpapellido1').innerHTML = myObj["names"]["lastName"];

		document.getElementById('vpnombre').innerHTML = myObj["names"]["firstName"];

		document.getElementById('vpnumdociden').innerHTML = myObj["documentNumber"];

		document.getElementById('vppaisnacionalidad').innerHTML = myObj["nationality"]["full"];

		document.getElementById('vpfnacimiento').innerHTML = myObj["dob"];

		document.getElementById('vpsexo').innerHTML = myObj["sex"]["full"];

		document.getElementById('vpfexpira').innerHTML = myObj["expiry"];

		document.getElementById('vpnumdociden').innerHTML = myObj["optionalData"];

		document.getElementById('vpimagenfirma').setAttribute('src', urlfirmaimage);
		
	}
	

	guardarparteenpdf();

}



/*

function generarparte() {


	dbdd.inquilinos.each(function (inquilinos) {
		console.log(JSON.stringify(inquilinos));

		var datosinquilinos = JSON.stringify(inquilinos);
		

		$.ajax({
			url: 'https://154.61.227.201/mrz/pdf/pdf.php?datos=' + datosinquilinos,
			type: 'post'

		});


		$.ajax({
			url: 'https://154.61.227.201/mrz/pdf/tablapdf.php?datos=' + datosinquilinos,
			type: 'post'

		});

	});
}


*/

async function f() {

	let promise = new Promise((resolve, reject) => {

		dbdd.inquilinos.each(function (inquilinos) {

			cliente = inquilinos.cliente;

			reserva = inquilinos.reserva;

			tipoinquilino = inquilinos.tipoinquilino;

			documentType = inquilinos.documentType;

			issuer = inquilinos.issuer;

			lastName = inquilinos.lastName;

			otherNames = inquilinos.otherNames;

			documentNumber = inquilinos.documentNumber;

			nationality = inquilinos.nationality;

			birthDate = inquilinos.birthDate;

			sex = inquilinos.sex;

			expiryDate = inquilinos.expiryDate;

		//	personalNumber = dinquilinos.personalNumber;
			urldocimage = inquilinos.urldocimage;

			urlfirmaimage = inquilinos.urlfirmaimage;

			console.log("en f dentro de la funcion real::" + cliente + " " + reserva + " " + tipoinquilino + " " + documentType + " " + issuer + " " + lastName + " "
				+ otherNames + " " + documentNumber + " " + nationality + " " + birthDate + " " + sex + " " + expiryDate + " " + personalNumber + " " + urldocimage + " " + urlfirmaimage);

				//////

			var tabla;

			var divs;

				tabla = "<table class = \"table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-center\"  align = \"center\" >";

				tabla += "<tr>";

		

				var objurl = window.URL.createObjectURL(inquilinos.image);


			if (objurl.value >50 ) {

				tabla += "<td> <p>Documento</p> <br> <img src=" + objurl + "></td>";

			} else {

				tabla += "<td> <p>Documento</p> <br>	<img src=\"" + urldocimage + "\"></td>";

			}

				tabla += "<td> <p>Firma</p><br>	<img src=\"" + urlfirmaimage + "\"></td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">cliente</td><td class=\"tdresultado\">" + cliente + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">reserva</td><td class=\"tdresultado\">" + reserva + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Tipo de inquilino</td><td class=\"tdresultado\">" + tipoinquilino + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Tipo de documento</td><td class=\"tdresultado\">" + documentType + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">País</td><td class=\"tdresultado\">" + issuer + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Apellidos</td><td class=\"tdresultado\">" + lastName + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Nombre de Pila</td><td class=\"tdresultado\">" + otherNames + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Número de documento</td><td class=\"tdresultado\">" + documentNumber + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Nacionalidad</td><td class=\"tdresultado\">" + nationality + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Fecha de nacimiento</td><td class=\"tdresultado\">" + birthDate + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Sexo</td><td class=\"tdresultado\">" + sex + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">F. expiración documento</td><td class=\"tdresultado\">" + expiryDate + "</td>";

				tabla += "</tr>";

				tabla += "<tr>";

				tabla += "<td class=\"tddescricipon\">Numero personal de documento</td><td class=\"tdresultado\">" + personalNumber + "</td>";

				tabla += "</tr>";

				tabla += "</table>";

			divs = document.createElement("div");			

			divs.style.marginTop = "40px";

			divs.innerHTML = tabla;

			document.getElementById("tabladinamica").appendChild(divs);

		});

	});

	let result = await promise; // wait till the promise resolves (*)

}

function leerdatoslocales() {

	document.getElementById("tabladinamica").innerHTML = " ";

	f();

}


function limpiarcuadromrz() {

	//var cuadromrzlimpiarc = 	document.getElementById("cuadromrz");

//	cuadromrzlimpiarc.innerHTML = "";

	var containercuadromrz = document.getElementById("cuadromrz");
	var content = containercuadromrz.innerHTML;
	containercuadromrz.innerHTML = content;

	containercuadromrz.style.display = "block";

	//this line is to watch the result in console , you can remove it later	
	console.log("Refreshed"); 


/// End of Wait till page is loaded

} 


function agregardocumento() {



	//location.reload();

	tomadedatos.style.display = "block";


	document.getElementsByTagName("body").reload;

}

function importarficherosxml() {

//	dbdd.inquilinos.clear();

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
			ficheros = JSON.parse(this.responseText);
			console.log(ficheros);

			if (ficheros) {

			for (var i = 0; i < ficheros.length; i++) {
			//	console.log(ficheros[i]["fichero"]);

				// Acceder a cada uno de los ficheros. xml, que haya.
				xmlhttpx.open("GET", "https://154.61.227.201/mrz/1234-5678-9012/" + ficheros[i], false);
				//xmlhttpx.open("GET", "https://154.61.227.201/mrz/1234-5678-9012/1.xml", false);
				xmlhttpx.send();

				console.log("ESTOY EN LA 1000" + ficheros);


				importarabbddlocalxml(xmlhttpx);

			}

			} else {

				alert("No hay ficheros XML para importar");

			}

		}

	};


	xmlhttp.open("GET", "https://154.61.227.201/mrz/funciones.php?ficheros=1&numeroficheros=0", true);
	xmlhttp.send();

}


function importarabbddlocalxml(datosimportarxml){

	var xmlDoc;

		// Obtenemos un objeto XMLDocument con el contenido del archivo xml del servidor
		xmlDoc = datosimportarxml.responseXML;

		// Obtenemos todos los nodos denominados foro del archivo xml
		var docimportadosxml = xmlDoc.getElementsByTagName("documento");

		// Hacemos un bucle por todos los elementos foro
	for (var i = 0; i < docimportadosxml.length; i++) {

			// Del elemento foro, obtenemos del primer elemento denominado "titulo"
			// el valor del primer elemento interno
		var imcliente = docimportadosxml[i].getElementsByTagName("cliente")[0].childNodes[0].nodeValue;

		var imreserva = docimportadosxml[i].getElementsByTagName("reserva")[0].childNodes[0].nodeValue;

		var imtipoinquilino = docimportadosxml[i].getElementsByTagName("tipoinquilino")[0].childNodes[0].nodeValue;

		var imdocumentType = docimportadosxml[i].getElementsByTagName("documentType")[0].childNodes[0].nodeValue;

		var imissuer = docimportadosxml[i].getElementsByTagName("issuer")[0].childNodes[0].nodeValue;

		var imlastName = docimportadosxml[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue;

		var imotherNames = docimportadosxml[i].getElementsByTagName("otherNames")[0].childNodes[0].nodeValue;

		var imdocumentNumber = docimportadosxml[i].getElementsByTagName("documentNumber")[0].childNodes[0].nodeValue;

		var imnationality = docimportadosxml[i].getElementsByTagName("nationality")[0].childNodes[0].nodeValue;

		var imbirthDate = docimportadosxml[i].getElementsByTagName("birthDate")[0].childNodes[0].nodeValue;

		var imsex = docimportadosxml[i].getElementsByTagName("sex")[0].childNodes[0].nodeValue;

		var imexpiryDate = docimportadosxml[i].getElementsByTagName("expiryDate")[0].childNodes[0].nodeValue;

		//var impersonalNumber = docimportadosxml[i].getElementsByTagName("personalNumber")[0].childNodes[0].nodeValue;

		var impersonalNumber = "PROBAR LUEGO.";

		var imurldocimage = docimportadosxml[i].getElementsByTagName("urldocimage")[0].childNodes[0].nodeValue;

		console.log(" " + imcliente + " " + imreserva + " " + imtipoinquilino + " " + imdocumentType + " " + imissuer + " " + imlastName + " "
			+ imotherNames + " " + imdocumentNumber + " " + imnationality + " " + imbirthDate + " " + imsex + " " + imexpiryDate + " " + impersonalNumber + " " + imurldocimage + " " + urlfirmaimage);

		populateSomeData(imcliente, imreserva, imtipoinquilino, imdocumentType, imissuer, imlastName, imotherNames, imdocumentNumber, imnationality, imbirthDate, imsex, imexpiryDate, impersonalNumber, imurldocimage, urlfirmaimage);

			//console.log(this.responseText);

		}

	}


function leerficherosxml() {

	document.getElementById("tabladinamica").innerHTML = " ";

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
			var ficheros = JSON.parse(this.responseText);
			console.log(ficheros);

			if (ficheros) {

			for (var i = 0; i < ficheros.length; i++) {
	
				// Acceder a cada uno de los ficheros. xml, que haya.
				xmlhttpx.open("GET", "https://154.61.227.201/mrz/1234-5678-9012/" + ficheros[i], false);
				//xmlhttpx.open("GET", "https://154.61.227.201/mrz/1234-5678-9012/1.xml", false);
				xmlhttpx.send();

				console.log("ESTOY EN LA 1163" + ficheros);
			
				rellenartablas(xmlhttpx);
				}

			} else {

				alert("No hay ficheros XML para leer");

			}

		}

	};

	xmlhttp.open("GET", "https://154.61.227.201/mrz/funciones.php?ficheros=1&numeroficheros=0", true);
	xmlhttp.send();


	
}


function rellenartablas(datos){

	var xmlDoc;

	// Obtenemos un objeto XMLDocument con el contenido del archivo xml del servidor
	xmlDoc = datos.responseXML;

	// Obtenemos todos los nodos denominados foro del archivo xml
	var documentoxml = xmlDoc.getElementsByTagName("documento");

	// Hacemos un bucle por todos los elementos foro
	for (var i = 0; i < documentoxml.length; i++) {

		// Del elemento foro, obtenemos del primer elemento denominado "titulo"
		// el valor del primer elemento interno
		cliente = documentoxml[i].getElementsByTagName("cliente")[0].childNodes[0].nodeValue;

		reserva = documentoxml[i].getElementsByTagName("reserva")[0].childNodes[0].nodeValue;

		tipoinquilino = documentoxml[i].getElementsByTagName("tipoinquilino")[0].childNodes[0].nodeValue;

		documentType = documentoxml[i].getElementsByTagName("documentType")[0].childNodes[0].nodeValue;

		issuer = documentoxml[i].getElementsByTagName("issuer")[0].childNodes[0].nodeValue;

		lastName = documentoxml[i].getElementsByTagName("lastName")[0].childNodes[0].nodeValue;

		otherNames = documentoxml[i].getElementsByTagName("otherNames")[0].childNodes[0].nodeValue;

		documentNumber = documentoxml[i].getElementsByTagName("documentNumber")[0].childNodes[0].nodeValue;

		nationality = documentoxml[i].getElementsByTagName("nationality")[0].childNodes[0].nodeValue;

		birthDate = documentoxml[i].getElementsByTagName("birthDate")[0].childNodes[0].nodeValue;

		sex = documentoxml[i].getElementsByTagName("sex")[0].childNodes[0].nodeValue;

		expiryDate = documentoxml[i].getElementsByTagName("expiryDate")[0].childNodes[0].nodeValue;

	//	personalNumber = documentoxml[i].getElementsByTagName("personalNumber")[0].childNodes[0].nodeValue;

		urldocimage = documentoxml[i].getElementsByTagName("urldocimage")[0].childNodes[0].nodeValue;

		if (documentoxml[i].getElementsByTagName("urlfirmaimage")[0].childNodes[0]==null){

			alert('no tienen firma' + cliente + " " + reserva + " " + tipoinquilino + " " + documentType + " " + issuer + " " + lastName + " "
				+ otherNames + " " + documentNumber + " " + nationality);
		}else{

			urlfirmaimage = documentoxml[i].getElementsByTagName("urlfirmaimage")[0].childNodes[0].nodeValue;

		}

		

		console.log(" " + cliente + " " + reserva + " " + tipoinquilino + " " + documentType + " " + issuer + " " + lastName + " "
			+ otherNames + " " + documentNumber + " " + nationality + " " + birthDate + " " + sex + " " + expiryDate + " " + personalNumber + " " + urldocimage + " " + urlfirmaimage);

	/////

		tabla = "<table class = \"table is-bordered is-striped is-narrow is-hoverable is-fullwidth is-center\"  align = \"center\" >";

		tabla += "<tr>";

		tabla += "<td> <p>Documento</p><br>	<img src=\"" + urldocimage + "\"></td>";

		tabla += "<td> <p>Firma</p><br>	<img src=\"" + urlfirmaimage + "\"></td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td <br><br></td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">cliente</td><td class=\"tdresultado\">" + cliente + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">reserva</td><td class=\"tdresultado\">" + reserva + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Tipo de inquilino</td><td class=\"tdresultado\">" + tipoinquilino + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Tipo de documento</td><td class=\"tdresultado\">" + documentType + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">País</td><td class=\"tdresultado\">" + issuer + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Apellidos</td><td class=\"tdresultado\">" + lastName + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Nombre de Pila</td><td class=\"tdresultado\">" + otherNames + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Número de documento</td><td class=\"tdresultado\">" + documentNumber + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Nacionalidad</td><td class=\"tdresultado\">" + nationality + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Fecha de nacimiento</td><td class=\"tdresultado\">" + birthDate + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Sexo</td><td class=\"tdresultado\">" + sex + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">F. expiración documento</td><td class=\"tdresultado\">" + expiryDate + "</td>";

		tabla += "</tr>";

		tabla += "<tr>";

		tabla += "<td class=\"tddescricipon\">Numero personal de documento</td><td class=\"tdresultado\">" + personalNumber + "</td>";

		tabla += "</tr>";

		divs = document.createElement("div");

		divs.style.marginTop = "40px";

		divs.innerHTML = tabla;

		document.getElementById("tabladinamica").appendChild(divs);

		tabla += "</table>";

	//////

	}

}

function populateSomeData(cliente, reserva, tipoinquilino, documentType, issuer, lastName, otherNames, documentNumber, nationality, birthDate, sex, expiryDate, personalNumber, urldocimage, urlfirmaimage) {

						//log("Populating some data", "heading");
						
            return dbdd.transaction("rw", dbdd.inquilinos, function () {


							 // dbdd.inquilinos.clear();
							 
				
						//	dbdd.inquilinos.add({cliente: cliente, reserva: reserva, tipoinquilino: tipoinquilino, documentType: documentType, issuer: issuer, lastName: lastName,otherNames: otherNames, documentNumber: documentNumber, nationality: nationality, birthDate: birthDate, sex: sex, expiryDate: expiryDate, personalNumber: personalNumber });
            
				// console.log(JSON.stringify(inquilinos));

							downloadAndStoreImage(cliente, reserva, tipoinquilino, documentType, issuer, lastName, otherNames, documentNumber, nationality, birthDate, sex, expiryDate, personalNumber, urldocimage, urlfirmaimage);
/*
                // Log data from DB:
               dbdd.inquilinos.orderBy('reserva').each(function (inquilinos) {
				   
                   console.log(JSON.stringify(inquilinos));
                });
				
				
            }).catch(function (e) {
				
                console.log(e, "error");
						});
		
	*/					
			});			

}

async function downloadAndStoreImage(cliente, reserva, tipoinquilino, documentType, issuer, lastName, otherNames, documentNumber, nationality, birthDate, sex, expiryDate, personalNumber, urldocimage, urlfirmaimage) {

  	  // https://dexie.org/docs/API-Reference
	
		var res = await fetch(photo.src);

		var blob = await res.blob();



		 dbdd.inquilinos.add({
			cliente: cliente,
			reserva: reserva,
			tipoinquilino: tipoinquilino,
			documentType: documentType,
			issuer: issuer,
			lastName: lastName,
			otherNames: otherNames,
			documentNumber: documentNumber,
			nationality: nationality,
			birthDate: birthDate,
			sex: sex,
			expiryDate: expiryDate,
			personalNumber: personalNumber,
			urldocimage: urldocimage,
			urlfirmaimage: urlfirmaimage,
			image: blob
		});
	
		// Store the binary data in indexedDB:

}

function blobtostring(blbx){

	

	const reader = new FileReader();

	var text;

	// This fires after the blob has been read/loaded.
	reader.addEventListener('loadend', (e) => {
		text = e.srcElement.result;
		console.log(text);
	});

	// Start reading the blob as text.
	reader.readAsText(blbx);

}


function resetformularioClick(){
	
	dbdd.delete().then(() => {
		
	console.log("Database successfully deleted");
	}).catch((err) => {
		
	console.error("Could not delete database");
	}).finally(() => {
		
	// Do what should be done next...
		
	});
	
	//dbdd.inquilinos.clear();
	location.reload();
	
}

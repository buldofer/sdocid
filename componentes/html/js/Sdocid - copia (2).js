var path = require("path");

const fs = require("fs");

const { exec } = require("child_process");

const JQuery = require("jquery");
//const { getMrz, readMrz } = require('mrz-detection');
let $ = JQuery;
const parse = require("mrz").parse;

const saluda = function() {
  var removeDir = function(dirPath) {
    var list = fs.readdirSync(dirPath);
    for (var i = 0; i < list.length; i++) {
      var filename = path.join(dirPath, list[i]);
      var stat = fs.statSync(filename);

      if (filename == "." || filename == "..") {
        // do nothing for current and parent dir
      } else if (stat.isDirectory()) {
        removeDir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dirPath);
  };
};

const cleanText = function(string) {
  var specialChars = "!@#$^&%*()+=-[]/{}|_>:?,.¡¿'`´ ";

  for (var i = 0; i < specialChars.length; i++) {
    string = string.replace(new RegExp("\\" + specialChars[i], "gm"), "");
  }

  string = string.replace(/([\r\\])+/gm, "");
  return string;
};

const getUser = async function() {
  try {
    var cadenaurlconsultamrzlimpia = encodeURI(cadenaurlconsultamrz);

    const response = await axios
      .get(cadenaurlconsultamrzlimpia, {
        responseType: "json"
      })
      .then(function(res) {
        if (res.status == 200) {
          //mensaje.innerHTML = res.data

          console.log(res.data.fields.sex);

          mensaje.innerHTML = res.data.fields.firstName + " ";

          mensaje.innerHTML += res.data.fields.lastName;

          $("#documentCode").val(res.data.fields.documentCode);

          $("#issuingState").val(res.data.fields.issuingState);

          $("#documentNumber").val(res.data.fields.documentNumber);

          $("#birthDate").val(res.data.fields.birthDate);

          // $("#birthDateCheckDigit").val(res.data.fields.["birthDateCheckDigit"]);

          $("#sex").val(res.data.fields.sex);

          $("#expirationDate").val(res.data.fields.expirationDate);

          $("#expirationDateCheckDigit").val(
            res.data.fields.expirationDateCheckDigit
          );

          $("#nationality").val(res.data.fields.nationality);

          $("#optional2").val(res.data.fields.optional2);

          if (res.data.fields.optional1) {
            $("#optional1").val(res.data.fields.optional1);
          }

          if (res.data.fields.personalNumber) {
            $("#optional1").val(res.data.fields.personalNumber);
          }

          $("#compositeCheckDigit").val(res.data.fields.compositeCheckDigit);

          $("#lastName").val(res.data.fields.lastName);

          $("#firstName").val(res.data.fields.firstName);
        }
        console.log(res);
      })
      .catch(function(err) {
        mensaje.innerText = "Error de conexión " + err;
      })
      .then(function() {
        loading.style.display = "none";
      });
  } catch (error) {
    console.error(error);
  }
};

const sdocid = function() {
  var funciones = `

                  $(document).ready(function() {

let video = document.getElementById("video");

  let canvasDiv = document.getElementById("lienzo");

  let canvass;

  let movimientos = new Array();

  let pulsado;

  let contextlienzo;


  let resultadolineas = "";

  let resultadoB;

  let cliente = "1234-5678-9012";

  let reserva;

  let localizador = "";

  let tipoinquilino = "";

  let documentCode = "";

  let issuer = "";

  let lastName = "";

  let firstname = "";

  let documentNumber = "";

  let nationality = "";

  let birthDate = "";

  let sex = "";

  let expiryDate = "";

  let personalNumber = "";

  let urldocimage = "";

  let urlfirmaimage;

  let res;

  let blob;

                  $("#ficheroscan").on("change", function(e) {

                  var reader = new FileReader();
                  reader.onload = function(e) {
                  $("#imagendoc").attr("src", e.target.result);
                  $("#imagendoc").attr("loading", "lazy");
                  $("#imagendoc").css("display", "block");
                  $("#imagendoc").css("width", "75%");
                  imagendocumento = document.getElementById("imagendoc").src;
                  };

                  if (e.target.files.length) {
                  reader.readAsDataURL(e.target.files[0]);
                  }

                  setTimeout(function(){ 
                  crearimagen();
                  console.log("imagen creada");
                  }, 1500);
                  });
                  });


                /////

                /////


                $("#botoninvisible").click(function () {
                $("#contenedorlienzofirma").css("display", "block");

                //$("#guardarfirma").css("display", "block");

                /*
                $.post('https://154.61.227.201/mrz/guardarimagen.php?documentos=' + cliente + '-' + reserva + '-' + tipoinquilino + '-' + documentNumber + '-' + 'fd',
                {
                base64: canvass.toDataURL()
                });
                */
                //parardeescanear();

                //	crearficherosxml();

                //	verpartepantalla();

                //guardarparteenpdf();

                //location.reload();

                //leerdatoslocales();

                if (!canvass) {
                console.log("Creado cuadro firma");

                canvass = document.createElement("canvas");

                canvass.setAttribute("width", 300);
                canvass.setAttribute("height", 300);
                canvass.setAttribute("id", "canvass");
                canvasDiv.appendChild(canvass);
                if (typeof G_vmlCanvasManager != "undefined") {
                }
                contextlienzo = canvass.getContext("2d");

                //  if (valor == 0) {
                // Para poder firmar desde el ratón

                $("#canvass").mousedown(function (e) {
                pulsado = true;
                movimientos.push([
                e.pageX - this.offsetLeft,
                e.pageY - this.offsetTop,
                false
                ]);
                $.repinta();
                });

                $("#canvass").mousemove(function (e) {
                if (pulsado) {
                movimientos.push([
                e.pageX - this.offsetLeft,
                e.pageY - this.offsetTop,
                true
                ]);
                $.repinta();
                }
                });

                $("#canvass").mouseup(function () {
                pulsado = false;
                });

                $("#canvass").mouseleave(function () {
                pulsado = false;
                });
                //       }

                $("#canvass").bind("touchstart", function (event) {
                var e = event.originalEvent;
                e.preventDefault();
                pulsado = true;
                movimientos.push([
                e.targetTouches[0].pageX - this.offsetLeft,
                e.targetTouches[0].pageY - this.offsetTop,
                false
                ]);
                $.repinta();
                });

                $("#canvass").bind("touchmove", function (event) {
                var e = event.originalEvent;
                e.preventDefault();
                if (pulsado) {
                movimientos.push([
                e.targetTouches[0].pageX - this.offsetLeft,
                e.targetTouches[0].pageY - this.offsetTop,
                true
                ]);
                $.repinta();
                }
                });

                $("#canvass").bind("touchend", function (event) {
                var e = event.originalEvent;
                e.preventDefault();
                pulsado = false;
                });

                $.repinta = function () {
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
                } else {
                console.log("ya estaba creado el cuadro de la firma");
                }

                //	$.repinta();
                });



                /////

                /////


                  function crearimagen() {
                  var imagendocumento = document.getElementById("imagendoc");
                  var canvasimagendocu = document.createElement("canvas");
                  canvasimagendocu.width = imagendocumento.naturalWidth; // or 'width' if you want a special/scaled size
                  canvasimagendocu.height = imagendocumento.naturalHeight; // or 'height' if you want a special/scaled size
                  canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);
                  var imagendocumentosave = canvasimagendocu.toDataURL("image/png").replace(/^data:image\\/(png|jpeg);base64,\/, '');

                  $.ajax({
                  type: "POST",
                  url: "/crear",
                  data: {
                  blob: canvasimagendocu.toDataURL()
                  }
                  }).done(function(o) {
                  console.log("saved");
                  getmrz()

                  });

                  }

                  function getmrz() {       

                  setTimeout(function(){ 
                  var urlimagencrop = "http://192.168.0.100/imagenes/out/crop/doctemp.png";
                  tess(urlimagencrop);
                  }, 1500);

                  }

                  function tess(imagen) {
                  let tesseractSettings = {
                  lang: "mrz"
                  };

                  Tesseract.recognize(imagen, tesseractSettings).then(function(result) {
                  var textolimpio = result.text;

                  if (!result.lines[0]) {
                  console.log("No ha sido detectado ninguna línea");
                  } else {
                  linea1 = result.lines[0].text;

                  linea1 = linea1.replace(/([\\n])+/g, "");

                  if (!result.lines[1]) {
                  cadenaurlconsultamrz = "/datosdoc?linea1=" + linea1;
                  } else {
                  linea2 = result.lines[1].text;

                  linea2 = linea2.replace(/([\\n])+/g, "");

                  cadenaurlconsultamrz =
                  "/datosdoc?linea1=" + linea1 + "&linea2=" + linea2;

                  console.log("linea2: " + linea2);
                  }

                  if (!result.lines[2]) {
                  cadenaurlconsultamrz =
                  "/datosdoc?linea1=" + linea1 + "&linea2=" + linea2;
                  console.log("linea2: " + linea2);
                  } else {
                  linea3 = result.lines[2].text;

                  linea3 = linea3.replace(/([\\n])+/g, "");

                  cadenaurlconsultamrz =
                  "/datosdoc?linea1=" +
                  linea1 +
                  "&linea2=" +
                  linea2 +
                  "&linea3=" +
                  linea3;

                  console.log("linea3: " + linea3);
                  }
                  }

                  document.getElementById("textolimpio").innerText = textolimpio;
                  getUser();
                  });
                  };

                  async function getUser() {


                  $("#documentCode").val("");

                  $("#issuingState").val("");

                  $("#documentNumber").val("");

                  $("#birthDate").val("");

                  $("#sex").val("");

                  $("#expirationDate").val("");

                  $("#nationality").val("");

                  $("#optional2").val("");

                  $("#optional1").val("");

                  $("#compositeCheckDigit").val("");

                  $("#lastName").val("");

                  $("#firstName").val("");

                  try {

                  var cadenaurlconsultamrzlimpia = encodeURI(cadenaurlconsultamrz);

                  const response = await axios
                  .get(cadenaurlconsultamrzlimpia, {
                  responseType: "json"
                  })
                  .then(function(res) {
                  if (res.status == 200) {
                  //mensaje.innerHTML = res.data

                  console.log(res.data.fields.sex);

                  mensaje.innerHTML = res.data.fields.firstName + " ";

                  mensaje.innerHTML += res.data.fields.lastName;

                  $("#tablaresultados").css("display", "block");

                  $("#documentCode").val(res.data.fields.documentCode);

                  $("#issuingState").val(res.data.fields.issuingState);

                  $("#documentNumber").val(res.data.fields.documentNumber);

                  $("#birthDate").val(res.data.fields.birthDate);

                  $("#sex").val(res.data.fields.sex);

                  $("#expirationDate").val(res.data.fields.expirationDate);

                  $("#expirationDateCheckDigit").val(
                  res.data.fields.expirationDateCheckDigit
                  );

                  $("#nationality").val(res.data.fields.nationality);

                  $("#optional2").val(res.data.fields.optional2);

                  if (res.data.fields.optional1) {
                  $("#optional1").val(res.data.fields.optional1);
                  }

                  if (res.data.fields.personalNumber) {
                  $("#optional1").val(res.data.fields.personalNumber);
                  }

                  $("#compositeCheckDigit").val(res.data.fields.compositeCheckDigit);

                  $("#lastName").val(res.data.fields.lastName);

                  $("#firstName").val(res.data.fields.firstName);
                  }

                  console.log(res);
                  })
                  .catch(function(err) {
                  mensaje.innerText = "Error de conexión " + err;
                  })
                  .then(function() {
                  loading.style.display = "none";
                  });
                  } catch (error) {
                  console.error(error);
                  }
                  }
	`;
  return funciones;
};

const crearimagen = function() {
  const cr = function() {
    const ruta = "canvasimagendocu.toDataURL()";

    const pathctemp = ".././public/imagenes/out";

    if (!pathctemp) {
      console.log("No existe .././public/imagenes/out");
    } else {
      saluda(pathctemp);
    }

    var base64Data = ruta.replace(/^data:image\/png;base64,/, "");

    var path = ".././public/imagenes/doctemp.png";

    fs.writeFileSync(path, base64Data, "base64");

    const archivomrz = " --dir .././public/imagenes";

    exec(
      "node ../node_modules/mrz-detection-master/run/getMrz.js " + archivomrz,
      (error, stdout, stderr) => {}
    );

    /*
  $.ajax({
   
    url: urlsite + "/delimgtemp"
   
  })
  */

    // getmrz();
  };

  //return cr();
};
exports.funciones = {
  sdocid: sdocid(),
  crearimagen: crearimagen()
};

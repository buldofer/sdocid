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

  let idlocal;

  let movimientos = new Array();

  let pulsado;

  let contextlienzo;

  let resultadolineas = "";

  let resultadoB;

  let vivienda = "m24b";

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

  let hasasd;

  let expiryDate = "";

  let personalNumber = "";

  let urldocimage = "";

  let urlfirmaimage;

  let coordinates;

  let jcropAPI;

  let res;

  let blob;


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
    }, 1800);
  });

 

  async function crearimagen() {
    var imagendocumento = document.getElementById("imagendoc");

    var canvasimagendocu = document.createElement("canvas");

    canvasimagendocu.width = imagendocumento.naturalWidth; // or 'width' if you want a special/scaled size

    canvasimagendocu.height = imagendocumento.naturalHeight; // or 'height' if you want a special/scaled size

    canvasimagendocu.getContext("2d").drawImage(imagendocumento, 0, 0);

    $.ajax({
      type: "POST",
      url: urlsite + "/crear",
      data: {
        blob: canvasimagendocu.toDataURL()
      }
    }).done(function(o) {
      setTimeout(function() {
        getmrz();
      }, 1800);
    });
  }

  async function guardarfirmadoc() {
    $.ajax({
      type: "POST",
      url: urlsite + "/guardarimagen",
      data: {
        blob: canvass.toDataURL()
      }
    }).done(function(o) {
      reserva = $("#reserva").val();

      tipoinquilino = $("input[name=tipoinqui]:checked").val();

      $("#guardarfirma").css("display", "none");

      $("#textofirma").css("display", "none");

      $("#leerdatoslocales").css("display", "block");

      $("#buttonborrardatoslocales").css("display", "block");

      $("#lienzo").css("display", "none");

      populateSomeData(
        cliente,
        vivienda,
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
        urlfirmaimage
      );
    });
  }


  function populateSomeData(
    cliente,
    vivienda,
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
    urlfirmaimage
  ) {
    return dbdd.transaction("rw", dbdd.inquilinos, function() {
      downloadAndStoreImage(
        cliente,
        vivienda,
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
        urlfirmaimage
      );
    });
  }

  async function downloadAndStoreImage(
    cliente,
    vivienda,
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
    urlfirmaimage
  ) {
    res = $("#imagendoc").attr("src");

    urlfirmaimage = canvass.toDataURL();

    blob = res;

    dbdd.inquilinos.add({
      cliente: cliente,
      vivienda: vivienda,
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
  }

  function eliminardatoslocales() {
    if (reserva) {
      dbdd.inquilinos
        .where("reserva")
        .anyOf(reserva)
        .delete();

      alert("Han sido eliminados los datos locales");
    }
  }

  function eliminardatoslocalesglobalmente() {
    dbdd
      .delete()
      .then(() => {
        console.log("Database successfully deleted");
      })
      .catch(err => {
        console.error("Could not delete database");
      })
      .finally(() => {});

    alert("Han sido eliminados los datos locales");

    //dbdd.inquilinos.clear();
    location.reload();
  }

  

  function actualizardatoslocalestabladinamica(
    kaka,
    viviendatdb,
    clientetdb,
    reservatdb,
    tipoinquilinotdb,
    documentTypetdb,
    issuertdb,
    documentNumbertdb,
    birthDatetdb,
    sextdb,
    expiryDatetdb,
    nationalitytdb,
    lastNametdb,
    otherNamestdb,
    personalNumbertdb
  ) {
    if (kaka) {
      console.log(kaka);

      // var personalNumbertdb = "ver que pasa";

      dbdd.inquilinos
        .where("id")
        .anyOf(kaka)
        .modify({
          cliente: clientetdb,
          vivienda: viviendatdb,
          reserva: reservatdb,
          tipoinquilino: tipoinquilinotdb,
          documentType: documentTypetdb,
          issuer: issuertdb,
          documentNumber: documentNumbertdb,
          birthDate: birthDatetdb,
          sex: sextdb,
          expiryDate: expiryDatetdb,
          nationality: nationalitytdb,
          // optional2: optional2,
          lastName: lastNametdb,
          otherNames: otherNamestdb,
          personalNumber: personalNumbertdb
        });

      console.log(
        "valor en estos momentos de: " +
          kaka +
          " y el valor del campo documentcode es:" +
          tipoinquilinotdb
      );

      setTimeout(function() {
        location.reload();
      }, 1000);
    }
  }

  $("#botoninvisible").click(function() {
    $("#contenedorlienzofirma").css("display", "block");

    if (!canvass) {
      console.log("Creado cuadro firma");

      canvass = document.createElement("canvas");

      canvass.setAttribute("width", 300);

      canvass.setAttribute("height", 300);

      canvass.setAttribute("id", "canvass");

      canvasDiv.appendChild(canvass);

      contextlienzo = canvass.getContext("2d");

      $("#canvass").mousedown(function(e) {
        pulsado = true;

        movimientos.push([
          e.pageX - this.offsetLeft,
          e.pageY - this.offsetTop,
          false
        ]);

        $.repinta();
      });

      $("#canvass").mousemove(function(e) {
        if (pulsado) {
          movimientos.push([
            e.pageX - this.offsetLeft,
            e.pageY - this.offsetTop,
            true
          ]);

          $.repinta();
        }
      });

      $("#canvass").mouseup(function() {
        pulsado = false;
      });

      $("#canvass").mouseleave(function() {
        pulsado = false;
      });

      $("#canvass").bind("touchstart", function(event) {
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

      $("#canvass").bind("touchmove", function(event) {
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

      $("#canvass").bind("touchend", function(event) {
        var e = event.originalEvent;

        e.preventDefault();

        pulsado = false;
      });

      $.repinta = function() {
        canvass.width = canvass.width;

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
  });

  $("#guardarfirma").click(function() {
    guardarfirmadoc();

    console.log("Test guardada firma");
  });

  $(".editartdb").click(function() {
    console.log("botondinamico");
  });

  $("#buttondatosreserva").click(function () {
    

 // $("#listaviviendasarevisar").css("height", "50%");

    //combolistareservas();



    setTimeout(function () {

  
      let listaviviendasarevisar = document.getElementById("listaviviendasarevisar");

      var lssr = $("#listaviviendasarevisar").height();

      var lssro = $("#listaviviendasarevisar option").height();

      $("#listaviviendasarevisar").css("height", lssr + ( lssr + listaviviendasarevisar.options.length-40));

      console.log(lssr + " " + lssro);
    }, 500);


 
  });

  $("#buttonborrardatoslocales").click(function() {
    eliminardatoslocales();
  });

  $("#bborrardatoslocalesutils").click(function() {
    eliminardatoslocalesglobalmente();

    console.log("Han sido borrados los datos locales!!");
  });

  $("#bleerdatoslocalesutils").click(function() {
    console.log("He llegado hasta aquí para leer los datos locales!!");

    setTimeout(function() {
      document.getElementById("tabladinamica").innerHTML = " ";
      $("#cuadroedicion").css("display", "block");

      //   fu(); gfgrfgf
    }, 500);
  });


  $("#listaviviendasarevisar").on("change",function () {

    
    var test = $("#listaviviendasarevisar option:selected").val();
    console.log(test);

    setTimeout(function () {
      document.getElementById("tabladinamica").innerHTML = " ";
      $("#cuadroedicion").css("display", "inline");

      editardatosreserva();
    }, 500);

  });

/*

  $("#bleerdatosreservaesutils").click(function() {
    console.log(
      "He llegado hasta aquí para leer los datos locales y editar datos reserva y vivienda concreta!!"
    );

    setTimeout(function() {
      document.getElementById("tabladinamica").innerHTML = " ";
      $("#cuadroedicion").css("display", "block");

      editardatosreserva();
    }, 500);
  });
  // esto ver si quitarlo
  $("#leerdatoslocales").click(function() {
    document.getElementById("tabladinamica").innerHTML = " ";

    //   f();
  });

  // esto ver si quitarlo va con la función de arriba


  $(".editdatos").click(function() {
    var rBtnValu = $("#editardatosutils").val();

    if (rBtnValu == "Bloquear") {
      var request = dbdd;

      $("#cuadroedicion").css("display", "none");

      $("#guardarfirma").css("display", "none");

      request.onsuccess = function(event) {
        var note = request.result;

        alert(note.reserva);
      };

      $(".resultado1").css("border-color", "red");

      $(".resultado2").css("border-color", "red");

      $("#editardatosutils").val("Editar");
    }

    if (rBtnValu == "Editar") {
      setTimeout(function() {
        $("#cuadroedicion").css("display", "block");

        $("#bleerdatoslocalesutils").click();
      }, 1000);

      // $("#guardarfirma").css("display", "block");

      $(".resultado1").css("border-color", "green");

      $(".resultado2").css("border-color", "green");

      $("#editardatosutils").val("Bloquear");
    }
  });

  */

  async function combolistareservas() {
    let promise = new Promise((resolve, reject) => {
      dbdd.inquilinos.each(function (inquilinos) {
        
        /*
        let combolistaviviendas = document.getElementById("listaviviendas");

        let optionv = document.createElement("option");

        optionv.text = inquilinos.vivienda;

        combolistaviviendas.add(optionv, combolistaviviendas[0]);

        const optionsv = [];

        document
          .querySelectorAll("#listaviviendas > option")
          .forEach(option => {
            if (optionsv.includes(option.value)) option.remove();
            else optionsv.push(option.value);
            if (option.value == "undefined") option.remove();
            else optionsv.push(option.value);
          });
        
        */
        let listaviviendasarevisar = document.getElementById("listaviviendasarevisar");
    
        let optionvr = document.createElement("option");

        listaviviendasarevisar.setAttribute("size", listaviviendasarevisar.options.length);

        optionvr.text = inquilinos.vivienda;

        listaviviendasarevisar.add(optionvr, listaviviendasarevisar[0]);


        const optionsvr = [];

        document
          .querySelectorAll("#listaviviendasarevisar > option")
          .forEach(option => {
            if (optionsvr.includes(option.value)) option.remove();
            else optionsvr.push(option.value);
            if (option.value == "undefined") option.remove();
            else optionsvr.push(option.value);
          });
      });
    });

  

    let result = await promise;
  }


  async function editardatosreserva() {
    let promise = new Promise((resolve, reject) => {
      var listaviviendasedit = $("#listaviviendasarevisar").val();
      dbdd.inquilinos
        .where("vivienda")
        .anyOf(listaviviendasedit)
        .each(function(inquilinos) {
          console.log(inquilinos.id);

          var idl = "'#btdinamico" + inquilinos.id + "'";

          console.log(idl);

          var tabla;

          var divs;

          tabla = '<table class = "is-center"  align = "center" >';

          tabla += "<tr>";

          tabla +=
            '<td> <p class="cabeceradatostabladinamica">Documento</p> <br>	<img class="imagendoctabladinamica" src="' +
            inquilinos.image +
            '"></td></<td>';

          tabla +=
            '<td> <p class="cabeceradatostabladinamica">Firma</p><br>	<img id="imagenfirma" class="imagendoctabladinamica" src="' +
            inquilinos.urlfirmaimage +
            '"></td>';

          tabla += "</tr>";

          tabla +=
            '<td class="descripcion1">ID Local </td><td><input class="resultado1 valoridlocal" type="text" value="' +
            inquilinos.id +
            '"/></td>';

          tabla +=
            '<tr><td class="descripcion1">Vivienda</td><td><input class="resultado1" type="text" id="viviendatdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">Cliente</td><td><input class="resultado2" type="text" id="Clientetdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1" >Reserva</td><td><input class="resultado1" type="text" id="reservatdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2" >Tipo Inquilino</td><td><input class="resultado2" type="text" id="tipoInquilinotdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1" >Tipo Doc.</td><td><input class="resultado1" type="text" id="documentCodetdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">País</td><td><input class="resultado2" type="text" id="issuingStatetdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1">Nombre</td><td><input class="resultado1" type="text" id="firstNametdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">Apellidos</td><td><input class="resultado2" type="text" id="lastNametdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1">Nº Doc.</td><td><input class="resultado1" type="text" id="documentNumbertdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">Nacionalidad</td><td><input class="resultado2" type="text" id="nationalitytdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1">F.Nacimiento</td><td><input class="resultado1" type="text" id="birthDatetdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">Sexo</td><td><input class="resultado2" type="text" id="sextdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion1">F.Cad. Doc.</td><td><input class="resultado1" type="text" id="expirationDatetdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td class="descripcion2">Nº. Doc. Id</td><td><input class="resultado2" type="text" id="optional1tdb' +
            inquilinos.id +
            '"/></td></tr> ';

          tabla +=
            '<tr><td><input class="bt bg-dark text-white editdatos" value="Actualizar" type="button" id="btdinamico' +
            inquilinos.id +
            '"/></td></tr>';

          tabla += "</table>";

          divs = document.createElement("div");

          divs.style.marginTop = "40px";

          divs.innerHTML = tabla;

          document.getElementById("tabladinamica").appendChild(divs);

          $("#viviendatdb" + inquilinos.id).val(inquilinos.vivienda);

          $("#Clientetdb" + inquilinos.id).val(inquilinos.cliente);

          $("#reservatdb" + inquilinos.id).val(inquilinos.reserva);

          $("#tipoInquilinotdb" + inquilinos.id).val(inquilinos.tipoinquilino);

          $("#documentCodetdb" + inquilinos.id).val(inquilinos.documentType);

          $("#issuingStatetdb" + inquilinos.id).val(inquilinos.issuer);

          $("#documentNumbertdb" + inquilinos.id).val(
            inquilinos.documentNumber
          );

          $("#birthDatetdb" + inquilinos.id).val(inquilinos.birthDate);

          $("#sextdb" + inquilinos.id).val(inquilinos.sex);

          $("#expirationDatetdb" + inquilinos.id).val(inquilinos.expiryDate);

          $("#nationalitytdb" + inquilinos.id).val(inquilinos.nationality);

          $("#optional1tdb" + inquilinos.id).val(inquilinos.personalNumber);

          $("#lastNametdb" + inquilinos.id).val(inquilinos.lastName);

          $("#firstNametdb" + inquilinos.id).val(inquilinos.otherNames);



          $(".editdatos").click(function() {
            const viviendatdb = $("#viviendatdb" + inquilinos.id).val();

            const reservatdb = $("#reservatdb" + inquilinos.id).val();

            const clientetdb = $("#Clientetdb" + inquilinos.id).val();

            const tipoinquilinotdb = $(
              "#tipoInquilinotdb" + inquilinos.id
            ).val();

            const documentCodetdb = $("#documentCodetdb" + inquilinos.id).val();

            const issuertdb = $("#issuingStatetdb" + inquilinos.id).val();

            const documentNumbertdb = $(
              "#documentNumbertdb" + inquilinos.id
            ).val();

            const birthDatetdb = $("#birthDatetdb" + inquilinos.id).val();

            const sextdb = $("#sextdb" + inquilinos.id).val();

            const expiryDatetdb = $("#expirationDatetdb" + inquilinos.id).val();

            const nationalitytdb = $("#nationalitytdb" + inquilinos.id).val();

            const personalNumbertdb = $("#optional1tdb" + inquilinos.id).val();

            const lastNametdb = $("#lastNametdb" + inquilinos.id).val();

            const otherNamestdb = $("#firstNametdb" + inquilinos.id).val();

            console.log(tipoinquilinotdb);

            actualizardatoslocalestabladinamica(
              inquilinos.id,
              viviendatdb,
              clientetdb,
              reservatdb,
              tipoinquilinotdb,
              documentCodetdb,
              issuertdb,
              documentNumbertdb,
              birthDatetdb,
              sextdb,
              expiryDatetdb,
              nationalitytdb,
              lastNametdb,
              otherNamestdb,
              personalNumbertdb
            );
          });
        });
    });

    let result = await promise;
  }
});


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

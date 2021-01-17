const estilos_func_ap = function() {
  var bbddlocal = `

var urlsite = "http://192.168.0.100";

let dbdd;

dbdd = new Dexie("Documentos");

dbdd.version(1).stores({
    inquilinos:
        "++id,cliente,vivienda,reserva,tipoinquilino,documentType,issuer,lastName,otherNames,documentNumber,nationality,birthDate,sex,expiryDate,personalNumber,urldocimage,urlfirmaimage"
});

dbdd.open();

  `;
  return bbddlocal;
};

exports.funciones = {
  utilsbbddlocal: utils_bbddlocal()
};

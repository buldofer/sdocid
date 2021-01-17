const utils_bbddlocal = function() {
  var bbddlocal = `



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

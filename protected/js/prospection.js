var fs = require('fs');
var db = require('./mongoose.js');
var i =0;
var Phaxio = require('phaxio'),
phaxio = new Phaxio('9413c9ed299b19c4f8005ce4f40c3da2b5109ef3', '2a0e9798a40025f96109a3dce901fa0f0357b588'),
callback = function(err,data){console.log(data);};

//------------------------------------------------------------------------------------------------------------
var envoyer = function(data){
var d = {};
d.to = data;
d.filenames = './CIIB.pdf';
phaxio.sendFax(d, function(err,res) {
  console.log(res);
});
}

var sendFax = function(){
fs.readFile('./fax.json', 'utf-8', 'r+', function (err, data) { 
	if (err) {
		console.log("ERROR - " + err);
	} else if (data) {
		data = JSON.parse(data);
		console.log(data[i]);
		setInterval(function (){ 
		envoyer(data[i++]);
		},20000);
 
	}
});
}
exports.find_prospects = function(that, fonc, paquets){
db.prospection(that, fonc, paquets);
}
//-----------------------------------------------------------------------------------------------------------
// var paquets = {};
// paquets.capitalSocial = 10000;
// paquets.formeJuridique = "Société à responsabilité limitée";
// paquets.formeJuridique = "Société anonyme";
// paquets.formeJuridique = "SAS";
// paquets.formeJuridique = "Société par actions simplifiée";
// paquets.formeJuridique = "SASU";
// paquets.nombreEmployes = 0;
// paquets.resultatNet = 0;
// paquets.chiffreAffaire = 0;
// paquets.departement = 0;
// paquets.evolution_chiffre_Affaire = "0"; 
// paquets.evolution_resultat_Net =  "0";
// exports.find_prospects(null, "ok", paquets);
 
var util = require("util");
var database = require('./database.js');
var db = require('./prospection.js');
var fax =  require('./test_faxio.js');
var mongoose = require('./mongoose.js');

exports.postReq = function(paquets, req, resp) {
	util.log("Reception paquets : " + util.inspect(paquets));
	var traitement_post = new constr_post_acceuil(paquets, req, resp);
	if (paquets.act == "identification") {
		traitement_post.log();
	} else if (paquets.act == "inscription") {
		traitement_post.create();
	} else if (paquets.act == "deconnect") {
		traitement_post.deconnect();
	} else if (paquets.act == "get_criteres") {
		console.log("ETAPE REUSIT");
		traitement_post.get_criteres(paquets);
	}else if (paquets.act == "send_fax") {
		console.log("ETAPE REUSIT");
		traitement_post.send_fax(paquets);
	} else if (paquets.act == "reprospection") {
		console.log("ETAPE REUSIT");
		traitement_post.reprospection(paquets);
	} else {
		util.log("Un problème est survenuuu lors du traitement de la requête : " + util.inspect(paquets.act));
	}

	traitement_post = null;
};

/* Constructeur requête POST*/
constr_post_acceuil = function (paquets, req, resp) {
	util.log("------Appel du constructeur POST------------");
	if(paquets && req && resp) {
		this.req = req;
		this.resp = resp
		this.mail = paquets.mail;
		this.id = paquets.id;
		this.mdp = paquets.mdp;
		this.log_temp = paquets.log_temp;
		this.act = paquets.act;
		this.search = paquets.search;
		this.ent = paquets.ent;
		this.quant = paquets.quant;
	} else {
		util.log("ERROR - L'\objet POST n\'a pas pu etre construit.");
		return;
	}

};

constr_post_acceuil.prototype = {

check_log:
	function () {
		database.checkDatabase(this, this.act, "log_invalid");
	},
	
log_invalid:
	function () {
		this.reponse("log out");
	},
	
log:
	function () {
		util.log("Debut traitement du POST identification");
		database.verifLogin(this, "reponse");
	},
	
create:
	function () {
		util.log("Debut traitement du POST inscription");
		database.verifMail(this, "reponse");
	},
	
deconnect:
	function () {
		 util.log("Deconnexion client : " + this.log_temp);
		database.erase_log(this, "reponse");
	},
	
	
get_criteres :
	function (paquets) {
		db.find_prospects(this, "reponse" ,paquets);
	},
	
send_fax :
	function (paquets) {
	util.log("Debut traitement du POST envoie de fax ...");
	fax.sendFax(this, "reponse" , paquets.tab_fax, paquets.tab_dirigeant, paquets.tab_nom, paquets.tab_adresse, paquets.formeJuridique, paquets.capitalSocial, paquets.evolutionChiffreAffaire, paquets.evolutionResultatNet);
	},
	
reprospection :
	function (paquets) {
	util.log("Debut traitement du POST reprospection ...");
	fax.reprospection(this, "reponse");
	},
	
reponse:
	function (output, arg) {
		if (arg) {
			this.resp.writeHead(200, {"Content-Type": "application/json", "set-cookie":arg});//--------
		} else {
			this.resp.writeHead(200, {"Content-Type": "application/json"});
		}
		// Conversion d'une valeur en JSON -> ex:{"resp" : "Id ok"}
		this.resp.write(JSON.stringify({resp: output}));
		this.resp.end();
	}
};
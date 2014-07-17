var http = require("http");
var util = require("util");
var fs = require("fs");
var router = require("./protected/js/router.js");

fs.exists('./public/acceuil.html', function (exist) {
            if (exist) {
			console.log("----------acceuil-------------");
			}

})

/* Création d'un objet serveur stockant les variables et methodes */
var server = {};
// server.port = 1337;
server.port = process.env.PORT || 3000;
// server.address = "127.0.0.1";
server.address = "0.0.0.0";

server.receive_request = function (request, response) {
    router.route(request, response);
	console.log("une requette a été recue !!!!!!!!!!!!!!!!!");
};

http.createServer(server.receive_request).listen(server.port, server.address);
		
util.log("INFO - Demarrage du serveur, listening " + server.address + " : " + server.port);


//********************************************************************************************************
//----------------------------------ERREUR-----------------------------------------------------------------
//*********************************************************************************************************
// process.on('uncaughtException', function(err) {
process.on('uncaughtException', function(err) {
	console.log('---------------------Une rerreur c est produite----------------------------------------');
	console.log('Caught exception: ' + err);
	console.log('-----------------je suis tjr vivant!!!!!!----------------------------------------------------');
	fs.exists('../public/acceuil.html', function (exist) {
				if (exist) {
				console.log("----------acceuil-------------");
				}

	})
	/* Création d'un objet serveur stockant les variables et methodes */
	var server = {};
	server.port = process.env.PORT || 3000;
	server.address = "0.0.0.0";
	http.createServer(server.receive_request).listen(server.port, server.address);
	util.log("INFO - Demarrage du serveur, listening " + server.address + " : " + server.port);
  
});
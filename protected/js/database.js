var util = require("util");
var event = require('events');
var ev = new event.EventEmitter();
var mongoose = require('mongoose');
//--------------------------simulation de l'objet
// On se connecte à la base de données ne pas oubliez de lancer ~/mongo/bin/mongod dans un terminal !

// mongoose.createConnection('mongodb://localhost/identification', function(err) {
 mongoose.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err) {
  if (err) { throw err; }
});
//*********************************************************************************
// Création du schéma pour les db
var structure = new mongoose.Schema({
	id : String,
	mail : String,
	mdp : String,
	log_temp : String,
	date : String,
});
//*********************************************************************************
insert = function(obj, fonction){
	var date = new Date();
	var text = mongoose.model('db', structure);
	var monText = new text({ id : obj.id });
	monText.id = obj.id;
	monText.mail = obj.mail;
	monText.mdp = obj.mdp;
	monText.log_temp = obj.log_temp;
	monText.date = date.valueOf();
	console.log("une instance est creer");
	monText.save(function (err) {
	  if (err) { throw err; }
	  console.log('Enregistrement dans la base de donnée !');
	  obj[fonction]("Votre compte est créé");
	});
}
//*********************************************************************************
exports.verifMail = function(obj, fonction){
	var text = mongoose.model('db', structure);
	var query = text.find(null);
	query.select("mail").where('mail').equals(obj.mail);;
	query.exec(function (err, data) {
	if (err) return handleError(err);
	console.log(data); // Space Ghost is a talk show host.
	if(data[0]){
		console.log(data);
		console.log("Adresse mail deja enregistree");
		obj[fonction]("Cette adresse est déjà enregistrée");
	}else{
		console.log("Adresse mail disponible");
		ev.emit("GO_1", obj, fonction);
	}
})
}
//*********************************************************************************
verifId  = function(obj, fonction){
console.log(obj.id);
	var text = mongoose.model('db', structure);
	var query = text.find(null);
	query.select("id").where('id').equals(obj.id);
	query.exec(function (err, data) {
	if (err) return handleError(err);
	console.log(data); // Space Ghost is a talk show host.
	if(data[0]){
		console.log("Identifiant deja utilise");
		obj[fonction]("Cette identifiant est déjà utilisé");
	}else{
		console.log("Identifiant disponible");
		ev.emit("GO_2", obj, fonction);
	}
})
}
//*********************************************************************************
exports.verifLogin = function (obj, fonction) {
console.log(util.inspect(obj.id)+"1111");
console.log(util.inspect(obj.mdp)+"1111");
	var new_log_temp = Math.floor(Math.random()*1000000000);
console.log(new_log_temp+"               1111");	
	var new_date = new Date();
	var text = mongoose.model('db', structure);
	var query = text.find(null);
	query.select("id mdp log_temp date").where('id').equals(obj.id).where('mdp').equals(obj.mdp); 
	query.exec(function (err, data) {
		if (err) return (err);
		if(data[0]){
		console.log("-----------Identifiant validé --------------------");
		console.log(util.inspect(data)+"------------------DATA-------------------"); 
			var text = mongoose.model('db', structure);
			text.update({id: obj.id}, { $set: {log_temp: new_log_temp}}, function(){//
				var query = text.find(null);
				query.select("id mdp log_temp date").where('id').equals(obj.id);
				query.exec(function (err, data) {
					if (err) return Error(err);
					util.log("----------Actualisation du login temporaire---------------");
					console.log(util.inspect(data)+"------------------DATA-------------------");
					var text = mongoose.model('db', structure);
					var date = new Date();
					text.update({id: obj.id}, { $set: {date: date.valueOf()}}, function(){//
						var query = text.find(null);
						query.select("id mdp log_temp date").where('id').equals(obj.id);
						query.exec(function (err, data) {
							if (err) return Error(err);
							util.log("----------Actualisation de la date---------------");
							console.log(util.inspect(data)+"------------------DATA-------------------"); 
							obj[fonction]("Login ok", new_log_temp);
						});
					});
				});
			});
		}else {
				console.log("-----------Identifiant ou mot de passe invalide--------------------");
				obj[fonction]("Ce compte n'existe pas");
		}
	});
};
//*********************************************************************************
exports.checkDatabase = function (obj, function1, function2) {
	var log_tempp = obj.req.headers.cookie;	
	util.log("Identifiant temporaire : " + log_tempp);
	var text = mongoose.model('db', structure);
	var query = text.find(null);
	query.select("id mdp log_temp date").where('log_temp').equals(log_tempp); 
	query.exec(function (err, data) {
		var new_date = new Date();
		if(data){
		util.log("-----------/////////\\\\\\\\\\\\\\------------");
		util.log("-----------------------" + util.inspect(data));
				if ((data[0])&&((new_date.valueOf() - (+data[0].date))/(1000)) < 10*60) {   // TOTD 
					util.log("----------Actualisation------------------------------------");
					var text = mongoose.model('db', structure);
					text.update({log_temp: log_tempp}, { $set: {log_temp: log_tempp}}, function(){
						var query = text.find(null);
						query.select("id mdp log_temp date").where('log_temp').equals(log_tempp);
						query.exec(function (err, data) {
							if (err) return Error(err);
							util.log("----------Actualisation de du log tmp---------------");
							console.log(util.inspect(data)+"------------------DATA-------------------");
							var text = mongoose.model('db', structure);
							var date = new Date();
							text.update({id: obj.id}, { $set: {date: date.valueOf()}}, function(){//
									util.log("----------Actualisation de la date---------------");
									console.log(util.inspect(data)+"------------------DATA-------------------"); 
									var query = text.find(null);
									query.select("id mdp log_temp date").where('log_temp').equals(log_tempp);
									query.exec(function (err, data) {
										if (err) return Error(err);
										util.log("----------Actualisation de la date---------------");
										console.log(util.inspect(data)+"------------------DATA-------------------"); 
										obj[function1](data[0].id);
									});
							});
						});
					});		
				} else {
					util.log("-------La date de l'identifiant temporaire n'est plus valide------------");
					obj[function2]();
				}
		} else {
			util.log("------------------Identifiant temporaire inconnu-------------------------------");
			obj[function2]();
		}		
	});	
};
//*********************************************************************************
exports.erase_log = function (obj, fonction) {
	var new_log = "NonConnecté";
	console.log("Effacement loggin temporaire dans la base de donnée");
	var text = mongoose.model('db', structure);
	text.update({log_temp: obj.log_temp}, { $set: {log_temp: new_log}}, function(){
	var query = text.find(null);//
	query.select("id mdp log_temp date").where('log_temp').equals(new_log); //
	query.exec(function (err, data) {//
	if (err) return Error(err);//
	console.log(data[0]);//
	obj[fonction]("Deconnexion");
	})//
	});

};
//*********************************************************************************
var selecAll = function(item){
	var text = mongoose.model('db', structure);
	var query = text.find(null);
	query.select('id mail');
query.exec(function (err, data) {
  if (err) return handleError(err);
  console.log(data); // Space Ghost is a talk show host.
})
}
// selecAll();
/* Ecouteurs */
ev.on("GO_1", verifId);
ev.on("GO_2", insert);
 // insert(obj, null);
// exports.verifMail(obj, null);
// verifId(obj, null);
// exports.verifLogin(obj, null);
 // exports.checkDatabase(obj, null, null);
//create();
//read();

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var mongoose = require('mongoose');

 mongoose.createConnection('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err) {
   if (err) { throw err; }
});
//****************************************************************************************************
// Création du schéma pour les commentaires
var structure = new mongoose.Schema({
	siren : String,
	siret : String,
	name : String,
	dirigeant : String,
	type : String,
	Categorie : String,
	adresse : String,
	CapitalSocial : String, 
	chiffreAffaire : Object,
	resultatNet : Object,
	effectif :  Object,
	EBEN :  Object,
	RCAIN :  Object,
	ResulatExpoitation :  Object,
	ValeureAjoute :  Object,
	CapitauxPropres :  Object,
	Dettes :  Object,
	TotalPassif :  Object,
	ActifImmobilise : Object,
	ActifCirculant :  Object,
	TotalActif :  Object,
	tel : String,
	fax : String,
	prospection : String,
  
});
//****************************************************************************************************
// On crée une instance du Model
exports.enregistrement = function(obj){
	// Création du Model pour les commentaires
	var text = mongoose.model('commentaires', structure);
	var monText = new text({ siren : obj.siren });
	monText.siret = obj.siret;
	monText.name = obj.name;
	monText.dirigeant = obj.dirigeant;
	monText.type = obj.type;
	monText.Categorie = obj.Categorie;
	monText.adresse = obj.adresse;
	monText.CapitalSocial = obj.CapitalSocial; 
	monText.chiffreAffaire = obj.chiffreAffaire;
	monText.resultatNet = obj.resultatNet;
	monText.effectif =  obj.effectif;
	monText.EBEN =  obj.EBEN;
	monText.RCAIN =  obj.RCAIN;
	monText.ResulatExpoitation =  obj.ResulatExpoitation;
	monText.ValeureAjoute =  obj.ValeureAjoute; 
	monText.CapitauxPropres =  obj.CapitauxPropres;
	monText.Dettes =  obj.Dettes;
	monText.TotalPassif =  obj.TotalPassif;
	monText.ActifImmobilise = obj.ActifImmobilise;
	monText.ActifCirculant =  obj.ActifCirculant;
	monText.TotalActif =  obj.TotalActif;
	monText.tel = obj.tel;
	monText.fax = obj.fax;
	monText.prospection = obj.prospection;
	console.log("une instance est creer");
	var query = text.find(null);
	query.where('siret', obj.siret).limit(1); 
	query.exec(function (err, data) {
	if (err) { throw err; }
	if(data.length == 0){
		monText.save(function (err) {
		  if (err) { throw err; }
		  console.log('Enregistrement dans la base de donnée !');
		  // On se déconnecte de MongoDB maintenant
		  // mongoose.connection.close();
		});
	}else{
		console.log("l'enregistrement existe deja !!");
		// On va parcourir le résultat et on les afficher 
		var comm;
		for (var i = 0, l = data.length; i < l; i++) {
			comm = data[i];
			console.log('------------------------------');
			console.log('siren : ' + comm.siren);
			console.log('name : ' + comm.name);
		}
	}  
});
}
//****************************************************************************************************
var selecAll = function(item){
	var text = mongoose.model('commentaires', structure);
	var query = text.find(null);
	query.select('Categorie');
	query.exec(function (err, data) {
		if (err) return handleError(err);
		console.log(data); // Space Ghost is a talk show host.
	})
}
// selecAll("name");
// exports.enregistrement(obj);

//-----------------------------------------------------------------------------------------------------------------------
exports.prospection = function(that, fonc, paquets){
	var progress = 0;
	var j = 0;
	var prospect = new Array();
	var tabSiren = new Array();
	var text = mongoose.model('commentaires', structure);
	var query = text.find(null);
	query.select("siren Categorie").where('Categorie').regex(paquets.formeJuridique);
	query.exec(function (err, data) {
		if (err) return Error(err);
		for(tmp=0; tmp<data.length; tmp++){
			if(tabSiren.indexOf(data[tmp].siren)){
				tabSiren.push(data[tmp].siren);
				console.log(data[tmp].siren);
			}
		}
		filtre(that, fonc, prospect,tabSiren, paquets, j, progress);//todo
	})
}
//****************************************************************************************************
var filtre = function(that, fonc, prospect, tabSiren, paquets, j, progress){
console.log(util.inspect(tabSiren[j])+"------------------------------------");
console.log(j);
	var text = mongoose.model('commentaires', structure);
	var query = text.find(null);
		query.select("Categorie siren CapitalSocial effectif chiffreAffaire resultatNet prospection fax name adresse dirigeant").where('siren').equals(tabSiren[j]);
		query.exec(function (err, data) {
			if (err) return handleError(err);
					if(((data[0])&&((data[0].effectif)&&((parseNumber(data[0].effectif.n1)) >= paquets.nombreEmployes)))||(paquets.nombreEmployes == "0")){
							if(((data[0])&&(data[0].resultatNet)&&(data[0].resultatNet.n1)&&((parseNumber(data[0].resultatNet.n1)) >= paquets.resultatNet))||(paquets.resultatNet == 0)){
								if(((data[0])&&(data[0].chiffreAffaire)&&(data[0].chiffreAffaire.n1)&&((parseNumber(data[0].chiffreAffaire.n1)) >= paquets.chiffreAffaire))||(paquets.chiffreAffaire == 0)){
									if(((data[0])&&(data[0].CapitalSocial)&&(parseNumber(data[0].CapitalSocial) >= paquets.capitalSocial))||(paquets.CapitalSocial == 0)){
										if(((data[0])&&(paquets.evolution_chiffre_Affaire == "+")&&(data[0].chiffreAffaire)&&(data[0].chiffreAffaire.evolution)&&(data[0].chiffreAffaire.evolution[0])&&((data[0].chiffreAffaire.evolution[0]) == "+"))||(paquets.evolution_chiffre_Affaire =="0")||((paquets.evolution_chiffre_Affaire =="-"))){
											if(((data[0])&&(paquets.evolution_resultat_Net == "+")&&(data[0].resultatNet)&&(data[0].resultatNet.evolution)&&(data[0].resultatNet.evolution[0])&&((data[0].resultatNet.evolution[0]) == "+"))||(paquets.evolution_resultat_Net =="0")||(paquets.evolution_resultat_Net =="-")){
												if(data[0].adresse){
													var code_postal = data[0].adresse;
													var indice_paris = code_postal.lastIndexOf("PARIS");
													if(indice_paris > -1){
														code_postal = code_postal.slice(0, indice_paris);
													}
													var d = {};
													d.data = data[0];
													code_postal = code_postal.match(/\d/g);
													code_postal = code_postal.join("");
													code_postal = code_postal.slice(-5);
													code_postal = code_postal.slice(0, 2);
													d.code = code_postal;
													if((data[0].prospection = "false") && ((code_postal == paquets.departement)|| (paquets.departement=="0"))){
														console.log("***************** Une société trouvé !***********************");
														prospect.push(d);
													}else{
														console.log("----la société ne corresponds pas a vos critères de recherche-----");
													}
												}
											}
										}
									}
								}
							}
						}			
		if((tabSiren[++j]) && (j < 400)){		// TODO 400todo changer la valeur de j si la requette est trop longue
			// filtre(that, fonc, prospect, tabSiren, paquets, ++j, progress);
			filtre(that, fonc, prospect, tabSiren, paquets, j, progress);
		}else{
				console.log(prospect);
				console.log("-----FIN DE LA RECHERCHE--------");
				that[fonc](prospect);
				// mongoose.connection.close();
		}
	});
			
}
//****************************************************************************************************
	exports.update = function(faxx){
	var text = mongoose.model('commentaires', structure);
	var date = new Date();
	text.update({fax: faxx }, { $set: {prospection: date.valueOf() }}, function(){
		var query = text.find(null);
		query.select("fax prospection name").where('fax').equals(faxx);
		query.exec(function (err, data) {
			if (err) return Error(err);
			console.log(data[0]);
		})
	});
}
//****************************************************************************************************
	exports.updateAll = function(obj){
	var text = mongoose.model('commentaires', structure);
	var date = new Date();
	text.update({siren: obj.siren}, { $set: {name: obj.name}}, function(){
		text.update({siren: obj.siren}, { $set: {dirigeant: obj.dirigeant}}, function(){
			text.update({siren: obj.siren}, { $set: {Categorie: obj.Categorie}}, function(){
				text.update({siren: obj.siren}, { $set: {prospection:  obj.prospection}}, function(){
					text.update({siren: obj.siren}, { $set: {adresse: obj.adresse}}, function(){
						text.update({siren: obj.siren}, { $set: {CapitalSocial: obj.CapitalSocial}}, function(){
							text.update({siren: obj.siren}, { $set: {resultatNet: obj.resultatNet}}, function(){
								text.update({siren: obj.siren}, { $set: {effectif: obj.effectif}}, function(){
									text.update({siren: obj.siren}, { $set: {chiffreAffaire: obj.chiffreAffaire}}, function(){
										text.update({siren: obj.siren}, { $set: {fax: obj.fax}}, function(){
											console.log("-------Mise à jour des données-------");
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});
}
//*************************************************reprospection***************************************************
exports.reprospection = function(that, fonc){
	var text = mongoose.model('commentaires', structure);
	var entreprises = new Array();
	var query = text.find(null);
	query.select('Categorie siren CapitalSocial effectif chiffreAffaire resultatNet prospection fax name adresse dirigeant');
	query.exec(function (err, data) {
		if (err) return handleError(err);
		for(i=0; i<data.length; i++){
			var prospection = data[i].prospection;
			if((!isNaN(parseFloat(prospection)))&&(data[i].fax)){
				// var date = new Date();
				// var temps = date - parseFloat(prospection) ; todo mettre condition temporel sur la reprospetion
				entreprises.push(data[i]);
				
			}			
		}
		console.log(entreprises);
		that[fonc](entreprises);
	})
	
}
//*************************************************parseNumber***************************************************
var parseNumber = function(input){
	if(((input[0]) == " ")||((+input[0]) == 0)){
		input = input.slice(1, input.length);
	}
	var res = "";
	res = input;
	res = res.split(" ");
	if(res[0] == "-"){
		res = res[1].replace(".", "");
		if(res.indexOf(".")!=-1){
			res = res.replace(".", "");
		}
		if(res.indexOf(".")!=-1){
			res = res.replace(".", "");
		}
		if(res.indexOf(",")!=-1){
			res = res.replace(",", ".");
		}	
		if(isNaN(+res)){
			return 0;	
		}else{
		return -res;
		}
	}else{
		res = res[0].replace(".", "");
		if(res.indexOf(".")!=-1){
			res = res.replace(".", "");
		}
		if(res.indexOf(".")!=-1){
			res = res.replace(".", "");
		}
		if(res.indexOf(",")!=-1){
			res = res.replace(",", ".");
		}	
		if(isNaN(+res)){
			return 0;
		}else{
		return +res;
		}
	}
}
//**************************************************************************************************** 
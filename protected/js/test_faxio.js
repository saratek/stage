var db = require("./mongoose.js");
var fs = require('fs');
PDFDocument = require('pdfkit');
var Phaxio = require('phaxio'),
phaxio = new Phaxio('9413c9ed299b19c4f8005ce4f40c3da2b5109ef3', '2a0e9798a40025f96109a3dce901fa0f0357b588'),
callback = function(err,data){console.log(data);};


var envoyer = function(data, faxx, nom, adresse, dirigeant, formeJuridique, capitalSocial, evolution_CA, evolution_RN){
console.log("appel de la fonction envoyer ");
var paquets = {};
paquets.name = nom;
paquets.nom = dirigeant;
paquets.capital = ""+capitalSocial;
paquets.type = ""+formeJuridique;
paquets.adresse = ""+adresse;
if(formeJuridique && capitalSocial && nom){
	if((formeJuridique.indexOf("Société anonyme") > -1)||((formeJuridique.indexOf("SA") > -1)&&(formeJuridique.indexOf("SARL") < 0)&&(formeJuridique.indexOf("SASU") < 0))){
		console.log("--------------prospection d'une SA --------------");
		if((evolution_CA == "+")&&(evolution_RN == "+")){
		console.log("--------------------prospection d'une sa croissante------------------");
		pdf2(paquets, data, faxx);
		}else{
		console.log("prospection d'une simpele sa PDF 1");
		pdf1(paquets, data, faxx);
		}
	}else if((formeJuridique.indexOf("SARL") > -1)||(formeJuridique.indexOf("Société à responsabilité limitée") > -1)){
		console.log("--------------prospection d'une SARL --------------");
		if((evolution_CA == "+")&&(evolution_RN == "+")){
		console.log("---------------------prospection d'une sarl croissante---------------------");
		pdf4(paquets, data, faxx);
		}else{
		console.log("prospection d'une simple sarl");
		pdf3(paquets, data, faxx);
		}
	}else if((formeJuridique.indexOf("Société par actions simplifiée") > -1)){
		console.log("--------------prospection d'une SAS --------------");
		if((evolution_CA == "+")&&(evolution_RN == "+")){
		console.log("----------------prospection d'une sas croissante-------------------------");
		pdf6(paquets, data, faxx);
		}else{
		console.log("-------------------prospection d'une simple sas------------------------");
		pdf5(paquets, data, faxx);
		}
	}
}
}
//------------------------------------------------------------------------------------------------------------
exports.sendFax = function(that, fonc, data, dirigeant, nom, adresse, formeJuridique, capitalSocial, evolution_CA, evolution_RN){
	rep ={};
	rep.reponse = "ko";
	rep.tps = data.length * (2600);
	that[fonc](rep);
	var i = 0;
	var tempo = setInterval(function (){
		if(data[i]){
			d = data[i].toString();
			d = d.substr(1);
			d = "33"+d;
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			console.log(d);
			// var d = ['33148241089', '33148241089', '33148241089']; //todo sup -> juste pour test
			envoyer(d, data[i], nom[i], adresse[i], dirigeant[i++], formeJuridique, capitalSocial, evolution_CA, evolution_RN);
		}else{
			clearInterval(tempo);
			console.log("---------les Fax ont été envoyer avec succes-----------");
		}
	},2500);
}
//------------------------------------------------------------------------------------------------------------
pdf1 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" "+paquets.type+"\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+"\n"+
	""+paquets.type+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprise avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de "+capital+" €, a retenu notre attention en raison de son potentiel de croissance.\n\n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	paquets.name+", ayant la forme de SA, pourrait avoir son marché d’actions : Carnet d’annonces, Marché Libre ou Alternext (1).\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 380);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :\n\n"; 
	doc.fontSize(10).text(text5, 100, 415);
	
	text6 = "améliorer la visibilité commerciale de l’entreprise \n"+
	"réaliser des augmentations de capital en restant indépendant \n"+
	"valoriser les actions des dirigeants et faciliter la transmission \n"+
	"encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 440);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 120, 500);
	
	text8 = "Didier SALWA,"+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 570);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 440);
	doc.image('./puce.JPEG', 100, 452);
	doc.image('./puce.JPEG', 100, 464);
	doc.image('./puce.JPEG', 100, 476);
	doc.image('./ciib.JPEG', 300, 580);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file", faxx);
		}	
	},1000);
}
//------------------------------------------------------------------------------------------------------------

pdf2 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" "+paquets.type+"\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+" SA\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprise avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de plus de "+capital+" €, a retenu toute notre attention en raison de la croissance de son activité (chiffre d’affaires et résultats).  \n \n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	paquets.name+", ayant la forme de SA, pourrait avoir son marché d’actions : Carnet d’annonces, Marché Libre ou Alternext (1).\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 410);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :\n\n"; 
	doc.fontSize(10).text(text5, 100, 445);
	
	text6 = "améliorer la visibilité commerciale de l’entreprise \n"+
	"réaliser des augmentations de capital en restant indépendant \n"+
	"valoriser les actions des dirigeants et faciliter la transmission \n"+
	"encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 470);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 120, 530);
	
	text8 = "Didier SALWA,"+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 570);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 470);
	doc.image('./puce.JPEG', 100, 482);
	doc.image('./puce.JPEG', 100, 494);
	doc.image('./puce.JPEG', 100, 506);
	doc.image('./ciib.JPEG', 300, 580);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file", faxx);
		}	
	},1000);
}
//------------------------------------------------------------------------------------------------------------
pdf3 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" SARL\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+" SARL\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprisE avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de plus de "+capital+" €, a retenu toute notre attention en raison de son potentiel de croissance.   \n \n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	"Toutefois, "+paquets.name+", ayant la forme de SARL, ne pourrait avoir son marché d’actions (Carnet d’annonces, Marché Libre ou Alternext) qu’après transformation en SA (1).\n\n Il se trouve que, d’après vos informations disponibles au greffe du Tribunal de Commerce, le niveau de fonds propres de "+paquets.name+" semble suffisant pour réaliser une telle opération.\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 430);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :\n\n"; 
	doc.fontSize(10).text(text5, 100, 465);
	
	text6 = "améliorer la visibilité commerciale de l’entreprise \n"+
	"réaliser des augmentations de capital en restant indépendant \n"+
	"valoriser les actions des dirigeants et faciliter la transmission \n"+
	"encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 490);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 100, 540);
	
	text8 = "Didier SALWA, "+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 580);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 490);
	doc.image('./puce.JPEG', 100, 502);
	doc.image('./puce.JPEG', 100, 514);
	doc.image('./puce.JPEG', 100, 526);
	doc.image('./ciib.JPEG', 300, 590);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file");
		}	
	},1000);
}
//------------------------------------------------------------------------------------------------------------
pdf4 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" SARL\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprise avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de plus de "+capital+" €, a retenu toute notre attention en raison de la croissance de son activité (chiffre d’affaires et résultats).  \n \n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	"Toutefois, "+paquets.name+", ayant la forme de SARL, ne pourrait avoir son marché d’actions (Carnet d’annonces, Marché Libre ou Alternext) qu’après transformation en SA (1). \n Il se trouve que, d’après vos informations disponibles au greffe du Tribunal de Commerce, le niveau de fonds propres de "+paquets.name+" semble suffisant pour réaliser une telle opération.\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 420);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :"; 
	doc.fontSize(10).text(text5, 100, 455);
	
	text6 = "Améliorer la visibilité commerciale de l’entreprise \n"+
	"Réaliser des augmentations de capital en restant indépendant \n"+
	"Valoriser les actions des dirigeants et faciliter la transmission \n"+
	"Encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 480);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 100, 530);
	
	text8 = "Didier SALWA,"+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 570);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 480);
	doc.image('./puce.JPEG', 100, 492);
	doc.image('./puce.JPEG', 100, 504);
	doc.image('./puce.JPEG', 100, 516);
	doc.image('./ciib.JPEG', 300, 580);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file");
		}	
	},1000);
}
//------------------------------------------------------------------------------------------------------------
pdf5 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" "+paquets.type+"\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+" "+paquets.type+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprise avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de plus de "+capital+" €, a retenu toute notre attention en raison de son potentiel de croissance. \n \n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	"Toutefois, "+paquets.name+", ayant la forme de SAS, ne pourrait avoir son marché d’actions (Carnet d’annonces, Marché Libre ou Alternext) qu’après transformation en SA (1).\n\n"+
	"Il se trouve que, d’après vos informations disponibles au greffe du Tribunal de Commerce, le niveau de fonds propres de "+paquets.name+" semble suffisant pour réaliser une telle opération\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 410);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :\n\n"; 
	doc.fontSize(10).text(text5, 100, 445);
	
	text6 = "améliorer la visibilité commerciale de l’entreprise \n"+
	"réaliser des augmentations de capital en restant indépendant \n"+
	"valoriser les actions des dirigeants et faciliter la transmission \n"+
	"encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 470);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 120, 520);
	
	text8 = "Didier SALWA,"+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 570);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 470);
	doc.image('./puce.JPEG', 100, 482);
	doc.image('./puce.JPEG', 100, 494);
	doc.image('./puce.JPEG', 100, 506);
	doc.image('./ciib.JPEG', 300, 580);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file", faxx);
		}	
	},1000);
}
//-------------------------------------------------------------------------------------------------------------
pdf6 = function(paquets, data, faxx){
	var capital = +paquets.capital;
	if(capital < 100000){
		capital = ""+capital;
		capital = capital.slice(0, 2);
		capital+= " 000";
		console.log(capital);
	}else if((capital >= 100000) && (capital < 1000000)){
		capital = ""+capital;
		capital = capital.slice(0, 3);
		capital+= " 000";
		console.log(capital);
	}else{
		capital = ""+capital;
		capital = capital.slice(0, 1);
		capital+= " 000 000";
		console.log(capital);
	}
	var date = new Date();
	mois = date.getMonth()+1;
	jour = date.getDate();
	mois = ""+mois;
	jour = ""+jour;
	if(mois.length == 1){
		mois = "0"+mois;
	}
	if(jour.length == 1){
		jour = "0"+jour;
	}
	doc = new PDFDocument();
	doc.x = 20;
	doc.y = 5;
	if(paquets.nom){
		var a = fs.createWriteStream('./'+paquets.nom+'.pdf');
	}else{
		var a = fs.createWriteStream('./file.pdf');
	}
	doc.pipe(a);
	// doc.pipe res;
	doc.image('./testt.JPEG', 0, 0);
	
	
	if(paquets.nom){
	text0 = ""+paquets.name+" SAS\n"+
	"A l'attention de "+paquets.nom+"\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le, "+jour+"/"+mois+"/"+date.getFullYear();
	}else{
	text0 = ""+paquets.name+" SAS\n"+
	""+paquets.adresse+"\n\n"+
	"Paris le,"+jour+"/"+mois+"/"+date.getFullYear();
	}
	doc.fontSize(10).text(text0, 350, 130);

	
	text1 = "Objet : financement en fonds propres de votre entreprise avec l'actionnariat individuel \n\n";
	doc.fontSize(10).text(text1, 100, 220);

	if((paquets.nom) && (paquets.nom[0] == "M") && (paquets.nom && paquets.nom[1] == "m")){
		text2 = "Madame,\n";
		text = "Madame";
	}else if((paquets.nom) && (paquets.nom[0] == "M")){
		text2 = "Monsieur,\n";
		text = "Monsieur";
	}else{
		text2 = "Madame, Monsieur\n";
		text = "Madame, Monsieur";
	}
	doc.fontSize(10).text(text2, 100, 250);
	
	text3 = "D’après vos comptes déposés au Greffe du Tribunal de Commerce, votre entreprise, au capital social de plus de "+capital+" €, a retenue toute notre attention en raison de la croissance de son activité (chiffre d’affaires et résultats).  \n \n"+ 
	"Nous vous invitons à nous contacter afin de vous informer sur les possibilités de financement en fonds propres de "+paquets.name+" avec l’actionnariat individuel.\n\n"+
	"Toutefois, "+paquets.name+", ayant la forme de SAS, ne pourrait avoir son marché d’actions (Carnet d’annonces, Marché Libre ou Alternext) qu’après transformation en SA (1).\n\n"+
	"Il se trouve que, d’après vos informations disponibles au greffe du Tribunal de Commerce, le niveau de fonds propres de "+paquets.name+" semble suffisant pour réaliser une telle opération\n\n";
	doc.fontSize(10).text(text3, 100, 270);

	text4 = "LE CIIB SA se propose, à la lecture de votre bilan et d'après vos objectifs de développement, d'affiner notre premier diagnostic.\n\n";
	doc.fontSize(10).text(text4, 100, 430);
	
	text5 = "L’utilisation d’un marché d’actions est une décision stratégique pour l'entreprise et une décision de saine gestion du patrimoine de l'entrepreneur :.\n\n"; 
	doc.fontSize(10).text(text5, 100, 465);
	
	text6 = "améliorer la visibilité commerciale de l’entreprise \n"+
	"réaliser des augmentations de capital en restant indépendant \n"+
	"valoriser les actions des dirigeants et faciliter la transmission \n"+
	"encourager la participation des salariés.\n\n"; 
	doc.fontSize(10).text(text6, 120, 490);
	
	text7 = "Vous en souhaitant bonne réception, veuillez agréer, "+text+", l’assurance de nos sentiments les meilleurs.";
	doc.fontSize(10).text(text7, 120, 540);
	
	text8 = "Didier SALWA,"+
	"Directeur Général";
	doc.fontSize(10).text(text8, 250, 570);
	
	doc.moveDown(15);
	doc.image('./puce.JPEG', 100, 490);
	doc.image('./puce.JPEG', 100, 502);
	doc.image('./puce.JPEG', 100, 514);
	doc.image('./puce.JPEG', 100, 526);
	doc.image('./ciib.JPEG', 300, 580);
	
	text9 ="(1) En effet, seules les Sociétés Anonymes peuvent avoir leur marché d’actions, avec ou sans la bourse";
	doc.fontSize(8).text(text9, 100, 670);
	
	doc.image('./signaturee.JPEG', -10, 700);
	doc.end();
	var tempo = setTimeout(function(){
		if(paquets.nom){
			send(data, paquets.nom, faxx);
		}else{
			send(data, "file", faxx);
		}	
	},1000);
}
//------------------------------------------------------------------------------------------------------------
var send = function(data, filname, faxx){
	var d = {};
	d.to = data;
	d.filenames = './'+filname+'.pdf';
	console.log("********envoie************");
	console.log(d);
	db.update(faxx); 
	// Dangereux !!!!! n'oublie pas denvoyer a CIIB pour les tests !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	phaxio.sendFax(d, function(err,res) {
	console.log("********envoie************");
	  console.log(res);
	  console.log(err);
	});
}
//----------------------------------------------TEST----------------------------------
// var data = new Array();
// data.push("33148241089");
// data.push("33148241089");
// var dirigeant = new Array();
// dirigeant.push("M Jean salwa");
// var nom = new Array();
// nom.push("CIIB");
// var formeJuridique = "SARL";
// var capitalSocial = "5000.000";
// exports.sendFax(null, null, data, dirigeant, nom, formeJuridique, capitalSocial);
//-----------------------------------/////-\\\\\-------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//----------------------------------REPROSPECTION------------------------------------------------------------------
//------------------------*******************************----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------
//----------------------------------/////-\\\\\--------------------------------------------------------------------
exports.reprospection = function(){
	db.reprospection(this, "resend");
}
exports.resend = function(entreprises){
	var i = 0;
	var tempo = setInterval(function (){
		if((entreprises[i]) && (entreprises[i].fax)){
			// d = entreprises[i].toString();
			d = entreprises[i].fax;
			d = d.substr(1);
			d = "33"+d;
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			d = d.replace(" ", "");
			console.log(d);
			// i++;
			renvoyer(d, entreprises[i].fax, entreprises[i].name, entreprises[i].dirigeant, entreprises[i].Categorie, entreprises[i++].CapitalSocial);
		}else{
			clearInterval(tempo);
			console.log("---------les Fax ont été envoyer avec succes-----------");
		}
	},2000);
};
//******************************************************************************************************
// reprospection();
//******************************************************************************************************
renvoyer = function(d, fax, nom, dirigeant, formeJuridique, capitalSocial){
// console.log("appel de la fonction envoyer ");
if(fax && capitalSocial && nom && dirigeant && formeJuridique){
	console.log(fax);
	console.log(nom);
	console.log(dirigeant);
	console.log(formeJuridique);
	console.log(capitalSocial);
	console.log(parseNumber(capitalSocial));
	console.log("************************************************************************");
	if((formeJuridique.indexOf("Société anonyme") > -1)||((formeJuridique.indexOf("SA") > -1)&&(formeJuridique.indexOf("SARL") < 0))){
		console.log("--------------prospection d'une SA --------------");
		// pdf1(paquets, data);
	}else if((formeJuridique.indexOf("SARL") > -1)||(formeJuridique.indexOf("Société à responsabilité limitée") > -1)){
		console.log("--------------prospection d'une SARL --------------");
		// pdf2(paquets, data);
	}
}
}
//***********************************************************************************************************
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
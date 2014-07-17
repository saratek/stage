//JS pour la page index


var index ={};

index.start = function () {
	document.addEventListener("click", index.on_click); // pour êvenement quand on clique sur la souris
	document.addEventListener("keydown", index.on_keydown); 
	index.on_date();

};
index.on_click = function (ev) {

	var src = ev.target;
	if (src.id == "btn-tester")
		{
			index.verif_formulaire();
		}
};

index.on_keydown = function (ev){
	if (ev.which == 13 ){

		ev.preventDefault();
		index.verif_formulaire();

	}
};

/************************************************************************************************************************/
/*
	fonction qui récupére les données du formulaire. puis on envoie ces données dans d'autre fonctions de vérif
*/
index.verif_formulaire = function (){
	/* partie informations */
	var anneCrea = document.getElementById("annee-creation").value;//année creation
	var formeJuridique = document.getElementById("forme-juridique").value;//forme juridique
	var rEtD = document.getElementById("check-box-value").checked;//si fort R&D, retourne true si coché, false sinon

	/*patie bilan */
	var nombreEmployeNow = document.getElementById("nombre_employe_now").value;//nombre employé actuel
	var bilanCA1 = document.getElementById("bilan-ca-1").value;//chiffre affaire n-1
	var bilanCA2 = document.getElementById("bilan-ca-2").value;//chiffre affaire n-2
	var bilanRN1 = document.getElementById("bilan-rn-1").value;//résulat net n-1
	var bilanRN2 = document.getElementById("bilan-rn-2").value;//resultat net n-2
	var bilanCSN1 = document.getElementById("bilan-cs-1").value;//Capital social n-1

	/* partie objectif */
	var nombreEmployeObj = document.getElementById("nombre_employe_obj").value;//nombre employé actuel

	var objFP0 = document.getElementById("obj-fp-0").value;//fond propre n
	var objFP1 = document.getElementById("obj-fp-1").value;//fond propre n+1
	var objFP2 = document.getElementById("obj-fp-2").value;//fond propre n+2

	var objCA0 = document.getElementById("obj-ca-0").value;//chiffre affaire n
	var objCA1 = document.getElementById("obj-ca-1").value;//chiffre affaire n+1
	var objCA2 = document.getElementById("obj-ca-2").value;//chiffre affaire n+2

	var objRN0 = document.getElementById("obj-rn-0").value;//résulat net n
	var objRN1 = document.getElementById("obj-rn-1").value;//résulat net n+1
	var objRN2 = document.getElementById("obj-rn-2").value;//resultat net n+2

	console.log(index.bilan_capital_social(bilanCSN1,objRN0,bilanRN1,bilanRN2));


	index.last_(index.annee_creation(anneCrea),index.forme_juridique(formeJuridique),index.nombre_employe_now(nombreEmployeNow),index.bilan_chiffre_affaire(bilanCA1,bilanCA2),index.bilan_resultat_net(bilanRN1,bilanRN2), index.bilan_capital_social(bilanCSN1,objRN0,bilanRN1,bilanRN2), index.obj_fond_propre(objFP0,objFP1,objFP2),index.obj_resultat_net(objRN0, objRN1, objRN2),index.obj_chiffre_affaire(objCA0, objCA1, objCA2),index.nombre_employe_obj(nombreEmployeObj,nombreEmployeNow));

};

/************************************************************************************************************************/
/*
	les fonctions de vérifification de formulaire retourne :
	0 : une erreur dans le formulaire : vide, faute d'orthographe ou autre ----> la notation ne se fera pas
	2 : critère destructif ou non : par exemple - de 3 ans ou - de 5 salariés
	3 : tout est OK
*/

//fonctions pour les info
index.annee_creation = function (anneeCrea){
/*
0 -> non remplie
2 -> inférieur strict à 3 ans
3 -> OK
*/
	//pour obtenir l'année
	{
	var d = new Date();
	d +="";
	d = d.split(" ");
	d = parseInt(d[3]);
	}
	// si le champ est vide, on indique qu'il est vide
	if (anneeCrea == "0"){
		document.getElementById("annee-creation-control").innerHTML="Sélectionner la date SVP";
		self.location.href="#annee-creation-control";
		return 0;						
	}else if (parseInt(anneeCrea)>=(d-2)){
		document.getElementById("annee-creation-control").innerHTML="";
		return 2;
	}else{
		document.getElementById("annee-creation-control").innerHTML="";
		return 3;
	}
};//fonction annee de creation
index.forme_juridique = function (forme){
/*
	0 -> si pas remplie ou fausse valeur
	2 -> sarl ou sas
	3 -> sa
*/
	if (forme.toLowerCase() == "sarl" || forme.toLowerCase() == "sas" ){
		document.getElementById("forme-juridique-control").innerHTML="";
		return 2;
	}else if (forme.toLowerCase() != "sa"){
		document.getElementById("forme-juridique-control").innerHTML="Sélectionner une forme juridique SVP";
		self.location.href="#forme-juridique-control";
		return 0;
	}else if (forme.toLowerCase() == "sa"){
		document.getElementById("forme-juridique-control").innerHTML="";
		return 3;

	}
};//fonction vérifier la forme juridique

//fonctions pour le bilan
index.nombre_employe_now = function (nombre){
/*
return 0 si le nombre d'employé entré est vide ou non nombre
return 2 si le nombre d'employé est inférieur stricte à 5
return 3 si le nombre d'employé supérieur ou égale à 5
*/
	var reg = new RegExp('^[0-9]+$');

	if (reg.test(nombre)){
		if (parseInt(nombre) < 5){
			document.getElementById("nombre-employe-now-control").innerHTML = "";
			return 2;
		}else{
			document.getElementById("nombre-employe-now-control").innerHTML = "";
			return 3;
		 }
	 }else{
	 	document.getElementById("nombre-employe-now-control").innerHTML = "Saisir le nombre d'employés SVP";
		self.location.href="#nombre-employe-now-control";
		return 0;
	 }
};//fonction pour le nombre d'employé actuel
index.bilan_chiffre_affaire = function (nombre1, nombre2){
/*
parametre : chiffre affaire du bilan n-1 et n-2
0 -> si non rempli
2 -> rempli mais pas en progression
3 -> rempli et en progression
*/
var reg = new RegExp('^[0-9]+$');
if (reg.test(nombre1) && reg.test(nombre2)){
	document.getElementById("bilan-ca-control").innerHTML="";
	nombre1 = parseInt(nombre1);
	nombre2 = parseInt(nombre2);
	if (nombre1 > nombre2){
		return 3;
	}else{
		return 2;
	}
}else{
	document.getElementById("bilan-ca-control").innerHTML="Entrer des chiffres valides SVP, mettre 0 si vide";
	self.location.href="#bilan-ca-control";
	return 0;
}

};//fonction pour le chiffre affaire du bilan
index.bilan_resultat_net = function (nombre1, nombre2){
/*
parametre : resultat net du bilan n-1 et n-2
0 -> si non rempli
2 -> rempli mais pas en progression
3 -> rempli et en progression
*/
var reg = new RegExp('^[0-9]+$');
if (reg.test(nombre1) && reg.test(nombre2)){
	document.getElementById("bilan-rn-control").innerHTML="";
	nombre1 = parseInt(nombre1);
	nombre2 = parseInt(nombre2);
	if (nombre1 > nombre2){
		return 3;
	}else{
		return 2;
	}
}else{
	document.getElementById("bilan-rn-control").innerHTML="Entrer des chiffres valides SVP, mettre 0 si vide";
	self.location.href="#bilan-rn-control";
	return 0;
}

};//fonction pour les resultat net du bilan
index.bilan_capital_social = function (cs,rn,rn1,rn2){
/*
paramétre : 
capital social n-1, resultat net n, resultat net n-1, resultat net n-2
retourne:
	0 ->pas rempli 
	2 ->somme < 37k
	3 ->somme >= 37K
*/
	var reg = new RegExp('^[0-9]+$');

	if (reg.test(cs) && reg.test(rn) && reg.test(rn1) && reg.test(rn2)){
		if (parseInt(cs)+parseInt(rn)+parseInt(rn1)+parseInt(rn2) < 37000){
			document.getElementById("bilan-cs-control").innerHTML = "";
			return 2;
		}else{
			document.getElementById("bilan-cs-control").innerHTML = "";
			return 3;
		}
	}else{
		document.getElementById("bilan-cs-control").innerHTML = "Entrer des chiffres valides ou 0 si vide";
		self.location.href="#bilan-cs-control";
		return 0;
	}

};//fonction pour le capital social


//fonctions pour les objectifs
index.nombre_employe_obj = function (nombre, nombre1){
/*
nombre = employé dans le futur
nombre1 = employé actuel
return 0 si le nombre d'employé entré est vide ou non nombre
return 2 si le nombre d'employé est inférieur ou égal à l'ancien
return 3 si le nombre d'employé supérieur à l'ancien
*/
	var reg = new RegExp('^[0-9]+$');

	if (reg.test(nombre)){
		if (parseInt(nombre) <= parseInt(nombre1)){
			document.getElementById("nombre-employe-obj-control").innerHTML = "";
			return 2;
		}else{
			document.getElementById("nombre-employe-obj-control").innerHTML = "";
			return 3;
		 }
	 }else{
	 	document.getElementById("nombre-employe-obj-control").innerHTML = "Saisir le nombre d'employés SVP";
		self.location.href="#nombre-employe-obj-control";
		return 0;
	 }
};//fonction pour le nombre d'employé actuel

index.obj_fond_propre = function (n,n1,n2){
/*
	fonction pour les fond propres
0 -> erreur
1 -> aucun marché
2 -> carnet annonce
3 -> Marché libre
4 -> Alternext
*/
var reg = new RegExp('^[0-9]+$');
if (reg.test(n) && reg.test(n1) && reg.test(n2)){
		document.getElementById("obj-fp-control").innerHTML="";
	n = parseInt(n);
	n1 = parseInt(n1);
	n2 = parseInt(n2);

	if (n+n1+n2 < 500000){
		return 1;
	}
	if (n <= 500000){
		return 2;
	}else if (500000 < n){
		if (n<=1500000){
		return 3;
		}else{
		return 4;
		}
	}

}else{
	document.getElementById("obj-fp-control").innerHTML="Entrer des chiffres corrects SVP, mettre 0 si vide";
	self.location.href="#obj-fp-control";
	return 0;
}
};//fonction pour les objectifs de fonds propres
index.obj_chiffre_affaire = function (nombre, nombre1, nombre2){
/*
parametre : chiffre affaire pour objectif n et n+1 n+2
0 -> si non rempli
2 -> rempli mais pas en progression
3 -> rempli et en progression
*/
var reg = new RegExp('^[0-9]+$');
if (reg.test(nombre1) && reg.test(nombre2) && reg.test(nombre)){
	document.getElementById("obj-ca-control").innerHTML="";
	nombre = parseInt(nombre);
	nombre1 = parseInt(nombre1);
	nombre2 = parseInt(nombre2);
	if (nombre < nombre1 && nombre1 < nombre2){//si croissance du ca dans le futur
		return 3;
	}else{//sinon
		return 2;
	}
}else{
	document.getElementById("obj-ca-control").innerHTML="Entrer des chiffres valides SVP, mettre 0 si vide";
	self.location.href="#obj-ca-control";
	return 0;
}

};//fonction pour le chiffre affaire du bilan
index.obj_resultat_net = function (nombre, nombre1, nombre2){
/*
parametre : resultat net pour objectif n et n+1 n+2
0 -> si non rempli
2 -> rempli mais pas en progression
3 -> rempli et en progression
*/
var reg = new RegExp('^[0-9]+$');
if (reg.test(nombre1) && reg.test(nombre2) && reg.test(nombre)){
	document.getElementById("obj-rn-control").innerHTML="";
	nombre = parseInt(nombre);
	nombre1 = parseInt(nombre1);
	nombre2 = parseInt(nombre2);
	if (nombre < nombre1 && nombre1 < nombre2){//si croissance du ca dans le futur
		return 3;
	}else{//sinon
		return 2;
	}
}else{
	document.getElementById("obj-rn-control").innerHTML="Entrer des chiffres valides SVP, mettre 0 si vide";
	self.location.href="#obj-rn-control";
	return 0;
}

};//fonction pour le resultat net du bilan


/*
	fin des fonctions de vérif
*/

/************************************************************************************************************************/
/*
	fonction de retour de resultat  affichage
*/


index.last_=function(year, forme, employ, bca, brn, bcs, ofp, orn, oca, employObj){
/*
	paramètre d'entrèe : 
résultat de fonction de l'année, forme juridique, employé actuel, CA bilan, Resultat Bilan, Capital social bilan, Obj fond propre, obj resultat, obj CA, obj employé
Si vous le souhaitez, nous pouvons réaliser une étude de faisabilité approfondie sur la capacité de votre entreprise à accroître ses fonds propres avec l'épargne individuelle.
*/



		if (year*forme*employ*bca*brn*bcs*ofp*orn*oca*employObj == 0 ){//si erreur dans le formulaire on affiche rien
			document.getElementById("resultat-visibilite").style.display="none";
			console.log("erreur formulaire");
			return 0;
		}else if (ofp_display(ofp) == false){//Probleme de objectif de fonds propres, si pas eligible à cause de fond propre
			document.getElementById("resultat-visibilite").style.display="";
			document.getElementById("resultat-formulaire").innerHTML="Vos objectifs de fonds propres ne semblent pas nécessiter l'utilisation d'un marché d'actions.</br></br>Si vous le souhaitez, nous pouvons néanmoins réaliser une étude de faisabilité approfondie sur la capacité de votre entreprise à accroître ses fonds propres avec l'épargne individuelle. Contactez CIIB en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a> !";		
			document.getElementById("resultat-formulaire").className="text-danger";
			self.location.href="#resultat-visibilite";
			return 1;
		}else if (forme == 2){// si c'est une SARL ou SAS
			if(bcs==2){
				document.getElementById("resultat-visibilite").style.display="";//si <37k
				document.getElementById("resultat-formulaire").innerHTML="Votre forme juridique ne vous permet pas d'utiliser immédiatement un marché d'actions. Seules les SA peuvent utiliser un marché d'actions.</br></br>Le niveau de vos fonds propres ne semblent pas suffisant pour procéder dès maintenant à une opération de transformation en SA.</br></br>Si vous le souhaitez, nous pouvons réaliser une étude de faisabilité plus approfondie. Contactez CIIB en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";		
				document.getElementById("resultat-formulaire").className="text-danger";
				self.location.href="#resultat-visibilite";
				return 1;
			}else if (bcs == 3){
				document.getElementById("resultat-visibilite").style.display="";//si >=37k
				document.getElementById("resultat-formulaire").innerHTML="Votre forme juridique ne vous permet pas d'utiliser immédiatement un marché d'actions. Seules les SA peuvent utiliser un marché d'actions.</br></br>Cependant, le niveau de vos fonds propres semblent suffisant pour procéder dès maintenant à une opération de transformation en SA.</br></br>Si vous le souhaitez, nous pouvons réaliser une étude de faisabilité plus approfondie. Contactez CIIB en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";		
				document.getElementById("resultat-formulaire").className="text-danger";
				self.location.href="#resultat-visibilite";
				return 1;
			}else{
				console.log("erreur");
				return 0;
			}
		}else if (year == 2 && employ == 2 && document.getElementById("bilan-ca-1").value <500000){//si inférieur à 3 ans, ca inferieur a 500K, employé inférieur à 5
			document.getElementById("resultat-visibilite").style.display="";
			self.location.href="#resultat-visibilite";
			document.getElementById("resultat-formulaire").innerHTML="Il est à priori prématuré pour votre entreprise de mettre en place un marché d'actions.</br></br>Pour une étude de faisabilité plus approfondie, contactez CIIB <a href = http://www.ciib.fr/contact-us-email>ici</a>.";
			document.getElementById("resultat-formulaire").className="text-danger";
			return 1;

		}else if (year*forme*employ*bca*brn*oca*orn*employObj == Math.pow(3, 8)){//si tout est à 3, au max
			document.getElementById("resultat-visibilite").style.display="";
			self.location.href="#resultat-visibilite";
			document.getElementById("resultat-formulaire").innerHTML="Bravo, les informations que vous avez entrées montrent que VOUS avez le profil idéal pour prétendre à un marché d'action.</br></br>Pour une étude de faisabilité plus approfondie, contactez CIIB au plus vite en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";
			document.getElementById("resultat-formulaire").className="text-success";
			return 1;
		}else if (bca == 2 || brn == 2 || orn ==2 || oca == 2){// si pas de preogression dans les chiffres

			if ( document.getElementById("check-box-value").checked == false ){//si pas R&D
				document.getElementById("resultat-visibilite").style.display="";
				self.location.href="#resultat-visibilite";
				document.getElementById("resultat-formulaire").innerHTML="Votre profil ne semble pas compatible avec un marché d'action (progression du CA ou Résultat Net doivent être en progression).</br></br>Pour une étude de faisabilité plus approfondie, contactez CIIB au plus vite en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";
				document.getElementById("resultat-formulaire").className="text-info";
				return 1;
			}else if( document.getElementById("check-box-value").checked == true ){//si R&D
				document.getElementById("resultat-visibilite").style.display="";
				self.location.href="#resultat-visibilite";
				document.getElementById("resultat-formulaire").innerHTML="Votre profil est particulier.</br></br>Pour une étude de faisabilité plus approfondie, contactez CIIB au plus vite en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";
				document.getElementById("resultat-formulaire").className="text-info";
				return 1;
			}

		}else{
			document.getElementById("resultat-visibilite").style.display="";
			self.location.href="#resultat-visibilite";
			document.getElementById("resultat-formulaire").innerHTML="Votre profil est intéressant.</br></br>Pour une étude de faisabilité plus approfondie, contactez CIIB au plus vite en cliquant <a href = http://www.ciib.fr/contact-us-email>ici</a>.";
			document.getElementById("resultat-formulaire").className="text-info";
			return 1;
		}
};

var ofp_display = function (ofp){
	if (ofp == 1){
		document.getElementById("resultat-formulaire-fond-propre").innerHTML="Aucun marché";
		document.getElementById("resultat-formulaire-fond-propre").className="text-danger";
		return false;
	}else if (ofp == 2){
		document.getElementById("resultat-formulaire-fond-propre").innerHTML="Carnet d'annonces";
		document.getElementById("resultat-formulaire-fond-propre").className="text-success";
		return true;
	}else if (ofp == 3){
		document.getElementById("resultat-formulaire-fond-propre").innerHTML="Marché libre";
		document.getElementById("resultat-formulaire-fond-propre").className="text-success";
		return true;
	}else if (ofp == 4){
		document.getElementById("resultat-formulaire-fond-propre").innerHTML="Alternext";
		document.getElementById("resultat-formulaire-fond-propre").className="text-success";
		return true;
	}
};//fonction qui pren en parametre le resultat de l'objectif de fond propre, et ressort faux si egal = 1, et affiche le resultat dans le HTML


/************************************************************************************************************************/

index.on_date = function (){

	var d = new Date();
	d +="";
	d = d.split(" ");
	d = parseInt(d[3]);

	var anneeMoinsUn = document.getElementsByClassName("annee-1");

	for (var i = 0; i < anneeMoinsUn.length; i++) {
    anneeMoinsUn[i].placeholder = "n-1";
    anneeMoinsUn[i].title = "n-1";
	}

	var anneeMoinsDeux = document.getElementsByClassName("annee-2");

	for (var i = 0; i < anneeMoinsDeux.length; i++) {
    anneeMoinsDeux[i].placeholder = "n-2";
    anneeMoinsDeux[i].title = "n-2";
	}

	var anneeActuelle = document.getElementsByClassName("annee-0");

	for (var i = 0; i < anneeActuelle.length; i++) {
    anneeActuelle[i].placeholder = "n";
    anneeActuelle[i].title = "n";
	}

	var anneePlusUn = document.getElementsByClassName("annee+1");

	for (var i = 0; i < anneePlusUn.length; i++) {
    anneePlusUn[i].placeholder = "n+1";
    anneePlusUn[i].title = "n+1";
	}

	var anneePlusDeux = document.getElementsByClassName("annee+2");

	for (var i = 0; i < anneePlusDeux.length; i++) {
    anneePlusDeux[i].placeholder = "n+2";
    anneePlusDeux[i].title = "n+2";
	}

};//fonciton pour affichage des année//



/*   
FONCTION POUR VERIFIER L'EMAIL 
var checkmail = function(){
	var mail = document.getElementById("mail").value;
	if(validateEmail(mail)){
	document.getElementById("id-statut").className = "form-group has-success";
	console.log("ok-mail");
	}else{
	console.log("ko-mail");
	document.getElementById("id-statut").className = "form-group has-error";
	}
	};
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
/*   FONCTION POUR LE SIREN qui marche pas
var checksiren = function(){
	var siren = document.getElementById("siren").value;
	if (validateSiren(siren)){
		document.getElementById("siren-statut").className="form-group has-success";
	}else{
		document.getElementById("siren-statut").className="form-group has-error";
	}
};
function validateSiren(siren){
	var re = /^[0-9]{9}$/;
	return re.test(siren);
};
*/

HTMLElement.prototype.has_class = function (c) {
	return (this.className.indexOf(c) >= 0);
};

window.onload = function () {
	index.start();
	$('input[type=text][name=secondname]').tooltip({
	placement: "bottom",
	trigger: "focus"
	});
};
var util = require('util');
var https = require('https');
var fs = require('fs');
var db = require('./mongoose.js');
var EventEmitter = require('events').EventEmitter;
var evenement = new EventEmitter();
var i = 0;
var fax = new Array();
var nombre = 300007432;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', function(err) {
	console.log('---------------------Une rerreur c est produite----------------------------------------');
	console.log('Caught exception: ' + err);
	nombre ++;
	console.log('-----------------je suis tjr vivant!!!!!!----------------------------------------------------');
	evenement.emit("debut");
  
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
evenement.on("debut", function(){
if(nombre<999999999) {
	var tmp = nombre.toString();
	if (checksiren(tmp)){
		evenement.emit("web", nombre); 
		nombre ++;
	}else{
	nombre ++;
	evenement.emit("debut");
	}
}else console.log("fini");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
evenement.on("web", function(d){ 
console.log(d);
	var url="https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.societe.com%2Fsociete%2Ftiti-"+d+".html%22&format=json&diagnostics=true&callback=";
		https.get(url, function (r) {
		if(r.statusCode==200){
			var b = "";
			r.on("data", function (d) { // evenement qui se declanche lors de l'arrivée de donnée 
				b += d; // recuperation des données par 
			});
			r.on("end", function() { // fin de la recuperation 
			b = JSON.parse(b); // formatage du buffer en json 
			evenement.emit("html", b, d); // declanche ment d'un evenement qui va servir au stockage des données utiles			
			});
		}else{
			evenement.emit("debut");
		}
		})
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
evenement.on("html", function(b, d){
var obj = {};
obj.siren = d;
	if(b.query.results){ 
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				obj.siret = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[1].table.tr[0].td[1].p;
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0]){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table.tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table.tr.td){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table.tr.td){
								obj.dirigeant = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table.tr.td[1].p.content;
							}
						}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table[0]){
								if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table[0].tr.td){
									if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table[0].tr.td[1].a){
									obj.dirigeant = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[1].td[0].table[0].tr.td[1].a.content;
									}
								}
							}
						}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3]){
								if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3].td[1].p){
								obj.type = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3].td[1].p;
								}
							}
						}
					}
				}
			}
		}
		
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0]){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3].td[1].a){
							obj.adresse = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3].td[1].a.content;
						}
					}
					}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[2]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[2].td[1].a){
							obj.adresse = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[2].td[1].a.content;
							}
						}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[2].td[1].p){
							obj.type = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[2].td[1].p;
						}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0]){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[4]){
							obj.Categorie = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[4].td[1].p;
						}else if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3]){
							obj.Categorie = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[0].table[0].tr[3].td[1].p;
						}
					}
				}
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				obj.name = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[0].tr[2].td.div[0].div[0].h1;
			}
		}
		if(b.query.results.body.div.div.div[1].div[6].table.tr){
			if(b.query.results.body.div.div.div[1].div[6].table.tr[3]){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1]){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[1].table.tr[2].td[0].p == "Capital social"){
					obj.CapitalSocial = b.query.results.body.div.div.div[1].div[6].table.tr[3].td.table.tr.td.table.tr[0].td[0].table[1].tr[1].td.table.tr[0].td[1].table.tr[2].td[1].p;
					}
				}
			}
		}
		console.log("--------------------------------UN------------------------------------------");
		evenement.emit("bilan",obj);	
	}else{
		evenement.emit("debut");
	}	
});	
evenement.on("bilan", function(obj){
var b = ""; // TODO TMP
// console.log("--------------------------------------BILAN---------------------------------");
var url= "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.societe.com%2Fbilan%2Ftoto%2F"+obj.siren+"201212311.html%22&format=json&diagnostics=true&callback=";
	https.get(url, function (r) {
		if(r.statusCode==200){
			var b = "";
			r.on("data", function (d) { // evenement qui se declanche lors de l'arrivée de donnée 
				b += d; // recuperation des données par 
			});
			r.on("end", function() { // fin de la recuperation 
			b = JSON.parse(b); // formatage du buffer en json */
			evenement.emit("html2", b, obj); // declanche ment d'un evenement qui va servir au stockage des données utiles
			});
		
		}else{
		evenement.emit("debut");
		}
	}) 
})
//----------------------------------------------------------------------------------------------------------------------------
evenement.on("html2", function(b, obj){
	if(b.query.results)
		{  
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						var chiffreAffaire = {};
						chiffreAffaire.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[2].td[1].p;
						chiffreAffaire.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[2].td[2].p;
						chiffreAffaire.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[2].td[4].p;
						obj.chiffreAffaire = chiffreAffaire;
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[27]){
							var resultatNet = {};
							resultatNet.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[27].td[1].p;
							resultatNet.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[27].td[2].p;
							resultatNet.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[27].td[4].p;
							obj.resultatNet = resultatNet;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[31]){
							var effectif = {};
							effectif.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[31].td[1].p;
							effectif.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[31].td[2].p;
							effectif.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[31].td[4].p;
							obj.effectif = effectif;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[15]){
							var EBEN = {};
							EBEN.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[15].td[1].p;
							EBEN.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[15].td[2].p;
							EBEN.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[15].td[4].p;
							obj.EBEN = EBEN;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[23]){
							var RCAI = {};
							RCAI.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[23].td[1].p;
							RCAI.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[23].td[2].p;
							RCAI.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[23].td[4].p;
							obj.RCAI = RCAI;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[19]){
							var ResulatExpoitation = {}
							ResulatExpoitation.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[19].td[1].p;
							ResulatExpoitation.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[19].td[2].p;
							ResulatExpoitation.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[19].td[4].p;
							obj.ResulatExpoitation = ResulatExpoitation;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[11]){
							var ValeureAjoute = {};
							ValeureAjoute.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[11].td[1].p;
							ValeureAjoute.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[11].td[2].p;
							ValeureAjoute.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[8].td.table.tr.td.table.tr[11].td[4].p;
							obj.ValeureAjoute = ValeureAjoute;
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var CapitauxPropres = {};
								CapitauxPropres.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[2].td[1].p;
								CapitauxPropres.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[2].td[2].p;
								CapitauxPropres.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[2].td[4].p;
								obj.CapitauxPropres = CapitauxPropres;
							}
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var Dettes = {};
								Dettes.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[10].td[1].p;
								Dettes.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[10].td[2].p;
								Dettes.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[10].td[4].p;
								obj.Dettes = Dettes;
							}
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var TotalPassif = {};
								TotalPassif.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[22].td[1].p;
								TotalPassif.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[22].td[2].p;
								TotalPassif.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table.tr[22].td[4].p;
								obj.TotalPassif = TotalPassif;
							}
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var ActifImmobilise = {};
								ActifImmobilise.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[2].td[1].p;
								ActifImmobilise.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[2].td[2].p;
								ActifImmobilise.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[2].td[4].p;
								obj.ActifImmobilise = ActifImmobilise;
							}
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var ActifCirculant = {}
								ActifCirculant.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[9].td[1].p;
								ActifCirculant.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[9].td[2].p;
								ActifCirculant.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[9].td[4].p;
								obj.ActifCirculant = ActifCirculant;
							}
						}
					}
				}
			}
			if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table){
				if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
					if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr){
						if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4]){
							if(b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[6].td.table.tr.td.table){
								var TotalActif = {};
								TotalActif.n1 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[20].td[1].p;
								TotalActif.n2 = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[20].td[2].p;
								TotalActif.evolution = b.query.results.body.div.div.div[1].div[6].table.tr[2].td.table.tr.td.table.tr.td[0].table[1].tr[4].td.table.tr.td.table.tr[20].td[4].p;
								obj.TotalActif = TotalActif;
							}
						}
					}
				}
			}
			console.log("-----------------------------DEUX----------------------------------------------");
			evenement.emit("FAX", obj);
					
		}else{
		evenement.emit("debut");
		} 
		
})
//-----------------------------------------------------------------------------------------------------------------------------
evenement.on("FAX", function(obj){
// console.log("--------------------------------------FAX---------------------------------");
var url= "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.annuaire.com%2Ftoto%2Fltiti-"+obj.siret+"%2F%22&format=json&diagnostics=true&callback=";
	https.get(url, function (r) {
		if(r.statusCode==200){
			var b = "";
			r.on("data", function (d) {  
				b += d; 
			});
			r.on("end", function() {  
			b = JSON.parse(b);		
			evenement.emit("html3", b, obj);
			});
		}else{
			evenement.emit("debut");
		}
}) 
}) 

evenement.on("html3", function(b, obj){
	if(b.query.results)
		{ console.log("-----------------------------------FAX---------------------------------"); 
			if(b.query.results.body.div[1].div){
				if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[2]){
					if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0]){
						if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[2].span){
							if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[2].span[0]){
								// console.log(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[2].span.span[0].id);
								obj.tel = b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[2].span[0].id;
							}
						}
					}
				}
			}
			
			 if(b.query.results.body.div[1].div){
			 if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div){
					 if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[3]){
						 if(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[3].span){
							console.log(b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[3].span.content);
							obj.fax = b.query.results.body.div[1].div[1].div[1].div[0].div[0].div[1].div.div[0].p[3].span.content; // todo scheck telgth
							//--------------------------------------------------------------------
							fax.push(obj.fax);
						 }
					 }
				 }
			 }
			 obj.prospection = false;
			 //--------------enregistrement dans la db 
			 if((obj.fax || obj.tel) && obj.fax.length< 16){
			 console.log("-- /o/ ---- /o/ ---- /o/ ---- /o/ ---- /o/ ---- /o/ ---- /o/ -- "+ fax.length);
			 	// obj.insererPar = "heroku1"
				db.enregistrement(obj);
			 }
			
			console.log(obj);
			evenement.emit("debut");		
		}else{
		evenement.emit("debut");
		}
});
//-----------------------------------------------------------------------------------------------------------------------------
evenement.emit("debut");

function checksiren(siren){
	var b = siren.split('');//on stock chacque chiffre dans une colonne de tableau
	var somme = 0;
	b.reverse();

	for (var i = 0 ; i<9 ; i++){// pour la position 0 à la position 8 du tableau
	//attention car la on commence à la position 0 et non à la position 1
		if(i%2==0){//il faut faire *1
			tmp = b[i];
			somme += parseInt(tmp);
		}
		else{//il faut faire *2
				tmp = b[i]*2;
				if (tmp > 9 ){
					tmp -= 9;
				}
			somme += parseInt(tmp);
		}
	}

	if ((somme%10) == 0){
	return true;
	}
	else return false;

}
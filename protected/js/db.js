/*
Fonction addUSer qui ne sert à rien sachant qu'on peut le faire via l'api !
pour créer la collection, il faut ABSOLUTMENT lancer createCol qui créer une "clef primaire" ou "index" sur le mail/numero évitant ainsi les doublons

*/

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
    
    
exports.addUser = function(str, str1){//fonction pour ajouter un USER
MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;
		db.addUser(str, str1, function(err, result) {
		console.log(result);
		db.close();
    });
});
};

exports.createCol = function(){//creer une collection avec une clef sur le email
MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;
    
    db.createCollection("test_insert",function (err, inserted) {
    // check err...
    }
    );
    var collection = db.collection('test_insert');
     collection.ensureIndex({email:1},{unique:true},function (err, inserted) {
    // check err...
    }
    );
   	
})};//créer collection avec index, clef sur mail

exports.insert = function(data, res){//inserer le formulaire  
MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;
	
	
	
    var collection = db.collection('test_insert');

	
    collection.insert(data, function(err, docs) {
    if (err){//si il y a un doublon, on supprime le doc et on le crée
    	collection.remove({email:data.email},function(err){
    	if (err){//si erreur de suppression
    		console.log("erreur de suppression : "+err);
    		res.end(JSON.stringify({message: "ko"}));
    	}
    	else{ 
			collection.insert(data,function(err){
			if (err){//si erreur d'insertion
				console.log('mis a jour erreur : '+err);
				res.end(JSON.stringify({message: "ko"}));
			}
			else {
			res.end(JSON.stringify({message: "ok"}));
			console.log("MaJ ok");
			}
    		});
    	}
    	});
    	
   		res.end(JSON.stringify({message: "ko"}));
    }else{
        collection.count(function(err, count) {
            console.log(format("count = %s", count));
            res.end(JSON.stringify({message: "ok"}));
            db.close();
        });
    }
    });
});
};//pour insérer un élément pour le formulaire

exports.find = function(res){//fonction qui renvoi TOUS les formulaires NON archivé

MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    // Locate all the entries using find

    
    collection.find({archive: false}).toArray(function(err, results) {
    	if(err) console.log(err);
    	console.log("demande d'affichage");
        // res.end(JSON.stringify(results));
        // Let's close the db
       db.close();
    });
});
};//pour recevoir les entreprise non archivées

exports.find(res);


exports.findArchive = function(res){//fonction qui renvoi TOUS les formulaires qui SONT archivé

MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    // Locate all the entries using find

    
    collection.find({archive: true}).toArray(function(err, results) {
    	console.log("affichage");
        // res.end(JSON.stringify(results));
        // Let's close the db
       db.close();
    });
});
};//pour recevoir les entreprises archivées

exports.findArchive();

exports.archiver = function(mail, res){//pour archiver une entreprise. 
MongoClient.connect('mongodb://romain:romain@kahana.mongohq.com:10004/ciib_stage', function(err, db) {
    if(err) throw err;
    
    var collection = db.collection('test_insert');
    
    collection.update({email:mail},{$set:{archive: true}},function(err){
    if(err) console.log(err);
    collection.find({archive: false}).toArray(function(err, results) {
    	if(err) console.log(err);
    	console.log("Deamnde d'affichage");
        res.end(JSON.stringify(results));
        // Let's close the db
       db.close();
    });
   

    });//remove
});//mongoclient
};




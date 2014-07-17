 var http = require("http");
var util = require("util");
var fs = require("fs");
 fs.exists("../../public/acceuil.html", function (exist) {
            if (exist) {
			console.log("okkkkkkkkkkkkkkkkkkkkkk");
			}else{
			console.log("----------------------------------")
			}			
});
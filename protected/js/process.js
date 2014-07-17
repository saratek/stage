var a = 0;
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  for(i=0; i< 5; i++){ 
	console.log('je suis tjr vivant');
	a++;
	console.log(a);
  }
});

 for(i=0; i< 5; i++){ 
	a++;
	console.log(a);
	if(a ==5){
	var variable;
	console.log("bonjour je suis un process mechant !");
	console.log(variable.prix);
	}
  }

// var d = require('domain').create();
// d.on('error', function(er) {
  // for(i=0; i< 5; i++){ 
	// console.log('je suis tjr vivant');
  // }
  // });
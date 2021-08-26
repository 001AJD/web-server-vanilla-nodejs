// main file for server API
// dependecies
var http = require('http');
var https = require('https');
var url = require('url');
var { StringDecoder } = require('string_decoder');
var config = require('./config');
var fs = require('fs');
var _data = require('./lib/data');


_data.delete('test','newFile2',(err)=>{
	console.log('this was the error', err);// + ' and this is the data '+data);
});


// instantiate http server
var httpServer = http.createServer(function(req, res){
	unifiedServer(req,res);
});

// start the server
httpServer.listen(config.httpPort,function(){
	console.log('server is listening on port : ' + config.httpPort + ' in ' + config.envName + ' environment');
});

// instantiate the https server
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
	unifiedServer(req,res);
});

// start the https server
httpsServer.listen(config.httpsPort,function(){
	console.log('server is listening on port : ' + config.httpsPort + ' in ' + config.envName + ' environment');
});

// unified server to run server on both http and https protocol
var unifiedServer = function(req,res){
	// parse the URL string
	var parsedUrl = url.parse(req.url,true);
	var pathName = parsedUrl.pathname;
	// remove all the slashes from the bgeining and the end of the URL
	var trimmedPath = pathName.replace(/^\/+|\/+$/g,'');
	var httpMethod = req.method.toLowerCase();

	// get the query string as an object
	var queryStringObject = parsedUrl.query;

	// get headers as an object
	var headers = req.headers;

	// get payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
		console.log(buffer);
	})
	req.on('end',function(){
		buffer += decoder.end();
		// choose an handler to which the request should be routed to 
		var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		console.log(choosenHandler);
		// construct data object to send to handler function
		var data = {
			'trimmedPath':trimmedPath,
			'queryStringObject':queryStringObject,
			'headers': headers,
			'method': httpMethod,
			'payload':buffer
		};

		// route the request to the handler specified in the router
		choosenHandler(data,function(statusCode,payload){
			// check the value of status code and set it to 200 if not provided any 
			statusCode = typeof(statusCode) == 'number'? statusCode : 200;

			//check the value of payload and set it to empty object if not provided any
			payload = typeof(payload) == 'object' ? payload : {};

			// cover the payload to the string
			var payloadString = JSON.stringify(payload);
			console.log('returning the statusCode => ' + statusCode + '\n payload =>' + payloadString);

			// return the response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		});
	})
}

// define handlers
var handlers = {};

// ping handler
handlers.ping = function(data,callback){
	callback(200);
}

// not found handler
handlers.notFound = function(data,callback){
	callback(404);
}

// router
var router = {
	'ping': handlers.ping
};
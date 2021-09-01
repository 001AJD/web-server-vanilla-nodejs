// helpers functions for various task
var crypto = require('crypto');
var config = require('../config');

// container for helpers
var helpers = {};

// function to hash password
helpers.hash = (str)=>{
	// SHA2556 hash
	if(typeof(str) == 'string' && str.length > 0){
		var hash = crypto.createHmac('SHA256',config.hashingSecret).update(str).digest('hex');
		return hash;
	}else{
		return false;
	}
}

// function to parse string to json object
helpers.parseJsonToObject = (jsonString)=>{
	if(typeof(jsonString) == 'string' && jsonString.length > 0){
		try{
			var obj = JSON.parse(jsonString);
			return obj;
		}catch(e){
			return {};
		}
	}else{
		return {};
	}
}

// export the container
module.exports = helpers;
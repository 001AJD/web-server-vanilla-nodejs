const _data = require('../lib/data');
var helpers = require('./helpers');

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

// user handler
handlers.users = function(data,callback){
	var acceptableMethods = ['get','post','put','delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users[data.method](data,callback);
	}else{
		// http response code for method not allowed
		callback(405);
	}
}
// containers for the users subhandlers
handlers._users = {};

// users - post
// required data - firstName, lastName, phone, password, tosAgreement
// optional data - none
handlers._users.post = function(data,callback){
	// check the required filed values are present
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	var password = typeof(data.payload.password) == 'string' && data.payload.phone.trim().length > 0 ? data.payload.password.trim() : false;
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
	if(firstName && lastName && phone && password && tosAgreement){
		// check if phone already exists
		_data.read('users',phone,(err,data)=>{
			if(err){
				// hash the password
				var hashPassword = helpers.hash(password);
				if(hashPassword){
					// create user object
					var userObject = {
						'firstName': firstName,
						'lastName' : lastName,
						'phone' : phone,
						'password' : hashPassword,
						'tosAgreement' : tosAgreement
					};
					// store the user object
					_data.create('users',phone,userObject,(err)=>{
						if(!err){
							callback(200);
						}else{
							console.log(err);
							callback(500,{'Error':'Could not create the new users'})
						}
					})
				}else{
					callback(500,{'Error':'Could not hash the user\'s password'});
				}
			}else{
				callback(400,{'Error' : 'A User with phone number already exists'});
			}
		});
	}else{
		callback(400,{'Error':'Missing required fields'});
	}

}

// users - get
handlers._users.get = function(data,callback){
	// check that phone number is valid
	console.log(typeof(data.queryStringObject.phone));
	var phone  = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	console.log('phone number'+phone);
	
	if(phone){
		// lookup the user
		_data.read('users',phone,(err,data)=>{
			if(!err && data){
				// remove the hashed password from user object before returning it to the requester
				var data = helpers.parseJsonToObject(data);
				delete data.password;
				callback(200,data);
			}else{
				callback(404);
			}
		})
	}else{
		console.log('handlers=>users=>/get');
		callback(400,{'Error':'Missing required field'});
	}
	
}

// users - put
handlers._users.put = function(data,callback){
	
}

// users - delete
handlers._users.delete = function(data,callback){
	
}

module.exports = handlers;
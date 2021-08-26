// configuration variables
var environments = {};

//staging (default) environment
environments.staging = {
	'httpPort':3000,
	'httpsPort':3001,
	'envName': 'staging'
};

// production environment
environments.production = {
	'httpPort':5000,
	'httpsPort':5001,
	'envName':'production'
};

// determine which environment was passed as command line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase(): 'staging';

// check if the environment name passed is a valid env name
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport;
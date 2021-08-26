// lib for storing and adding data

var fs = require('fs');
var path = require('path');

// conatiner for the modules to be exported
var lib = {};
lib.baseDir = path.join(__dirname,'../.data/');

// function to write data to file
lib.create = function(dir,file,data,callback){
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
		if(!err && fileDescriptor)
		{
			//convert data to string
			var stringData = JSON.stringify(data);

			//write to file and close it
			fs.writeFile(fileDescriptor,stringData,function(err){
				if(!err)
				{
					fs.close(fileDescriptor,function(err){
						if(!err)
						{
							callback(false);
						}else{
							callback('Error closing the file');
						}
					});
				}else{
					callback('Error writing to new file');
				}
			});
		}else{
			callback('could not create a file, it may already exists');
		}
	});
}

// function to read data from file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',function(err,data){
		callback(err,data);
	});
}

// function to update the data in the file
lib.update = function(dir,file,data,callback){
	//open the file for witing
	fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			var stringData = JSON.stringify(data);

			// truncate the file
			fs.ftruncate(fileDescriptor,function(err){
				if(!err){
					// write to the file and close it
					fs.writeFile(fileDescriptor,stringData,function(err){
						if(!err){
							fs.close(fileDescriptor,function(err){
								if(!err){
									callback(false);
								}else{
									callback('Error closing the file '+err);
								}
							});
						}else{
							callback('Error writing to existing file'+err);
						}
					});
				}else{
					callback('Error truncating file'+err);
				}
			});
		}else{
			callback('Could not open a file for update, it may not exists yet');
		}
	});
}
// function to delete a file
lib.delete = function(dir,file,callback){
	fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
		if(!err){
			callback(false);
		}else{
			callback('Error deleting file '+err);
		}
	});
}

// export the module
module.exports = lib;
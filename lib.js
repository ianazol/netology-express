let users = [];
let inc = 0;

function getUserIndex(id){
	return users.findIndex(user => user.id == id);
}

function create(params, callback){
	let result = {},
		id = ++inc;
	users.push({
		"id": id,
	    "name": params.name,
	    "score": params.score
	});
	callback(null, users[users.length - 1]);
}

function read(params, callback){
	let index = getUserIndex(params.id);

	if (index < 0)
		callback('User not found', null);

	callback(null, users[index]);
}

function update(params, callback){
	let index = getUserIndex(params.id);

	if (index < 0)
		callback('User not found', null);

	if (params.name)
		users[index].name = params.name;
	if (params.score)
		users[index].score = params.score;

    callback(null, users[index]);
}

function remove(params, callback){
	let index = getUserIndex(params.id);

	if (index < 0)
		callback('User not found', null);

	users.splice(index, 1);
	callback(null, "done");
}

module.exports = {create, read, update, remove, getAll};
const express    = require("express");
const bodyParser = require("body-parser");
const app        = express();
const port       = process.env.PORT || 3000;

let users = [];
let inc = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

function getUserIndex(id){
	return users.findIndex(user => user.id == id);
}

//create
app.post("/users", function(req, res){
	let id = ++inc;
	users.push({
		"id": id,
	    "name": req.body.name,
	    "score": req.body.score
	});
	res.json(users[users.length - 1]);
});

//read
app.get("/users/:id", function(req, res){
	let index = getUserIndex(req.params.id);

	if (index < 0){
		res.status(404).send('User not found');
	} else {
		let data = {};

		if (req.query.fields){
			let fields = req.query.fields.split(",");
			fields.forEach((field) => data[field] = users[index][field]);
		} else {
			data = users[index];
		}
		res.json(data);
	}
});

//update
app.put("/users/:id", function(req, res){
	let index = getUserIndex(req.params.id);

	if (index < 0){
		res.status(404).send('User not found');
	} else {
		if (req.body.name)
			users[index].name = req.body.name;
		if (req.body.score)
			users[index].score = req.body.score;

	    res.json(users[index]);
	}
});

//delete
app.delete("/users/:id", function(req, res){
	let index = getUserIndex(req.params.id);

	if (index < 0){
		res.status(404).send('User not found');
	} else {
		users.splice(index, 1);
		res.json({"deleted": "ok"});
	}
});

//delete all users
app.delete("/users/", function(req, res){
	users = [];
	res.json({"deleted": "ok"});
});

//read all users
app.get("/users", function(req, res){
	let arUser = users.slice();

	if (req.query.limit){
		let limit = Number(req.query.limit);
		let offset = Number(req.query.offset) || 0;
		arUser = users.slice(offset, offset + limit);
	}

	if (req.query.fields){
		let fields = req.query.fields.split(",");
		let arResult = [];
		arUser.forEach((user, index) => {
			let userCopy = Object.assign({}, user);
			for (prop in userCopy){
				if (fields.indexOf(prop) == -1){
					delete userCopy[prop];
				}
			}
			arResult.push(userCopy);
		});
		arUser = arResult;
	}
	res.json(arUser);
});

app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
    res.status(500).send('500 Server Error');
});

app.listen(port);
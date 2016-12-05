const express    = require("express");
const bodyParser = require("body-parser");
const user       = require("./rest-lib");
const app        = express();
const port       = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

//create
app.post("/users", function(req, res){
	let result = user.create(req.body.name, req.body.score);
	res.json(result);
});

//read
app.get("/users/:id", function(req, res){
	let result = user.get(req.params.id, req.query.fields);
	if (!result)
		res.status(404).send('User not found');
	else
		res.json(result);
});

//update
app.put("/users/:id", function(req, res){
	let result = user.update(req.params.id, {name: req.body.name, score: req.body.score});
	if (!result)
		res.status(404).send('User not found');
	else
		res.json(result);
});

//delete
app.delete("/users/:id", function(req, res){
	let result = user.remove(req.params.id);
	if (!result)
		res.status(404).send('User not found');
	else
		res.json(result);
});

//delete all users
app.delete("/users/", function(req, res){
	let result = user.removeAll();
	res.json(result);
});

//read all users
app.get("/users", function(req, res){
	let result = user.getAll(req.query.limit, req.query.offset, req.query.fields);
	res.json(result);
});

app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
	console.dir(err);
    res.status(500).send('500 Server Error');
});

app.listen(port);
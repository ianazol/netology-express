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

	if (index < 0)
		res.status(404).send('User not found');

	res.json(users[index]);
});

//update
app.put("/users/:id", function(req, res){
	let index = getUserIndex(req.params.id);

	if (index < 0)
		res.status(404).send('User not found');

	if (req.body.name)
		users[index].name = req.body.name;
	if (req.body.score)
		users[index].score = req.body.score;

    res.json(users[index]);
});

//delete
app.delete("/users/:id", function(req, res){
	let index = getUserIndex(req.params.id);

	if (index < 0)
		res.status(404).send('User not found');

	users.splice(index, 1);
	res.json({"deleted": "ok"});
});

app.get("/users", function(req, res){
	res.json(users);
});

app.use(function(req, res){
    res.status(404).send('404 Not Found');
});

app.use(function(err, req, res, next){
    res.status(500).send('500 Server Error');
});

app.listen(port);
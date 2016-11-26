const express    = require("express");
const bodyParser = require("body-parser");
const RPC        = require("./lib.js");
const app        = express();
const port       = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));

app.post("/rpc", function(req, res) {
	const method = RPC[req.body.method];
	if (method){
		method(req.body.params, function(error, result) {
			let answer = {jsonrpc: "2.0", id: req.body.id};
			if(error)
				answer["error"] = {code: -32500, message: error}
			else
				answer["result"] = result;
			res.json(answer);
		});
	}
	else
	{
		res.json({
			jsonrpc: "2.0", 
			error: {
				code: -32601, 
				message: "Procedure not found"
			}, 
			id: req.body.id
		});
	} 
});

app.use(function(req, res){
    res.json({
		jsonrpc: "2.0", 
		error: {
			code: -32601, 
			message: "Procedure not found"
		}, 
		id: req.body.id
	});
});

app.use(function(err, req, res, next){
    res.json({
		jsonrpc: "2.0", 
		error: {
			code: -32500, 
			message: "Server error"
		}, 
		id: req.body.id
	});
});

app.listen(port);
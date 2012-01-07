var express = require("express");
var app = express.createServer();
app.use(express.bodyParser());

var mongo = require('mongoskin'),
    db = mongo.db('localhost:27017/testdb?auto_reconnect');

app.get('/', function(req, res){
	res.sendfile(__dirname + "/index.html");
});

app.get(/.*\.((js)|(css))/, function(req, res){
	console.log("serving static file "+req.url);
	res.sendfile(__dirname + req.url);
});

app.post('/register', function(req, res){
	var user = req.param('user');
	db.collection('users').findOne({
		_id: user
	}, function(err, items){
		if (err){
			res.json({
				error: err
			});
		} else {
			if (items !== null){
				res.json({
					error: "Username already taken"
				});
			} else {
				db.collection('users').save({
					_id: user,
					name : req.param('name'),
					email: req.param('email'),
					password: req.param('pass')
				});
				res.json({}); //ok
			}
		}
	});
});

app.get('/login', function(req, res){
	var user = req.param('user'),
		pass = req.param('password');
	db.collection('users').findOne({
		_id: user
	}, function(err, items){
		if (err){
			res.json({
				error: err
			});
		} else {
			if (items === null){
				res.json({
					error: 'Username does not exist'
				});
			} else if (items.password !== pass){
				res.json({
					error: 'Incorrect username/password'
				});
			} else {
				res.json({}); // ok
			}
		}
	});
});

app.get('/user', function(req, res){
	var q = req.param('q'),
		result = [];
	if (typeof q !== "object")
		q = [q];
	for (var i = 0; i < q.length; i++){
		db.collection('users').findOne({
			'_id': q[i]
		}, function(err, item){
			if (err === null && item !== null){
				delete item.password;
				result.push(item);
				if (result.length === q.length)
					res.json(result);
			}
		});
	}
});

app.get('/likeables', function(req, res){
	var lat = req.param('lat'),
		lon = req.param('lon');
	console.log("Request for lat/lon " + lat + ", " + lon);
	db.collection('likeables').find({
		loc: {
			$near : [lon, lat]
		}
	}).sort([
		['likes', 'descending'], 
		['dislikes', 'ascending']
	]).toArray(function(err, items){
		if (err)
			console.log("ERR", err);
		else 
			console.log("items near ", lat, lon, ":", items);
		res.json(items || []);
	});
});

app.post('/likeables', function(req, res){
	var lat = req.param('lat'),
		lon = req.param('lon'),
		name = req.param('name'),
		desc = req.param('description'),
		author = req.param('author');
	console.log("Got a post request", lat, lon, name, desc);
	db.collection('likeables').save({
		loc : {
			lon: Number(lon),
			lat: Number(lat)
		},
		name: name,
		description: desc,
		likes: 0,
		likers: [],
		dislikes: 0,
		dislikers: [],
		author: author,
		comments : []
	}, function(err, dbres){
		if (err){
			res.json({error: err});
		} else {
			res.json(dbres);
		}
	});
});

app.post('/like', function(req, res){
	var id = req.param('id'),
		user = req.param('user');
	db.collection('likeables').findById(id, function(err, item){
		item.likers.push(user);
		item.likes++;
		db.collection('likeables').save(item, function(err){
			console.log(err);
			if (!err)
				res.json({});
			else
				res.json({error: err});
		});
	});
});

app.post('/dislike', function(req, res){
	var id = req.param('id'),
		user = req.param('user');
	db.collection('likeables').findById(id, function(err, item){
		item.dislikers.push(user);
		item.dislikes++;
		db.collection('likeables').save(item, function(err){
			if (!err)
				res.json({});
			else
				res.json({error: err});
		});
	});
});

app.post('/comment', function(req, res){
	var likeableId = req.param('likeableId'),
		user = req.param('user'),
		content = req.param('content');
	console.log("Comment posted by "+user+": "+content+", for likeable with id: "+likeableId);
	db.collection('likeables').findById(likeableId, function(err, item){
		item.comments.push({
			author: user,
			content: content,
			posted: new Date()
		});
		console.log(item);
		db.collection('likeables').save(item, function(err){
			if (err){
				res.json({error: err});
			} else {
				res.json({});
			}
		});
	});
});

app.listen(9000, function(){
	console.log("Listening on port 9000 ... ");
});

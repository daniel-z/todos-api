var express = require('express');
var exphbs  = require('express-handlebars');
var fs = require("fs");
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

var todos = JSON.parse(fs.readFileSync("./data/todos.json"));

var app = express();

var objectToString = function(dataObject, pre, post, identation) {
    pre = pre || '';
    post = post || '';
    identation = identation || '';

    var lines = pre + identation + '{\n';
    Object.keys(dataObject).forEach(function (key) {
        lines += identation + "  '" + key + "' : '" + dataObject[key] + "', \n";
    });
    lines += identation + '}'+ post +'\n';
    return lines;
};

var jsonToString = function (jsonData) {
    var jsonString = '';
    var pre = '';
    var post = ',';
    var identation = '  '

    if (jsonData instanceof Array) {
        jsonString += '[\n';
        jsonData.forEach(function(arrayItem) {
            jsonString += objectToString(arrayItem, pre, post, identation);
        });
        jsonString += ']\n'
    } else if (jsonData instanceof Object) {
        jsonString = objectToString(jsonData);
    }
    return jsonString;
};

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        jsonToString: jsonToString,
        jsonArrayOfObjectsToString: function (dataArray) {
            var dataString = '';
            dataArray.forEach(function (object) {
                dataObjecttoString(object);
            });
            return dataString;
        },
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// SET CORS HEADERS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

// ----------------------------------------------------------------------------------------------------------------
// VIEWS
// ----------------------------------------------------------------------------------------------------------------
app.use('/static', express.static('assets'))

const dataApi = JSON.parse(fs.readFileSync("./data/api-data.json"));

app.get('/', function (req, res) {
    res.render('index', { tasks: dataApi });
})


// ----------------------------------------------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------------------------------------------

app.get('/api/todos', function (req, res) {
  res.json(todos);
});

app.get('/api/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {id : todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  }

  res.status(404).send();
});

app.delete('/api/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id : todoId});

    if (matchedTodo) {
        res.json({ deleted: true });
    }

    res.status(404).send();
});

app.put('/api/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {id : todoId});
  var body = _.pick(req.body, 'description', 'completed');
  var updated = _.extend(matchedTodo, body);

  if (!req.params.id || !_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  res.send(updated);
});

app.post('/api/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  body.description = body.description.trim();

  body.id = randomInt();
  todos.push(body);

  res.json(body);
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});

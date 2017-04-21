var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
  {
    id: 83515750,
    description: 'Create a ToDo App.',
    completed: false
  },
  {
    id: 51839147,
    description: 'Consume ToDo API.',
    completed: false
  },
  {
    id: 71862996,
    description: 'Use the frameworks, tools and resources that you need.',
    completed: false
  },
  {
    id: 95484409,
    description: 'Follow proposed design.',
    completed: false
  },
  {
    id: 40016268,
    description: 'Ask for any question you have regarding this.',
    completed: false
  },
  {
    id: 8370263,
    description: 'Use best practices, design patterns and the best code styles.',
    completed: false
  }
];

function randomInt () {
  var low = 0;
  var high = 100000000;
  return Math.floor(Math.random() * (high - low) + low);
}

var todoNextId = 1;

app.use(bodyParser.json());

app.get('/api', function (req, res) {
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

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

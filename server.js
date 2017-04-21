var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
  {
    id: 1,
    body: 'Create a ToDo App.',
    completed: false
  },
  {
    id: 2,
    body: 'Consume ToDo API.',
    completed: false
  },
  {
    id: 3,
    body: 'Use the frameworks, tools and resources that you need.',
    completed: false
  },
  {
    id: 4,
    body: 'Follow proposed design.',
    completed: false
  },
  {
    id: 5,
    body: 'Ask for any question you have regarding this.',
    completed: false
  },
  {
    id: 6,
    body: 'Use best practices, design patterns and the best code styles.',
    completed: false
  }
];

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

app.post('/api/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }

  body.description = body.description.trim();

  body.id = todoNextId++;
  todos.push(body);

  res.json(body);
});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT);
});

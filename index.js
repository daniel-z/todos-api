var express = require('express');
var exphbs  = require('express-handlebars');

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
    description: 'Ask any question you have regarding this assignment.',
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


const dataApi = [{
    title: 'Get all tasks',
    method: 'get',
    url: '/api/todos',
    description: '',
    response: [{
        id: 83515750,
        description: "A new task",
        completed: false
    },
    {
        id: 1098762,
        description: "other task",
        completed: false
    }],
},{
    title: 'Get a single task',
    method: 'get',
    url: '/api/todos/{id}',
    description: '',
    response: {
        id: 83515750,
        description: "A new task",
        completed: false
    },
}, {
    title: 'Create new task',
    method: 'post',
    url: '/api/todos',
    description:
    "Create a request with the next data attributes: <br/>" +
    "&nbsp;&nbsp;- description: [String] <br/>" +
    "&nbsp;&nbsp;- completed: [Boolean] <br/>",
    request: {
        description: "A new task",
        completed: false
    },
    response: {
        id: 83515750,
        description: "A new task",
        completed: false
    },
}, {
    title: 'Update a task',
    method: 'put',
    url: '/api/todos/{id}',
    description:
    "Create a request with the next data attributes: <br/>" +
    "&nbsp;&nbsp;- description: [String] <br/>" +
    "&nbsp;&nbsp;- completed: [Boolean] <br/>",
    request: {
        description: "The same task modified",
        completed: true
    },
    response: {
        id: 83515750,
        description: "The same task modified",
        completed: true
    },
}, {
    title: 'Delete a task',
    method: 'delete',
    url: '/api/todos/{id}',
    description: '',
    response: {
        deleted: true
    },
}];


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

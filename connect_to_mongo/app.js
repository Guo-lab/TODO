var createError = require('http-errors');
var express = require('express');

var mongoose = require('mongoose');


var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

/*
mongoose.connect('mongodb://localhost:27017/todo_development',function(err) {
	if(!err) {
		console.log('Connect to DB');
	} else {
		throw err;
	}
});
*/


mongoose.connect('mongodb://localhost/todo_development');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Task = new Schema({
	task: String
});
var Task = mongoose.model('Task',Task);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/tasks',function(req,res){
	Task.find({},function(err,docs){
		res.render('tasks/index',{
			title:'TODOS index view',
			docs:docs
		});
	});
});

app.get('/tasks/new',function(req,res){
	res.render('tasks/new.jade',{ title:'New Task'});
});

app.post('/tasks',function(req,res){
	var task = new Task(req.body.task);
	// res.render('tasks/test.jade',{title:req.body});
	task.save(function (err) {
		if(!err) {
			// console.log("OKK");
			res.redirect('/tasks');
		} else {
			res.redirect('/tasks/new');
		}
	});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

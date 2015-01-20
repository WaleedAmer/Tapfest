
/*-------------------------------------*/
// 						               //
//						               //
//        Socket.io Canvas Game        //
//         by Waleed Amer 2015         //
// 							           //
/*_____________________________________*/


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var count = 0;

// When someone connects to the app
io.on('connection', function(socket){

	count++;

	io.sockets.emit('userCount', count);

	var taps = 0;

	// Generate Username
	var adj = ['Blusty', 'Musty', 'Chusty', 'Skusty', 
			   'Crusty', 'Fusty', 'Spusty', 'Justy',
			   'Husty', 'Busty', 'Stusty', 'Spusty',
			   'Flusty', 'Vusty', 'Rusty', 'Shusty'];

	var noun = ['Turkey', 'Rabbit', 'Antelope', 'Cucumber', 
				'Unicorn', 'Catfish', 'Badger', 'Milkshake',
				'Diaper', 'Spoon', 'Durag', 'Cheesesteak',
				'Rooster', 'Chicken', 'Dragon', 'Robot',
				'Skateboard', 'Meatloaf', 'Turtle', 'Possum',
				'Kettle', 'Lips', 'Earlobe', 'Magician',
				'Butterfly', 'Dog', 'Socks', 'Superhero'];

	var name = adj[Math.floor(Math.random()*adj.length)]+' '+noun[Math.floor(Math.random()*noun.length)];

	socket.broadcast.emit('newUser', name + ' joined!');

	console.log(name +' joined');
	console.log(count + ' people are online');


	socket.on('con', function(){
		socket.emit('conct', 'Welcome to Tapfest, ' + name + '!');
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('userLeft', name+ ' left');
		console.log(name+ ' left');
		count--;
		io.sockets.emit('userCount', count);
	});

	socket.on('tap', function(msg){

		taps++;

		var color = msg.color;

		var pkg = {
			txt: '' + name + '  -  ' + taps + ' taps',
			taps: taps,
			col: color
		};

		socket.emit('mytap', pkg);
		socket.broadcast.emit('tap', msg);
		console.log(name + ': ('+msg.x + ',' + msg.y +')');
	});
});


// ----- OTHER STUFF ----- //

// Prompt when you start the server 

http.listen(process.env.PORT || 3000, function(){
	console.log('Server active on *:3000');
});
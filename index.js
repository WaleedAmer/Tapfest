//        Socket.io Canvas Game        //
//         by Waleed Amer 2015         //

// Frameworks
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

// Route to index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html')
})

// Start counting users online
var count = 0

// When user connects to the server
io.on('connection', function(socket) {

	// Add to number of users online
	count++

	// Send number of users online to user's client
	io.sockets.emit('userCount', count)

	// Grammar for users online
	if (count > 1) {
		var txt = ' people are online'
	}
	else {
		var txt = ' person is online'
	}
	console.log(count + txt)

	// Start counting user's taps
	var taps = 0

	// Generate Username
	var adj = ['Fluffy', 'Musty', 'Chusty', 'Skusty',
			   'Crusty', 'Fusty', 'Spusty', 'Justy',
			   'Husty', 'Busty', 'Stusty', 'Spusty',
			   'Flusty', 'Vusty', 'Rusty', 'Shusty',
			   'Grusty', 'Zusty', 'Nusty', 'Xusty',
			   'Khusty', 'Wusty', 'Custy', 'Gusty']

	var noun = ['Turkey', 'Rabbit', 'Antelope', 'Cucumber',
				'Unicorn', 'Catfish', 'Badger', 'Milkshake',
				'Diaper', 'Spoon', 'Durag', 'Cheesesteak',
				'Rooster', 'Chicken', 'Dragon', 'Robot',
				'Skateboard', 'Meatloaf', 'Turtle', 'Possum',
				'Kettle', 'Lips', 'Earlobe', 'Magician',
				'Butterfly', 'Dog', 'Socks', 'Superhero',
				'T-Rex', 'Elephant', 'Walrus', 'Villager',
				'Carpenter', 'Noodle', 'Doorknob', 'Champion']

	var name = adj[Math.floor(Math.random()*adj.length)]+' '+noun[Math.floor(Math.random()*noun.length)]

	// Broadcast/log that user joined
	socket.broadcast.emit('newUser', name + ' joined!')
	console.log(name +' joined')

	// Welcome message
	socket.on('con', function() {
		socket.emit('conct', 'Welcome to Tapfest, ' + name + '!')
	})

	// When the user disconnects
	socket.on('disconnect', function() {
		socket.broadcast.emit('userLeft', name+ ' left')
		console.log(name+ ' left')
		count--
		io.sockets.emit('userCount', count)
	})

	// When client sends tap
	socket.on('tap', function(msg) {

		// Add to score
		taps++

		// Package to be sent
		var pkg = {
			txt: '' + name + '  -  ' + taps + ' taps',
			taps: taps,
			col: msg.color
		}

		// Send to user's client
		socket.emit('mytap', pkg)

		// Broadcast tap
		socket.broadcast.emit('tap', msg)
	})
})

// Start server
http.listen(process.env.PORT || 3000, function(){
	console.log('Server online')
})

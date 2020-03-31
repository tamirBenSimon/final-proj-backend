module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        console.log('connection to socket has been made')
        socket.on('chat newMsg', msg => {
            console.log(msg)
                io.emit('chat addMsg', msg) // emit to everyone
                // emits only to sockets in the same room
            io.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('chat topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
    })
}
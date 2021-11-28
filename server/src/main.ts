/* eslint-disable no-bitwise */
import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
// import { ExpressPeerServer } from 'peer'

const rooms: string[] = []
const userIds = new Set<string>()
const app = express()
const server = http.createServer(app)
// const peerServer = ExpressPeerServer(server, {
//   // path: '/myapp',
// })
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

// app.use('/peerjs', peerServer)

app.use(
  cors({
    credentials: true,
    origin: true,
  })
)
app.get('/', (req, res) => {
  res.json({})
})

app.get('/api/rooms', (req, res) => {
  res.json(rooms)
})

app.post('/api/rooms', (req, res) => {
  const roomId = uuidv4()
  rooms.push(roomId)

  res.json({
    roomId,
  })
})

app.get('/api/users', (_, res) => {
  res.json([...userIds])
})

io.on('connection', (socket) => {
  console.log(`왔음..${socket.id}`)
})

const mapNamespace = io.of('/maps')
mapNamespace.on('connection', (socket) => {
  userIds.add(socket.id)
  console.log(`a user connected, ${ socket.id }`)

  // 소켓 ID 전송
  socket.emit('getSocketId', socket.id)

  // 끊어짐
  socket.on('disconnect', () => {
    console.log('user disconnected')
    userIds.delete(socket.id)
  })

  // 방 접근
  socket.on('joinRoom', (roomId: string) => {
    if (rooms.includes(roomId)) {
      socket.join(roomId)
      socket.emit('joinRoom', `join room ${roomId} success`)
      mapNamespace.to(roomId).emit('roomMeesage', '환영 대환영~')
      return
    }

    socket.emit('joinRoom', `join room ${roomId} failed`)
  })

  // 채팅 메시지
  socket.on('cm', (message: string) => {
    console.log(`${socket.id}: ${message}`)
    io.emit('cm', message)
  })

  // 음성 스트리밍
  socket.on('audio', (stream) => {
    console.log(stream)
    socket.broadcast.emit('audio', stream)
  })
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})

/* eslint-disable no-bitwise */
import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

const rooms: string[] = []
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

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
  res.json({
    name: 'haha2',
  })
})

const mapNamespace = io.of('/maps')
mapNamespace.on('connection', (socket) => {
  console.log('a user connected')

  // 끊어짐
  socket.on('disconnect', () => {
    console.log('user disconnected')
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

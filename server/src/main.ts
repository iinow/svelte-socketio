/* eslint-disable no-bitwise */
import cors from 'cors'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

type User = {
  uid: string
  name: string
  socketId?: string
}

type OfferReq = {
  roomId: string
  uuid: string
  description: RTCSessionDescription
}

const rooms: string[] = ['1', '2']
const userIds = new Set<string>()
const roomMap = new Map<string, User[]>()
rooms.forEach((roomId) => roomMap.set(roomId, []))

const userIdAndSocketId = new Map<string, string>()
const socketIdAndUserId = new Map<string, string>()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

function findUserBySocketId(roomId: string, socketId: string) {
  const users = roomMap.get(roomId)
  if (!users) {
    return null
  }

  const match = users.filter((user) => user.socketId === socketId)
  if (match.length === 0) {
    return null
  }

  return match[0]
}

function findUserByUuid(roomId: string, uuid: string) {
  const users = roomMap.get(roomId)
  if (!users) {
    return null
  }

  const match = users.filter((user) => user.uid === uuid)
  if (match.length === 0) {
    return null
  }

  return match[0]
}

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
  console.log(`a user connected, ${socket.id}`)

  // 연결 성공
  socket.emit('connection', socket.id)

  // 소켓 ID 전송
  socket.emit('getSocketId', socket.id)

  // 끊어짐
  socket.on('disconnect', () => {
    console.log('user disconnected')
    // userIds.delete(socket.id)

    // 방 안의 사용자 삭제
    // const keys = [...roomMap.keys()]
    // keys.forEach((key) => {
    //   const room = roomMap.get(key)
    //   if (!room) {
    //     return
    //   }

    //   roomMap.set(
    //     key,
    //     room.filter((user) => user.socketId !== socket.id)
    //   )
    // })
  })

  // offer
  // socket.on('offer', (req: OfferReq) => {
  //   console.log(`listen offer, ${socket.id}, targetUid: ${req.uuid}`)
  //   const myUser = findUserBySocketId(req.roomId, socket.id)
  //   const targetUser = findUserByUuid(req.roomId, req.uuid)

  //   socket
  //     .to(targetUser?.socketId as string)
  //     .emit('offer', { ...req, uuid: myUser?.uid })
  // })

  // // 방안에 다른 사용자들에게 watch 요청
  // socket.on('watchRoom', (roomId: string) => {
  //   const users = roomMap.get(roomId)
  //   if (!users) {
  //     return
  //   }

  //   users.forEach((user) => {
  //     const { socketId } = user
  //     if (!socketId) {
  //       return
  //     }

  //     if (socket.id !== socketId) {
  //       return
  //     }

  //     socket.in(roomId).to(socketId).emit('watcher', user)
  //   })
  // })

  // // answer
  // socket.on('answer', (req: OfferReq) => {
  //   console.log(`listen answer, targetSocketId: ${JSON.stringify(req.uuid)}`)

  //   const users = roomMap.get(req.roomId)
  //   if (!users) {
  //     return
  //   }

  //   const targetUser = users.filter((user) => user.uid === req.uuid)[0]
  //   const { socketId } = targetUser
  //   if (!socketId) {
  //     return
  //   }

  //   const sendUser = findUserBySocketId(req.roomId, socket.id)

  //   socket.to(socketId).emit('answer', {
  //     ...req,
  //     uuid: sendUser?.uid,
  //   })
  // })

  // // candidate
  // socket.on(
  //   'candidate',
  //   (roomId: string, uuid: string, candidateObject: RTCIceCandidate) => {
  //     console.log(
  //       `call candidate, roomId: ${roomId}, uuid: ${uuid}, candidate: ${candidateObject}`
  //     )
  //     const users = roomMap.get(roomId)
  //     if (!users) {
  //       return
  //     }

  //     let matchUsers = users.filter((user) => user.uid === uuid)
  //     if (matchUsers.length !== 1) {
  //       return
  //     }

  //     const { socketId } = matchUsers[0]
  //     if (!socketId) {
  //       return
  //     }

  //     matchUsers = users.filter((user) => user.socketId === socket.id)
  //     const { uid } = matchUsers[0]
  //     if (!uid) {
  //       return
  //     }

  //     socket.in(roomId).to(socketId).emit('candidate', uid, candidateObject)
  //   }
  // )

  // // 방 접근
  // socket.on('joinRoom', (roomId: string, user: User) => {
  //   if (rooms.includes(roomId)) {
  //     const users = roomMap.get(roomId)
  //     socket.join(roomId)
  //     socket.emit('joinRoom', `join room ${roomId} success`)
  //     socket.in(roomId).emit('joinRoomUser', roomId, [user])
  //     socket.emit('joinRoomUser', roomId, users)
  //     users?.push({ ...user, socketId: socket.id })
  //     mapNamespace.to(roomId).emit('roomMeesage', '환영 대환영~')
  //     return
  //   }

  //   socket.emit('joinRoom', `join room ${roomId} failed`)
  // })

  // // 채팅 메시지
  // socket.on('cm', (message: string) => {
  //   console.log(`${socket.id}: ${message}`)
  //   io.emit('cm', message)
  // })

  socket.on('enter', (uid: string) => {
    console.log(`enter, uid: ${uid}`)
    userIdAndSocketId.set(uid, socket.id)
    socketIdAndUserId.set(socket.id, uid)
  })

  socket.on('call', (targetUid: string) => {
    console.log(`call, targetUid: ${targetUid}`)
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket.to(targetSocketId).emit('call', socketIdAndUserId.get(socket.id))
    }
  })

  socket.on('offer', (targetUid: string, offer: RTCSessionDescription) => {
    console.log(
      `offer, targetUid: ${targetUid}, socketIdAndUserId: ${socketIdAndUserId}`
    )
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket
        .to(targetSocketId)
        .emit('offer', socketIdAndUserId.get(socket.id), offer)
    }
  })

  socket.on('answer', (targetUid: string, answer: RTCSessionDescription) => {
    console.log(`answer, targetUid: ${targetUid}`)
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket
        .to(targetSocketId)
        .emit('answer', socketIdAndUserId.get(socket.id), answer)
    }
  })

  socket.on('r-candidate', (targetUid: string, candidate: RTCIceCandidate) => {
    console.log(`r-candidate, targetUid: ${targetUid}`)
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket
        .to(targetSocketId)
        .emit('r-candidate', socketIdAndUserId.get(socket.id), candidate)
    }
  })

  socket.on('s-candidate', (targetUid: string, candidate: RTCIceCandidate) => {
    console.log(`s-candidate, targetUid: ${targetUid}`)
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket
        .to(targetSocketId)
        .emit('s-candidate', socketIdAndUserId.get(socket.id), candidate)
    }
  })

  socket.on('candidate', (targetUid: string, candidate: RTCIceCandidate) => {
    console.log(`candidate, targetUid: ${targetUid}`)
    const targetSocketId = userIdAndSocketId.get(targetUid)
    if (targetSocketId) {
      socket
        .to(targetSocketId)
        .emit('candidate', socketIdAndUserId.get(socket.id), candidate)
    }
  })
})

server.listen(8080, () => {
  console.log('listening on *:8080')
})

// function generatedId(seed: number): string {
//   return `${seed}5`
// }

// eslint-disable-next-line no-unused-vars
// type ReturnType<F> = F extends (...args: any[]) => infer R ? R : any

// type Id = ReturnType<typeof generatedId>

// function lookupEntity(id: Id) {}

// lookupEntity(generatedId(1))

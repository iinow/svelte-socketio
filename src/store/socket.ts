import { readable, writable } from 'svelte/store'
import { io } from 'socket.io-client'
import env from '~/config/environment'

// const rtcConnection = new RTCPeerConnection({
//   iceServers: [
//     {
//       urls: 'stun:stun.l.google.com:19302',
//     },
//   ],
// })

export type User = {
  uid: string
  name: string
}

export type OfferReq = {
  roomId: string
  uuid: string
  description: RTCSessionDescription
}

function createSocketClient() {
  const client = io(`${env().socketUrl}`)
  const socketId = writable('')
  const { subscribe } = readable(client)

  const users = new Map<string, User[]>()
  const mapUsersInRoom = writable(users)

  return {
    subscribe,
    socketId: {
      subscribe: socketId.subscribe,
      set: socketId.set,
    },
    usersInRoom: {
      subscribe: mapUsersInRoom.subscribe,
      set: mapUsersInRoom.set,
      update: mapUsersInRoom.update,
    },
  }
}

export const client = createSocketClient()

client.subscribe((socket) => {
  socket.on('joinRoom', (res: string) => console.log(res))
  socket.on('roomMeesage', (res: string) => console.log(res))
  socket.on('getSocketId', (res: string) => client.socketId.set(res))
  socket.on('connection', (res: string) =>
    console.log(`connect success, ${res}`)
  )
  socket.on('test', (res: string) => console.log('test, ', res))
  socket.on('joinRoomUser', (roomId: string, users: User[]) => {
    client.usersInRoom.update((map) => {
      map.set(roomId, users)
      return map
    })
    console.log(users)
  })
})

export function joinRoom(roomId: string, user: User) {
  client.subscribe((socket) => {
    socket.emit('joinRoom', roomId, user)
    socket.emit('watchRoom', roomId)
  })
}

export function listenMessage() {
  navigator.mediaDevices.getUserMedia({
    audio: true,
  })
}

export function offer(
  roomId: string,
  uuid: string,
  description: RTCSessionDescription
) {
  client.subscribe((socket) => {
    const req: OfferReq = {
      roomId,
      uuid,
      description,
    }
    socket.emit('offer', req)
  })
}

export function candidate(
  roomId: string,
  uuid: string,
  candidateObject: RTCIceCandidate
) {
  client.subscribe((socket) => {
    socket.emit('candidate', roomId, uuid, candidateObject)
  })
}

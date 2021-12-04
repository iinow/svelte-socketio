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
    client.usersInRoom.subscribe((map) => {
      if (!map.has(roomId)) {
        map.set(roomId, [])
      }
      map.set(roomId, [...map.get(roomId), ...users])
      client.usersInRoom.set(map)
    })
  })
  // socket.on('getOffer', (sdp: RTCSessionDescription) => {
  //   console.log('get offer, ', sdp)
  // })

  // socket.on('getAnswer', (sdp: RTCSessionDescription) => {
  //   console.log('get answer, ', sdp)
  //   rtcConnection.setRemoteDescription(new RTCSessionDescription(sdp))
  // })

  // socket.on('getCandidate', (candidate: RTCIceCandidateInit) => {
  //   rtcConnection.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
  //     console.log('candidate add success')
  //   })
  // })
})

export function joinRoom(roomId: string, user: User) {
  client.subscribe((socket) => {
    socket.emit('joinRoom', roomId, user)
  })
}

export function listenMessage() {
  navigator.mediaDevices.getUserMedia({
    audio: true,
  })
}

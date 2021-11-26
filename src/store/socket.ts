import { readable, writable } from 'svelte/store'
import { io } from 'socket.io-client'
import env from '~/config/environment'

function createSocketClient() {
  const client = io(env().socketUrl)
  const socketId = writable('')
  const { subscribe } = readable(client)

  return {
    subscribe,
    socketId: {
      subscribe: socketId.subscribe,
      set: socketId.set
    }
  }
}

export const client = createSocketClient()

client.subscribe((socket) => {
  socket.on('joinRoom', (res: string) => console.log(res))
  socket.on('roomMeesage', (res: string) => console.log(res))
  socket.on('getSocketId', (res: string) => client.socketId.set(res))
})

export function joinRoom(roomId: string) {
  client.subscribe((socket) => {
    socket.emit('joinRoom', roomId)
  })
}

export function listenMessage() {
  navigator.mediaDevices.getUserMedia({
    audio: true,
  })
}

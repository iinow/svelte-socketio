import { readable } from 'svelte/store'
import { io } from 'socket.io-client'
import env from '~/config/environment'

function createSocketClient() {
  const client = io(env().socketUrl)
  const { subscribe } = readable(client)

  return {
    subscribe,
  }
}

export const client = createSocketClient()

client.subscribe((socket) => {
  socket.on('joinRoom', (res: string) => console.log(res))
  socket.on('roomMeesage', (res: string) => console.log(res))
})

export function joinRoom(roomId: string) {
  client.subscribe((socket) => {
    socket.emit('joinRoom', roomId)
  })
}

export function listenMessage() {
  client.subscribe(() => {})
}

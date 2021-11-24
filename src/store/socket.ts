import { readable } from 'svelte/store'
import { io } from 'socket.io-client'
import env from '~/config/environment'

export const client = readable(io(env().socketUrl))

client.subscribe(() => {})

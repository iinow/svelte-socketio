import http from 'axios'
import { from } from 'rxjs'

export function getRoomIds() {
  return from(http.get('/api/rooms'))
}

export function postRoom() {
  return from(http.post('/api/rooms'))
}

export function getUserIds() {
  return from(http.get('/api/users'))
}
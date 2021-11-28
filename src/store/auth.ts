import { writable } from 'svelte/store'

const LOCAL_STORAGE_USER_NAME = 'ttt'

type User = {
  name: string
  profileImageUrl: string
}

function parseUser(): User {
  const str = localStorage.getItem(LOCAL_STORAGE_USER_NAME)
  if (str === 'null') {
    return null
  }
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_NAME))
}

export const user = writable(parseUser())

user.subscribe((newUser) => {
  if (newUser) {
    localStorage.setItem(LOCAL_STORAGE_USER_NAME, JSON.stringify(newUser))
  }
})
import http from 'axios'

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

http.get('https://yesno.wtf/api')

export default app

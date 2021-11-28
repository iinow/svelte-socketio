// @ts-ignore
import env from '~env/local.yml'

type Environment = {
  map: {
    url: string
  }
  i18n: {
    baseUrl: string
  }
  socket: {
    host: string
    peerPath: string
    protocol: 'http'|'https'
    namespace: string
    port: number
  },
  socketUrl: string
}

export default (): Environment => env

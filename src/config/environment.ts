// @ts-ignore
import env from '~env/local.yml'

type Environment = {
  map: {
    url: string
  }
}

export default (): Environment => env

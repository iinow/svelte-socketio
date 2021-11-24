// @ts-ignore
import env from '~env/local.yml'

type Environment = {
  map: {
    url: string
  }
  i18n: {
    baseUrl: string
  }
}

export default (): Environment => env

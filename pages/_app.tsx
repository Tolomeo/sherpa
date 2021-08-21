import '../src/shared/globals.scss'
import { AppProps } from '../src/shared'

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default CustomApp

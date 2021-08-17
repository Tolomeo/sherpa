import '../styles/globals.scss'
import type { AppProps } from 'next/app'

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default CustomApp

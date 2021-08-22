
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Body } from '../src/ui'

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
         <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap" rel="stylesheet" />
        </Head>
        <Body>
          <Main />
          <NextScript />
        </Body>
      </Html>
    )
  }
}

export default CustomDocument
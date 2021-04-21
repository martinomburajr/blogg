import '../styles.css'
import 'nextra-theme-docs/style.css'

import Prism from 'prism-react-renderer/prism'
(typeof global !== "undefined" ? global : window).Prism = Prism

require("prismjs/components/prism-rust")
require("prismjs/components/prism-nasm")
require("prismjs/components/prism-bash")

export default function Nextra({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

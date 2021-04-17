import 'nextra-theme-docs/style.css'
import Prism from 'prism-react-renderer/prism'

(typeof global !== "undefined" ? global : window).Prism = Prism
require("prismjs/components/prism-rust")
require("prismjs/components/prism-go")
require("prismjs/components/prism-c")
require("prismjs/components/prism-asm6502")
require("prismjs/components/prism-nasm")

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />
}

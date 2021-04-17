export default {
  repository: 'https://github.com/martinomburajr',
  titleSuffix: ' 🦆',
  logo: (
    <>
      <span className="mr-2 font-extrabold hidden md:inline">@martinomburajr 🦆</span>
      {/* <span className="text-gray-600 font-normal hidden md:inline">
        @martinomburajr 🦆
      </span> */}
    </>
  ),
  head: (
    <>
      <script type="text/javascript" src="gtag.js"></script>
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="description" content="A centralized blog for Martin Ombura Jr. Featuring info on Go, Rust, Distributed Systems etc." />
      <meta name="og:description" content="A centralized blog for Martin Ombura Jr. Featuring info on Go, Rust, Distributed Systems etc." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://nextra.vercel.app/og.png" />
      <meta name="twitter:site:domain" content="https://twitter.com/martinomburajr" />
      <meta name="twitter:url" content="https://twitter.com/martinomburajr" />
      <meta name="og:title" content="Martin Ombura Jr. Blog" />
      <meta name="og:image" content="https://nextra.vercel.app/og.png" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
      <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
    </>
  ),
  search: true,
  prevLinks: true,
  nextLinks: true,
  footer: true,
  footerEditOnGitHubLink: false,
  footerText: <> {new Date().getFullYear()} © @martinomburajr.</>
}

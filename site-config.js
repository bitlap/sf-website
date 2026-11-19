/** Public website settings. No credentials belong in this file. */
export const siteConfig = Object.freeze({
  origin: 'https://dreamylost.com',
  repository: 'https://github.com/bitlap/sf-website',
  supportEmail: 'dreamylost@outlook.com',
  feedbackUrl: 'https://github.com/bitlap/sf-app/issues',
  privacyUrl: 'https://dreamylost.com/privacy/',
  // Set official, public URLs when these channels become available.
  // ios: App Store or public TestFlight invitation; android: official APK URL.
  platforms: {
    ios: { url: null },
    android: { url: null },
    mini: { url: null, qrImage: null }
  }
});

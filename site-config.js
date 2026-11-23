/** Public website settings. No credentials belong in this file. */
export const siteConfig = Object.freeze({
  origin: 'https://dreamylost.com',
  supportEmail: 'dreamylost@outlook.com',
  privacyUrl: 'https://dreamylost.com/privacy/',
  // Set official, public URLs when these channels become available.
  // ios: App Store or public TestFlight invitation; android: official APK URL.
  platforms: {
    ios: { url: null },
    android: { url: null },
    mini: { url: null, qrImage: null }
  }
});

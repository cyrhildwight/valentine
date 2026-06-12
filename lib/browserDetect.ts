/**
 * Detects if the page is running inside an in-app browser or WebView
 * (e.g., Facebook, Instagram, Messenger, Twitter/X, Snapchat, TikTok, WeChat).
 */
export const isInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  if (!ua) return false;

  // 1. Check for specific known in-app browser user agent signatures
  const inAppRegex = /(FBAN|FBAV|Instagram|Messenger|Twitter|TwitterAndroid|TwitterForiPhone|TikTok|musical_ly|MicroMessenger|Snapchat|WhatsApp|Line\/|Pinterest|LinkedInApp)/i;
  if (inAppRegex.test(ua)) {
    return true;
  }

  // 2. Generic iOS WebView check: iOS device, has AppleWebKit, but DOES NOT have Safari/CriOS/FxiOS
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isSafari = /Safari/i.test(ua);
  const isChromeIOS = /CriOS/i.test(ua);
  const isFirefoxIOS = /FxiOS/i.test(ua);
  if (isIOS && !isSafari && !isChromeIOS && !isFirefoxIOS) {
    return true;
  }

  // 3. Generic Android WebView check: Android device, version code specified, and contains 'wv' or lacks standalone Chrome
  const isAndroid = /Android/i.test(ua);
  if (isAndroid) {
    const isWebView = /Version\/[0-9.]+/i.test(ua);
    if (isWebView) {
      return true;
    }
  }

  return false;
};

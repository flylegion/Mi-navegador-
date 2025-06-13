import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const webViewRef = useRef(null);

  const injectedJavaScript = `
    (function() {
      const meta = document.querySelector('meta[name=viewport]');
      if (meta) {
        meta.setAttribute('content', 'width=1024');
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = "viewport";
        newMeta.content = "width=1024";
        document.head.appendChild(newMeta);
      }

      // Forzar que todos los enlaces se abran dentro del WebView
      window.open = function(url) {
        window.location.href = url;
      };
    })();
    true;
  `;

  const isAllowedUrl = (url) => {
    try {
      const allowedDomains = [
        'snack.expo.dev',
        'expo.dev',
        'auth.expo.dev',
        'accounts.google.com',
        'githubusercontent.com',
      ];
      const hostname = new URL(url).hostname;
      return allowedDomains.some(domain => hostname.endsWith(domain));
    } catch {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.topMargin} />

      <WebView
        ref={webViewRef}
        source={{ uri: 'https://snack.expo.dev' }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        allowFileAccess={false}
        allowUniversalAccessFromFileURLs={false}
        mixedContentMode="never"
        setSupportMultipleWindows={false}
        injectedJavaScript={injectedJavaScript}
        userAgent="Mozilla/5.0 (Linux; Android 10; ExpoApp) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36"
        scalesPageToFit={true}
        onShouldStartLoadWithRequest={(request) => isAllowedUrl(request.url)}
        style={styles.webview}
      />

      <View style={styles.bottomMargin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topMargin: {
    height: 36,
    backgroundColor: 'black',
  },
  bottomMargin: {
    height: 48,
    backgroundColor: 'black',
  },
  webview: {
    flex: 1,
  },
});
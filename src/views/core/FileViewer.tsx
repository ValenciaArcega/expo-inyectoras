import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

const MyWebView = () => {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    // Aquí puedes manejar cambios de navegación si lo necesitas
    console.log('Navegando a:', navState.url);
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'http://baacc.dyndns.org:90/L232/VisorArchivos.aspx' }}
      style={styles.webview}
      // Opciones para mantener navegación interna
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      // IMPORTANTE: Estas props mantienen la navegación dentro del WebView
      setSupportMultipleWindows={false}
      allowsBackForwardNavigationGestures={true}
      // Intercepta intentos de abrir nuevas ventanas
      onShouldStartLoadWithRequest={(request) => {
        // Retorna true para permitir que cargue en el mismo WebView
        return true;
      }}
      // Maneja cambios de navegación
      onNavigationStateChange={handleNavigationStateChange}
      // Eventos útiles
      onLoadStart={() => console.log('Cargando...')}
      onLoadEnd={() => console.log('Carga completa')}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('Error en WebView:', nativeEvent);
      }}
      // Permite redirecciones y navegación
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('Error HTTP:', nativeEvent.statusCode);
      }}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default MyWebView;
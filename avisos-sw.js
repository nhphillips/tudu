// Os avisos do TUDU, dentro do service worker (é ele que acorda quando o app está fechado).
// Entra no sw.js gerado pelo vite-plugin-pwa via importScripts.

self.addEventListener('push', (evento) => {
  let aviso = {}
  try { aviso = evento.data ? evento.data.json() : {} } catch { aviso = { corpo: evento.data?.text() } }
  evento.waitUntil(
    self.registration.showNotification(aviso.titulo || 'TUDU', {
      body: aviso.corpo || '',
      // A mesma etiqueta substitui o aviso anterior em vez de empilhar.
      tag: aviso.tag,
      icon: 'icons/icone-192.png',
      data: { url: self.registration.scope },
    }),
  )
})

// Tocar no aviso abre o TUDU (ou traz para frente, se já estiver aberto).
self.addEventListener('notificationclick', (evento) => {
  evento.notification.close()
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((janelas) => {
      for (const janela of janelas) if ('focus' in janela) return janela.focus()
      return self.clients.openWindow(evento.notification.data?.url || self.registration.scope)
    }),
  )
})

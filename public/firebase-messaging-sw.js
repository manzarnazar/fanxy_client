/* global self, importScripts, firebase */
// Firebase Cloud Messaging service worker — receives chat pushes while the
// site is in the background. The Firebase web config is passed as query
// params by the registering client (src/services/push-token.service.ts)
// because service workers can't read Next.js env vars.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const params = new URLSearchParams(self.location.search);
firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();

// FCM auto-displays the `notification` block; this handler covers data-only
// payloads and click routing.
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "New message";
  const body = (payload.notification && payload.notification.body) || "";
  self.registration.showNotification(title, {
    body,
    data: payload.data || {},
    icon: "/favicon.ico",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.type === "chat" ? "/messages" : "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

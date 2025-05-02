/* eslint-disable no-undef */

// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAtC1Y0ZaEy05qjOY65sC1a1CbdmC6scaU",
  authDomain: "p-flow-af293.firebaseapp.com",
  projectId: "p-flow-af293",
  storageBucket: "p-flow-af293.firebasestorage.app",
  messagingSenderId: "345700076765",
  appId: "1:345700076765:web:0839bccada33e5d9de5f34",
  measurementId: "G-D38GPRCV53",
});

// ✅ DEFINE messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/logo192.png",
    data: payload.data,
    tag: payload.collapseKey,
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

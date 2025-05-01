import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtC1Y0ZaEy05qjOY65sC1a1CbdmC6scaU",
  authDomain: "p-flow-af293.firebaseapp.com",
  projectId: "p-flow-af293",
  storageBucket: "p-flow-af293.firebasestorage.app",
  messagingSenderId: "345700076765",
  appId: "1:345700076765:web:0839bccada33e5d9de5f34",
  measurementId: "G-D38GPRCV53",
};

// VAPID key for Web Push
const vapidKey =
  "BLj4cX2Te1XHmNFYEse7LAoDcTP0lpriqZd0leekGZFKeI1m-qJzfVaBZhE0-qndR3myw7rDxiI7t2-US7T7n5A";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/**
 * Requests permission and returns FCM token
 */
export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      return token;
    } else {
      console.warn("Notification permission not granted.");
      return null;
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};

/**
 * For local testing only — prints token to console
 */
export const sendTestNotification = async () => {
  const token = await requestFCMToken();
  if (token) {
    console.log("Send this token to your server:", token);
  }
};

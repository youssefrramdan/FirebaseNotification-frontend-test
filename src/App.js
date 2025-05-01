import { useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { getApp } from "firebase/app";
import { requestFCMToken } from "./utils/firebaseUtils";
import "./App.css";

function App() {
  const [fcmToken, setFcmToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        const token = await requestFCMToken();
        if (token) {
          setFcmToken(token);
          setPermissionStatus("granted");

          const messaging = getMessaging(getApp());

          // Listen for foreground messages
          onMessage(messaging, (payload) => {
            console.log("Received message:", payload);
            setNotification(payload);

            setToast({
              title: payload.notification?.title || "New Message",
              body: payload.notification?.body || "You have a new message.",
            });

            setTimeout(() => setToast(null), 5000);
          });
        } else {
          console.log("Notifications are not enabled.");
          setPermissionStatus("denied");
        }
      } catch (err) {
        console.error("Error getting FCM token:", err);
        setPermissionStatus("error");
      }
    };

    fetchFCMToken();
  }, []);

  const closeToast = () => setToast(null);

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className="toast-notification"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#fff",
            borderLeft: "4px solid #28a745",
            boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
            padding: "15px",
            borderRadius: "4px",
            zIndex: 1050,
            maxWidth: "350px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{toast.title}</strong>
            <button
              onClick={closeToast}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <div style={{ marginTop: "5px" }}>{toast.body}</div>
        </div>
      )}

      <div className="container firebase-form p-4">
        <div className="row">
          {permissionStatus === "denied" && (
            <div className="col-md-12 mb-4">
              <div className="alert alert-warning">
                <strong>Notification Permission Denied</strong>
                <p>
                  Please enable notifications in your browser settings to
                  receive push messages.
                </p>
              </div>
            </div>
          )}

          {fcmToken && (
            <div className="col-md-12 mb-4">
              <div className="alert alert-info">
                <strong>FCM Token:</strong>
                <div style={{ wordBreak: "break-all" }}>{fcmToken}</div>
              </div>
            </div>
          )}

          {notification && (
            <div className="col-md-12">
              <div className="alert alert-success">
                <h4>Received Message:</h4>
                <pre
                  style={{
                    background: "#f8f9fa",
                    padding: "15px",
                    borderRadius: "5px",
                  }}
                >
                  {JSON.stringify(
                    {
                      title: notification.notification?.title,
                      body: notification.notification?.body,
                      data: notification.data,
                      from: notification.from,
                      collapseKey: notification.collapseKey,
                      messageId: notification.messageId,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;

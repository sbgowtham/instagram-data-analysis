importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBx38iChXhdyQCAS0adr43oDNf4wCYUcV4",
    authDomain: "notification-ac600.firebaseapp.com",
    projectId: "notification-ac600",
    storageBucket: "notification-ac600.appspot.com",
    messagingSenderId: "825657371831",
    appId: "1:825657371831:web:5c1b077b52e3654075f132",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Background Notification';
    const notificationBody = payload.notification?.body || 'Background Body';

    // Display the notification
    self.registration.showNotification(notificationTitle, {
        body: notificationBody,
        icon: payload.notification?.icon || '/default-icon.png',
    });

    // Send notification data to backend for MySQL storage
    fetch('http://localhost:5000/store-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: notificationTitle,
            body: notificationBody,
            type: 'background', // Indicate background notification
            source: 'Instagram', // Example source
        }),
    })
        .then((response) => response.json())
        .then((data) => console.log('Notification stored in MySQL:', data))
        .catch((error) => console.error('Error storing notification in MySQL:', error));
});

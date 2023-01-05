// import * as firebase from "firebase/app";
// import "firebase/messaging";

// import { useNotification } from "./gqlEndpoints/mutations";

export default async () => {
  // const { updateNotificationMe } = useNotification();
  // try {
  //   firebase.initializeApp({
  //     apiKey: "AIzaSyCX8EGPTV-9aTQh3zumHprX1y8OfuDSZ5A",
  //     authDomain: "people-commerce.firebaseapp.com",
  //     databaseURL: "https://people-commerce.firebaseio.com",
  //     projectId: "people-commerce",
  //     storageBucket: "people-commerce.appspot.com",
  //     messagingSenderId: "945887285037",
  //     appId: "1:945887285037:web:60ba44c50f6d587aa6cda4",
  //     measurementId: "G-YZHZTXHEQQ"
  //   });

  //   const messaging = firebase.messaging();

  //   Notification.requestPermission().then(permission => {
  //     if (permission === "granted") {
  //       console.log("Notification permission granted.");
  //       messaging.getToken().then(response => {
  //         console.log(response);
  //         updateNotificationMe(response).then(() => {
  //           console.log("token Saved");
  //         });
  //       });
  //       // TODO(developer): Retrieve an Instance ID token for use with FCM.
  //       // ...
  //     } else {
  //       console.log("Unable to get permission to notify.");
  //       updateNotificationMe("").then(() => {
  //         console.log("token cleared");
  //       });
  //     }
  //   });
  // } catch (error) {
  //   if (!/already exists/.test(error.message)) {
  //     console.error('Firebase initialization error raised', error.stack)
  //   }
  // }
};

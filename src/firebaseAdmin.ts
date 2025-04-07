// firebaseAdmin.ts
import admin from "firebase-admin";
import * as serviceAccount from "../travel-app-f21a8-firebase-adminsdk-fbsvc-bba8379177.json"; // Adjust path as needed

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export { admin };

// backend/src/firebase/firebase.admin.ts
import * as admin from 'firebase-admin';
import * as serviceAccountRaw from '../config/serviceAccountKey.json';

// Convert the imported object to a plain object
const serviceAccount = JSON.parse(JSON.stringify(serviceAccountRaw));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL:
      'https://mushroom-fb75c-default-rtdb.asia-southeast1.firebasedatabase.app', // Your database URL
  });
}

export { admin };

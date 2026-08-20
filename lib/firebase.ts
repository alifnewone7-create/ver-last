import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAFm1BmjxTKS6CzETCnEEMVlqKLn3hhrz8',
  authDomain: 'vertex-ai-d21c3.firebaseapp.com',
  databaseURL:
    'https://vertex-ai-d21c3-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'vertex-ai-d21c3',
  storageBucket: 'vertex-ai-d21c3.firebasestorage.app',
  messagingSenderId: '774744489548',
  appId: '1:774744489548:web:37ffc39075bbf85c14fee9',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)
export default app

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Thay thế bằng Firebase config của bạn
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC4vfKg2RXP7Uy03SBklWDtdjTUYLXR-QI",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tool-nohu.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tool-nohu",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tool-nohu.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "978430053724",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:978430053724:web:297094e0e8db42c5830599"
};

// Kiểm tra xem có config thật không
const hasRealConfig = process.env.REACT_APP_FIREBASE_API_KEY && 
                     process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (!hasRealConfig) {
  console.warn('⚠️ Firebase config chưa được thiết lập. Tạo file .env với Firebase config của bạn.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

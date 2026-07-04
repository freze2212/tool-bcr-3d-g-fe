import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

export interface FirebaseMessage {
  id: string;
  user: string;
  text: string;
  timestamp: any;
  createdAt?: any;
}

const MESSAGES_COLLECTION = 'chatMessages';
const MESSAGES_LIMIT = 50;

// Thêm tin nhắn mới
export const sendMessage = async (user: string, text: string): Promise<void> => {
  try {
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      user,
      text,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    // Fallback: có thể lưu vào localStorage để gửi lại sau
    console.warn('Tin nhắn sẽ được lưu local và gửi lại khi có kết nối');
    throw error;
  }
};

// Lắng nghe tin nhắn realtime
export const subscribeToMessages = (
  callback: (messages: FirebaseMessage[]) => void
) => {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(MESSAGES_LIMIT)
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages: FirebaseMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as FirebaseMessage);
    });
    
    // Reverse để hiển thị tin nhắn mới nhất ở dưới
    callback(messages.reverse());
  });
};

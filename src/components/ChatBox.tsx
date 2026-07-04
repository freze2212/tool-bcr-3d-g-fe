import React, { useEffect, useState, useRef } from 'react';
import './ChatBox.css';
import { sendMessage, subscribeToMessages, FirebaseMessage } from '../firebase/chatService';

type Message = {
  id: string;
  user: string;
  text: string;
  ts: number;
  clientId?: string | null;
};

const ChatBox: React.FC<{ user?: string }> = ({ user = 'guest' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const userInteracting = useRef(false);

  const scrollToBottom = () => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  };

  useEffect(() => {
    // Subscribe to Firebase messages
    const unsubscribe = subscribeToMessages((firebaseMessages: FirebaseMessage[]) => {
      const convertedMessages: Message[] = firebaseMessages.map((msg) => ({
        id: msg.id,
        user: msg.user,
        text: msg.text,
        ts: msg.timestamp?.toMillis() || Date.now(),
        clientId: null
      }));
      
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      const filteredMessages = convertedMessages.filter(msg => msg.ts > oneDayAgo);
      
      setMessages(filteredMessages);
      setTimeout(scrollToBottom, 50); // Auto scroll to new messages
    });

    return () => {
      unsubscribe();
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setMessages(prevMessages => {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        return prevMessages.filter(msg => msg.ts > oneDayAgo);
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const send = async () => {
    const text = value.trim();
    if (!text) return;
    
    try {
      await sendMessage(user, text);
      setValue('');
      setTimeout(scrollToBottom, 10); // Auto scroll after sending message
    } catch (error) {
      console.error('Error sending message:', error);
      // Có thể hiển thị thông báo lỗi cho user
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') send();
  };

  // pause autoplay while user interacts
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onMouseEnter = () => { userInteracting.current = true; };
    const onMouseLeave = () => { userInteracting.current = false; };
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="chatbox-root">
      <div className="chatbox-list" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`chat-msg ${m.user === user ? 'me' : 'other'}`}>
            <div className="chat-user">{m.user}</div>
            <div className="chat-content">
              <div className="chat-text">{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chatbox-input" role="group" aria-label="Chat input">
        <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey} placeholder="Nhập tin nhắn..." />
        <button className="chat-send" onClick={send}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatBox;

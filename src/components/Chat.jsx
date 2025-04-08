import { useState, useEffect, useRef } from 'react';
import socket from '../utils/socket';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on('chat-message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('chat-message');
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const username = localStorage.getItem('username') || 'Аноним';
            socket.emit('chat-message', {
                username,
                message: message.trim(),
                timestamp: new Date().toLocaleTimeString()
            });
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <span className="message-username">{msg.username}: </span>
                        <span className="message-text">{msg.message}</span>
                        <span className="message-time">{msg.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Отправить</button>
            </form>
        </div>
    );
};

export default Chat;

import React from "react";
import { useState } from "react";

const ContactsModal = ({ onClose }) => {

  const [copied, setCopied] = useState(false);
  
  const handleCopy = (text) => {
      // Копируем текст в буфер обмена
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        // Через 2 секунды сбрасываем состояние "копирования"
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Ошибка при копировании:', err);
      });
    };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h3>В случае возникновения вопросов вы всегда можете обратиться к нашим преподавателям</h3>
        <div className="contacts-list">
          {/* Здесь можно вручную вставить контакты преподавателей */}
          <ul>
            <li>Иванов Алексей Петрович: <span onClick={() => handleCopy("ivanov.alexey@university.com")} 
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>ivanov.alexey@university.com</span> <br /> <span onClick={() => handleCopy("+7 900 123 45 67")}
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>+7 900 123 45 67</span> </li>
            <li>Петрова Мария Александровна: <span onClick={() => handleCopy("petrova.maria@university.com")}
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>petrova.maria@university.com</span> <br /> <span onClick={() => handleCopy("+7 900 234 56 78")}
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>+7 900 234 56 78</span></li>
            <li>Смирнов Дмитрий Викторович: <span onClick={() => handleCopy("mirnov.dmitriy@university.ru")}
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>mirnov.dmitriy@university.ru</span> <br /> <span onClick={() => handleCopy("+7 900 345 67 89")}
            style={{ cursor: "pointer", color: "lightBlue", textDecoration: "underline" }}>+7 900 345 67 89</span></li>
            {/* Добавь другие контакты по мере необходимости */}
          </ul>
        </div>
        {copied && <div className="copy-alert">Ссылка скопирована!</div>}
      </div>
    </div>
  );
};

export default ContactsModal;

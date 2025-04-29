import React from "react";

const LinkList = ({ isOpen, onClose }) => {
    if (!isOpen) return null
}

return (
    <div className="modal-overlay">
        <div className="modal-content">
            <button className="modal-close-btn" onClick={onClose}>×</button>
            <h2>Список ссылок</h2>
                <ul>
                    <li><a href="https://example1.com" target="_blank" rel="noopener noreferrer">Ссылка 1</a></li>
                    <li><a href="https://example2.com" target="_blank" rel="noopener noreferrer">Ссылка 2</a></li>
                    <li><a href="https://example3.com" target="_blank" rel="noopener noreferrer">Ссылка 3</a></li>
                </ul>
        </div>
    </div>
)
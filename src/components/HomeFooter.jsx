import { useEffect, useRef, useState } from "react";

const HomeFooter = () => {

    return (
        <div>
<footer className="footer">
      <div className="footer-content">
        {/* Колонка 1: Лого и описание */}
        <div className="footer-column">
          <h4 className="footer-title">Education platform
          by Step Academy</h4>
          <p className="footer-description">
            Пару слов для атмосферы.
          </p>
        </div>

        {/* Колонка 2: Ссылки */}
        <div className="footer-column">
          <h4 className="footer-subtitle">Меню</h4>
          <ul className="footer-links">
            <li><a href="/" className="footer-link">Главная</a></li>
            <li><a href="/" className="footer-link">Контакты</a></li>
            <li><a href="/" className="footer-link">Поддержка</a></li>
          </ul>
        </div>

        {/* Колонка 3: Соцсети */}
        <div className="footer-column">
          <h4 className="footer-subtitle">Наши соцсети</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/" target="_blank" className="social-icon"><img src="/instagram.png" alt="instagram" /></a>
            <a href="https://t.me/watchtogether" target="_blank" className="social-icon"><img src="/telegram.png" alt="telegram" /></a>
            <a href="https://www.youtube.com/" target="_blank" className="social-icon"><img src="/youtube.png" alt="youtube" /></a>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>© 2025 EPSA. Все права защищены.</p>
      </div>
    </footer>
        </div>
    )
}

export default HomeFooter


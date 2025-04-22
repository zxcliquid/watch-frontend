import React from "react";
import QRCode from "qrcode.react"
import { useState } from "react";

const QRCodeComponent = () => {
    const currentUrl = window.location.href
    const [isVisible, setIsVisible] = useState(false); // Состояние для управления видимостью
      
    const toggleVisibility = () => {
        setIsVisible(!isVisible); // Переключаем видимость
        console.log("переключено");
        
    };

    return(
        <div>
            <button onClick={toggleVisibility}> {isVisible ? 'Скрыть QR-код' : 'Показать QR-код'}</button>
            {isVisible && (
                <div>
                    <h1>Сканируй</h1>
                    <QRCode value={currentUrl} size={256}/>
                </div>
            )}
        </div>
    )
}
export default QRCodeComponent
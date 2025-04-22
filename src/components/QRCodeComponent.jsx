import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeComponent = () => {
    const currentUrl = window.location.href;
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        console.log("переключено");
    };

    return (
        <div>
            <button onClick={toggleVisibility}>
                {isVisible ? 'Скрыть QR-код' : 'Показать QR-код'}
            </button>
            {isVisible && (
                <div>
                    <h1>Сканируй</h1>
                    <QRCodeCanvas value={currentUrl} size={256} />
                </div>
            )}
        </div>
    );
};

export default QRCodeComponent;
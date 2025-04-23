import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeComponent = ({ url, roomId }) => (
    <div className="qr-block">
      <QRCodeSVG className="qr-code" value={url} size={200} />
      <h4>Id комнаты:</h4>
      <div className="qr-link">{roomId}</div>
    </div>
  );

export default QRCodeComponent;
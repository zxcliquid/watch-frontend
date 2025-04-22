import React from "react";
import { QRCodeSVG } from "qrcode.react";

const QRCodeComponent = ({ url }) => (
    <div className="qr-block">
      <QRCodeSVG className="qr-code" value={url} size={180} />
      <div className="qr-link">{url}</div>
    </div>
  );

export default QRCodeComponent;
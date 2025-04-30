import React, { useEffect, useState } from "react";

const YOUTUBE_API_URL = "https://youtube-v31.p.rapidapi.com/search?part=snippet&maxResults=30&q=мистер%20бист&type=video&videoDuration=long";
const RAPIDAPI_KEY = "d1c8051937msh81bca29bb175082p1deabajsnaf707f4e5f19"; 

const LinkList = ({ isOpen, onClose }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        setError("");
        fetch(YOUTUBE_API_URL, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com"
            }
        })
        .then(res => res.json())
        .then(data => {
            // Фильтруем только видео
            const filtered = (data.items || []).filter(
                v => v.id && v.id.videoId
            );
            setVideos(filtered);
            setLoading(false);
        })
        .catch(e => {
            setError("Ошибка загрузки видео");
            setLoading(false);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = (videoId) => {
        navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${videoId}`);
        setCopiedId(videoId);
        setTimeout(() => setCopiedId(null), 1000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h2>Топ видео YouTube</h2>
                {loading && <p>Загрузка...</p>}
                {error && <p className="error">{error}</p>}
                <ul className="modal-video-list">
                    {videos.map((video) => (
                        <li key={video.id.videoId} className="modal-video-item">
                            <a
                                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-video-link"
                            >
                                <img
                                    src={video.snippet.thumbnails.default.url}
                                    alt={video.snippet.title}
                                    className="modal-video-thumb"
                                />
                                <span className="modal-video-title">{video.snippet.title}</span>
                            </a>
                            <button
                                className="modal-copy-btn"
                                onClick={() => handleCopy(video.id.videoId)}
                            >
                                {copiedId === video.id.videoId ? "Скопировано!" : "Копировать"}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LinkList;
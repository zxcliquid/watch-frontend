import React, { useEffect, useState } from "react";
import socket from "../utils/socket";

const YOUTUBE_API_URL = "https://youtube-v31.p.rapidapi.com/playlistItems?playlistId=PLVLOGRgeB0_BXgA-7OmRR6GNXh6M0qzmC&part=snippet&maxResults=30";
const RAPIDAPI_KEY = "b561a99173msh3d38c88dd8b9ffep142b41jsnb9c365527867"; 

const LinkList = ({ isOpen, onClose, roomId, onLaunchVideo }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [launchedId, setLaunchedId] = useState(null);

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
            const filtered = (data.items || []).filter(v => {
                if (v.id && v.id.videoId) return true;
                if (v.snippet && v.snippet.resourceId && v.snippet.resourceId.videoId) return true;
                return false;
            });
            setVideos(filtered);
            setLoading(false);
        })
        .catch(e => {
            setError("Ошибка загрузки видео");
            setLoading(false);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLaunch = (videoId) => {
        socket.emit("sync-video", { roomId, action: "pause", time: 0, videoId });
        if (onLaunchVideo) onLaunchVideo(videoId); 
        setLaunchedId(videoId);
        setTimeout(() => setLaunchedId(null), 1000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h2>Топ видео YouTube</h2>
                {loading && <p>Загрузка...</p>}
                {error && <p className="error">{error}</p>}
                <ul className="modal-video-list">
                    {videos.map((video) => {
                        const videoId = video.id?.videoId || video.snippet?.resourceId?.videoId;
                        return (
                            <li key={videoId} className="modal-video-item">
                                <a
                                    href={`https://www.youtube.com/watch?v=${videoId}`}
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
                                    onClick={() => handleLaunch(videoId)}
                                >
                                    {launchedId === videoId ? "Запущено!" : "Запустить"}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default LinkList;
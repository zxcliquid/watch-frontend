import React from "react";

const LinkList = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    const fetchPopularVideos = async () => {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&key=AIzaSyCVmKha63Eqiq3Fuhq3SdTffLCZYMnYY3U`);
        const data = await response.json();
        return data.items; // возвращает массив популярных видео
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h2>Список ссылок</h2>
                    <ul>
                        {videos.map(video => (
                        <li key={video.id}>
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                            {video.snippet.title}
                            </a>
                                </li>
                            ))}
                    </ul>
            </div>
        </div>
    )
}

export default LinkList
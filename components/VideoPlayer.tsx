'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
    streamUrl?: string;
    title?: string;
    onError?: (error: string) => void;
    onEnded?: () => void;
    className?: string;
    autoPlay?: boolean;
}

export default function VideoPlayer({
    streamUrl,
    title = "Video Player",
    onError,
    onEnded,
    className = "",
    autoPlay = false
}: VideoPlayerProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
    }, [streamUrl]);

    const handleVideoError = () => {
        setIsLoading(false);
        const errorMsg = "Không thể phát video. Vui lòng thử lại sau.";
        setError(errorMsg);
        onError?.(errorMsg);
    };

    const handleVideoCanPlay = () => {
        setIsLoading(false);
        setError(null);
    };

    // No video source
    if (!streamUrl) {
        return (
            <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${className}`}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                            <p className="text-sm">Video chưa sẵn sàng</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative bg-black rounded-xl overflow-hidden ${className}`}>
            {/* Aspect ratio container */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                {/* Loading state */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-400 text-sm">Đang tải video...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                        <div className="text-center text-red-400">
                            <svg className="w-12 h-12 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={() => {
                                    setError(null);
                                    setIsLoading(true);
                                    videoRef.current?.load();
                                }}
                                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                )}

                {/* Native video player */}
                <video
                    ref={videoRef}
                    src={streamUrl}
                    title={title}
                    className="absolute inset-0 w-full h-full"
                    controls
                    autoPlay={autoPlay}
                    playsInline
                    onLoadStart={() => setIsLoading(true)}
                    onCanPlay={handleVideoCanPlay}
                    onError={handleVideoError}
                    onEnded={onEnded}
                />
            </div>
        </div>
    );
}

import React from 'react'

const C = {
    forestGreen: 'var(--color-forest-green)',   // #404e3b
    green: 'var(--color-green)',                // #7b9669
    greenLight: 'var(--color-green-light)',     // #bac8b1
    white: 'var(--color-white)',                // #ffffff
    deepText: 'var(--color-deep-text)',         // #404e3b
    mutedText: 'var(--color-muted-text)',       // #6c8480
}

function VideoCard({
    videoUrl = "",
    title = "",
    description = "",
    detailLink = "#",
    isYoutube = false
}) {
    const hasContent = title || description || detailLink !== "#"

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col w-full"
            style={{
                backgroundColor: C.white,
                border: `1px solid ${C.greenLight}`,
            }}
        >
            {/* Video */}
            <div className="w-full aspect-video bg-black">
                {isYoutube ? (
                    <iframe
                        className="w-full h-full"
                        src={videoUrl}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Content */}
            {hasContent && (
                <div className="flex flex-col p-5 gap-3">
                    <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                        style={{
                            color: C.forestGreen,
                            backgroundColor: 'rgba(186,200,177,0.2)',
                            border: `1px solid ${C.greenLight}`,
                            fontSize: 'var(--font-size-xs)',
                        }}
                    >
                        โครงการ
                    </span>

                    {title && (
                        <h2
                            className="font-semibold leading-relaxed line-clamp-3"
                            style={{
                                color: C.deepText,
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-semibold)',
                            }}
                        >
                            {title}
                        </h2>
                    )}

                    {description && (
                        <div className="flex items-start gap-1.5 leading-relaxed">
                            <span
                                className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full"
                                style={{ backgroundColor: C.green }}
                            />
                            <p
                                className="line-clamp-2"
                                style={{
                                    color: C.mutedText,
                                    fontSize: 'var(--font-size-xs)',
                                }}
                            >
                                {description}
                            </p>
                        </div>
                    )}

                    <div className="mt-2 flex gap-2">
                        {detailLink !== "" && (

                            <a href={detailLink}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors duration-200"
                                style={{
                                    backgroundColor: C.forestGreen,
                                    color: '#ffffff',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-medium)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = C.green}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = C.forestGreen}
                            >
                                รายละเอียดเพิ่มเติม
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        )}

                        {!isYoutube && (

                            <a href={videoUrl}
                                download
                                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-colors duration-200"
                                style={{
                                    color: C.mutedText,
                                    backgroundColor: 'rgba(186,200,177,0.2)',
                                    fontSize: 'var(--font-size-sm)',
                                }}
                                title="ดาวโหลดวิดีโอ"
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(186,200,177,0.4)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(186,200,177,0.2)'}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoCard
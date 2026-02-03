'use client';

import { useState } from 'react';

interface Lecture {
    id: number;
    title: string;
    position: number;
    filename: string;
    relative_path: string;
    size: number;
}

interface Section {
    id: number;
    title: string;
    position: number;
    lectures: Lecture[];
}

interface CurriculumSidebarProps {
    sections: Section[];
    currentLectureId: number | null;
    onLectureSelect: (lecture: Lecture) => void;
    className?: string;
}

export default function CurriculumSidebar({
    sections,
    currentLectureId,
    onLectureSelect,
    className = ""
}: CurriculumSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<Set<number>>(
        new Set(sections.map(s => s.id))
    );

    const toggleSection = (sectionId: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const totalLectures = sections.reduce((sum, s) => sum + s.lectures.length, 0);

    return (
        <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Nội dung khóa học</h3>
                <p className="text-sm text-gray-400 mt-1">
                    {sections.length} phần • {totalLectures} bài giảng
                </p>
            </div>

            {/* Sections list */}
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.id} className="border-b border-gray-800">
                        {/* Section header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform ${expandedSections.has(section.id) ? 'rotate-90' : ''}`}>
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-white line-clamp-2">
                                        {section.position}. {section.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {section.lectures.length} bài giảng
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Lectures */}
                        {expandedSections.has(section.id) && (
                            <div className="bg-gray-950">
                                {section.lectures.map((lecture) => {
                                    const isActive = lecture.id === currentLectureId;
                                    return (
                                        <button
                                            key={lecture.id}
                                            onClick={() => onLectureSelect(lecture)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive
                                                    ? 'bg-blue-600/20 border-l-2 border-blue-500'
                                                    : 'hover:bg-gray-800 border-l-2 border-transparent'
                                                }`}
                                        >
                                            {/* Play icon */}
                                            <span className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                                                {isActive ? (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                                                    </svg>
                                                )}
                                            </span>

                                            {/* Lecture info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm line-clamp-2 ${isActive ? 'text-blue-300' : 'text-gray-300'}`}>
                                                    {lecture.position}. {lecture.title}
                                                </p>
                                                {lecture.size > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatSize(lecture.size)}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

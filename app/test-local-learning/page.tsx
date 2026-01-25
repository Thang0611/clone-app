'use client';

/**
 * Test Page cho Local Folder Learning
 * Test Phase 1 & Phase 2 features
 */

import { useState, useEffect } from 'react';
import { LocalCoursePlayer } from '@/components/learning/LocalCoursePlayer';

export default function TestLocalLearningPage() {
  const [courseId] = useState('test-course-123');
  const [deviceId, setDeviceId] = useState<string>('');

  // Generate or get device ID only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('device-id');
      if (!id) {
        id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('device-id', id);
      }
      setDeviceId(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Test Local Folder Learning
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Test Phase 1 & Phase 2 features: Persistent Handle, Lazy Loading, Metadata Cache, Hybrid Progress Storage
          </p>
          {deviceId && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Device ID:</strong> {deviceId}
              </p>
              <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                Progress sẽ được sync với server nếu có deviceId
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <LocalCoursePlayer
            courseId={courseId}
            courseName="Test Course"
            deviceId={deviceId}
          />
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Test Checklist
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <strong>Phase 1 - Persistent Handle:</strong>
                <ul className="ml-4 mt-1 list-disc space-y-1">
                  <li>Chọn folder lần đầu → Handle được lưu vào IndexedDB</li>
                  <li>Reload page → Cached folder được load tự động</li>
                  <li>Verify handle invalid → Clear cache và chọn lại</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <strong>Phase 1 - Lazy Loading:</strong>
                <ul className="ml-4 mt-1 list-disc space-y-1">
                  <li>Click video → Video chỉ load khi cần</li>
                  <li>Switch video → Blob URL được cleanup (check DevTools Memory)</li>
                  <li>Auto-resume từ progress đã lưu</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <strong>Phase 2 - Metadata Cache:</strong>
                <ul className="ml-4 mt-1 list-disc space-y-1">
                  <li>Load folder lần đầu → Cache được tạo</li>
                  <li>Load folder lần 2 → Cache được dùng (nếu valid)</li>
                  <li>File thay đổi → Cache invalid → Full scan</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span>✅</span>
              <div>
                <strong>Phase 2 - Hybrid Progress Storage:</strong>
                <ul className="ml-4 mt-1 list-disc space-y-1">
                  <li>Xem video → Progress lưu vào IndexedDB</li>
                  <li>Grant write access → Progress lưu vào .progress.json</li>
                  <li>Copy folder → Progress file đi theo</li>
                  <li>Load folder mới → Progress sync từ file</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h2 className="mb-4 text-xl font-semibold text-yellow-800 dark:text-yellow-300">
            Browser Compatibility
          </h2>
          <div className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
            <p>
              <strong>✅ Full Support:</strong> Chrome 86+, Edge 86+
            </p>
            <p>
              <strong>⚠️ Limited Support:</strong> Firefox, Safari (sẽ hiển thị message)
            </p>
            <p className="mt-2">
              <strong>Current Browser:</strong>{' '}
              {typeof window !== 'undefined' && 'showDirectoryPicker' in window ? (
                <span className="font-semibold text-green-600 dark:text-green-400">✅ Supported</span>
              ) : (
                <span className="font-semibold text-red-600 dark:text-red-400">❌ Not Supported</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Debug Tools
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                IndexedDB Inspection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mở DevTools → Application → IndexedDB → LocalVideoPlayer
              </p>
              <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <strong>directoryHandles:</strong> Cached DirectoryHandle
                </li>
                <li>
                  <strong>videoProgress:</strong> Progress data
                </li>
                <li>
                  <strong>syncQueue:</strong> Progress chờ sync với server
                </li>
                <li>
                  <strong>videoMetadata:</strong> Cached video metadata
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                Console Logs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mở DevTools → Console để xem logs:
              </p>
              <ul className="ml-4 mt-2 list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700">
                    [DirectoryManager]
                  </code>{' '}
                  - Handle operations
                </li>
                <li>
                  <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700">
                    [VideoScanner]
                  </code>{' '}
                  - Scanning progress
                </li>
                <li>
                  <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700">
                    [ProgressManager]
                  </code>{' '}
                  - Progress operations
                </li>
                <li>
                  <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700">
                    [VideoMetadataCache]
                  </code>{' '}
                  - Cache operations
                </li>
                <li>
                  <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700">
                    [ProgressFileManager]
                  </code>{' '}
                  - File operations
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                Memory Inspection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mở DevTools → Memory → Take heap snapshot để kiểm tra Blob URL cleanup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

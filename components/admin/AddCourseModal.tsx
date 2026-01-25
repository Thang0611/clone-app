'use client';

import { useState } from 'react';
import { X, Plus, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { parseUrls } from '@/lib/utils';

interface ImportResult {
  success: boolean;
  url: string;
  courseId?: number;
  title?: string;
  created?: boolean;
  hasCurriculum?: boolean;
  error?: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCourseModal({ isOpen, onClose, onSuccess }: AddCourseModalProps) {
  const [urls, setUrls] = useState('');
  const [shouldDownload, setShouldDownload] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[] | null>(null);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    imported: number;
    updated: number;
    failed: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const urlList = parseUrls(urls);
    if (urlList.length === 0) {
      alert('Vui lòng nhập ít nhất một URL khóa học');
      return;
    }

    setIsImporting(true);
    setImportResults(null);
    setImportSummary(null);

    try {
      const response = await fetch('/api/admin/courses/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urls: urlList,
          shouldDownload: shouldDownload
        })
      });

      const data = await response.json();

      if (data.success) {
        setImportResults(data.results || []);
        setImportSummary({
          total: data.total || 0,
          imported: data.imported || 0,
          updated: data.updated || 0,
          failed: data.failed || 0
        });
        
        if (data.failed === 0) {
          // All succeeded, refresh and close after a delay
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 2000);
        }
      } else {
        throw new Error(data.error || 'Failed to import courses');
      }
    } catch (error: any) {
      console.error('Failed to import courses:', error);
      alert(error.message || 'Không thể import khóa học');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setUrls('');
      setShouldDownload(false);
      setImportResults(null);
      setImportSummary(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Thêm khóa học</h2>
          <button
            onClick={handleClose}
            disabled={isImporting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!importResults ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh sách URL khóa học (mỗi URL một dòng)
                </label>
                <textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://www.udemy.com/course/example-course-1/&#10;https://www.udemy.com/course/example-course-2/"
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm text-gray-900 bg-white"
                  disabled={isImporting}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Nhập các URL khóa học, mỗi URL trên một dòng
                </p>
              </div>

              {/* Download Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tự động download khóa học
                  </label>
                  <p className="text-xs text-gray-500">
                    Bật tính năng này để tự động download và upload lên Google Drive sau khi import
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShouldDownload(!shouldDownload)}
                  disabled={isImporting}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    shouldDownload ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      shouldDownload ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isImporting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isImporting || urls.trim().length === 0}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang import...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Import khóa học</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              {importSummary && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Kết quả import
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {importSummary.total}
                      </div>
                      <div className="text-sm text-gray-600">Tổng số</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {importSummary.imported}
                      </div>
                      <div className="text-sm text-gray-600">Mới</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {importSummary.updated}
                      </div>
                      <div className="text-sm text-gray-600">Cập nhật</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {importSummary.failed}
                      </div>
                      <div className="text-sm text-gray-600">Lỗi</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Chi tiết từng khóa học
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {importResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.success ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {result.title || result.url}
                            </span>
                            {result.success && result.created && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Mới
                              </span>
                            )}
                            {result.success && !result.created && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                Cập nhật
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 break-all">
                            {result.url}
                          </div>
                          {result.error && (
                            <div className="mt-2 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-red-600">{result.error}</span>
                            </div>
                          )}
                          {result.success && result.courseId && (
                            <div className="mt-2 text-xs text-gray-500">
                              Course ID: {result.courseId}
                              {result.hasCurriculum && ' • Có curriculum'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Đóng
                </button>
                {importSummary && importSummary.failed > 0 && (
                  <button
                    onClick={() => {
                      setImportResults(null);
                      setImportSummary(null);
                    }}
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Thử lại
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

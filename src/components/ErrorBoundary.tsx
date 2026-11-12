import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  public handleReload = () => {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-slate-900">
              Đã xảy ra sự cố hiển thị
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Trình duyệt gặp lỗi khi nạp trạng thái âm thanh hoặc bộ nhớ cục bộ. Bạn có thể nhấn
              nút bên dưới để làm mới và tiếp tục học bình thường.
            </p>

            {this.state.error && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs font-mono text-rose-700 break-all max-h-24 overflow-y-auto">
                {this.state.error.message || 'Lỗi không xác định'}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm Mới Trang Ứng Dụng</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface EditModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}

export function EditModal({ title, onClose, onSave, saving, children }: EditModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>
    </div>
  );
}
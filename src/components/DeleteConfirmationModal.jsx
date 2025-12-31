import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Item", message = "Are you sure you want to delete this item?" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform scale-100 animate-in zoom-in-95 duration-200 p-6 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>

                {/* Body */}
                <p className="text-gray-500 mb-8 mt-4">
                    {message}
                </p>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#D3043C] hover:bg-[#a0032e] shadow-lg shadow-red-200 transition-colors"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;

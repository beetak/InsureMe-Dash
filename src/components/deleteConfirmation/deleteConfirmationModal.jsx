import React, { useState } from 'react';

const DeleteConfirmationModal = ({ deleteOpen, onClose, onDelete }) => {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = () => {
      setDeleting(true);
      onDelete();
  };

  return (
    <>
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Delete Confirmation</h2>
            <p className="mb-6">Are you sure you want to delete this item?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteConfirmationModal;
import React, { useState } from 'react';

const ResetConfirmationModal = ({ resetOpen, userName, onClose, onReset }) => {
  const [reseting, setReseting] = useState(false)
  const handleReset = () => {
      setReseting(true);
      onReset();
  };

  return (
    <>
      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Reset Confirmation</h2>
            <p className="mb-6">Are you sure you want to reset {userName}'s password?</p>
            <div className="flex justify-end space-x-2">
              <button
                className={`px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded ${
                  reseting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleReset}
                disabled={reseting}
              >
                {reseting ? 'Resetting...' : 'Yes'}
              </button>
              
              <button
                className="px-8 py-2 mr-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={onClose}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetConfirmationModal;
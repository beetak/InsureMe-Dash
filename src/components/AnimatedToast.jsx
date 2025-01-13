import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedToast = ({ message, isVisible, type }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedToast;
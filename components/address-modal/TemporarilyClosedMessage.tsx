'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export function TemporarilyClosedMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <X className="w-12 h-12 text-red-500" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Temporarily Closed
      </h3>

      <p className="text-gray-600 text-center max-w-md">
        {"We're currently not accepting orders. Please check back later or contact customer support for more information."}
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Customer Support:</span> 0321-9785415
        </p>
      </div>
    </motion.div>
  );
}
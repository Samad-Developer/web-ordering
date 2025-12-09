'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function TemporarilyClosedMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6"
    >
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-orange-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Temporarily Closed
      </h3>
      
      <p className="text-gray-600 text-center max-w-md">
        We're currently not accepting orders. Please check back later or contact customer support for more information.
      </p>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Customer Support:</span> 021-111-222-333
        </p>
      </div>
    </motion.div>
  );
}
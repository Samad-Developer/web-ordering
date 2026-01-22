// components/address-selection/BranchDetailsCard.tsx

'use client';

import React from 'react';
import { Branch } from '@/types/address.types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Navigation, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseBranchAddress } from '@/lib/address/addressHelpers';
import { motion } from 'framer-motion';

interface BranchDetailsCardProps {
  branch: Branch;
}

export function BranchDetailsCard({ branch }: BranchDetailsCardProps) {
  const { mainAddress, phoneNumber } = parseBranchAddress(branch.BranchAddress);

  const handleGetDirections = () => {
    const encodedAddress = encodeURIComponent(mainAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${branch.BranchPhoneNumber}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border bg-gray-50 rounded-xl">
        <CardContent className="p-4 space-y-4">
          {/* Header with Success Icon */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary text-secondary rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-primary font-medium">Selected Branch</p>
              <h4 className="font-semibold text-lg text-gray-900">
                {branch.BranchName}
              </h4>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t " />

          {/* Details */}
          <div className="space-y-3">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                <p className="text-sm text-gray-900">{mainAddress}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-1">Contact</p>
                <p className="text-sm font-medium text-gray-900">
                  {phoneNumber || branch.BranchPhoneNumber}
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-1">Open Hours</p>
                {/* <p className="text-sm font-medium text-gray-900">{branch.BusinessStartTime}</p> */}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2  bg-gray-100 rounded-md"
              onClick={handleCall}
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            
            <Button
              type="button"
              className="gap-2 bg-primary text-secondary rounded-md"
              onClick={handleGetDirections}
            >
              <Navigation className="w-4 h-4" />
              Directions
            </Button>
          </div>
        </CardContent>
      </div>
    </motion.div>
  );
}
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';

interface CustomerInfoProps {
  customerData: {
    title: string;
    fullName: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    emailAddress?: string;
  };
}

export function CustomerInfo({ customerData }: CustomerInfoProps) {
  return (
    <div className="">
      <Card className="border-2 hover:shadow-lg ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-blue-500" />
            Customer Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <InfoRow
            label="Name"
            value={`${customerData.title}. ${customerData.fullName}`}
          />

          <InfoRow
            icon={<Phone className="w-4 h-4" />}
            label="Mobile Number"
            value={customerData.mobileNumber}
          />

          {customerData.alternateMobileNumber && (
            <InfoRow
              icon={<Phone className="w-4 h-4" />}
              label="Alternate Number"
              value={customerData.alternateMobileNumber}
            />
          )}

          {customerData.emailAddress && (
            <InfoRow
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={customerData.emailAddress}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-0">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}

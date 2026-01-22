import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { ContactInfo } from '@/types/footer.types';

interface ContactDetailsProps {
  contacts: ContactInfo[];
}

const iconMap = {
  phone: Phone,
  email: Mail,
  address: MapPin,
};

export const ContactDetails: React.FC<ContactDetailsProps> = ({ contacts }) => {
  return (
    <div className="space-y-4 flex flex-col justify-center items-center sm:items-start sm:justify-start">
      <h3 className="text-xl font-semibold text-footer-fg dark:text-white">
        Contact us
      </h3>
      <ul className="space-y-3">
        {contacts.map((contact, index) => {
          const Icon = iconMap[contact.type];
          const content = (
            <span className="flex items-center gap-3 text-footer-fg dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              <span>{contact.value}</span>
            </span>
          );

          return (
            <li key={index}>
              {contact.href ? (
                <Link href={contact.href} className="inline-flex">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

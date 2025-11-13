import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProductModal } from "../ProductModalContext";

export function SpecialInstructions() {
  const { customization, setInstructions } = useProductModal();

  return (
    <div className="px-6 py-4 space-y-3">
      <h3 className="text-base font-semibold text-gray-900">
        Special Instructions
      </h3>

      <Textarea
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        placeholder="Add any special requests or dietary requirements..."
        value={customization.specialInstructions || ''}
        onChange={(e) => setInstructions(e.target.value)}
        className="min-h-[100px] resize-y max-w-full whitespace-pre-wrap break-words"
        maxLength={500}
        wrap="soft"
      />


      <p className="text-xs text-gray-500">
        {(customization.specialInstructions || "").length} / 500 characters
      </p>
    </div>
  );
}

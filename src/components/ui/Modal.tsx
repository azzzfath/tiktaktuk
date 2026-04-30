import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className, 
  titleClassName 
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F]/80 backdrop-blur-sm p-4">
      <div 
        className={cn(
          "bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]", 
          className
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className={cn("text-lg font-bold text-[#F4F4F5]", titleClassName)}>
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-[#F4F4F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
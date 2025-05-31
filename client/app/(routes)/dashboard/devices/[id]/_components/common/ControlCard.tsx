import React from 'react';

interface ControlCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  title,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-base-100/80 backdrop-blur-xl border border-base-300/50 rounded-2xl p-6 shadow-xl ${className}`}>
      <h2 className="text-xl font-semibold mb-6 text-base-content">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

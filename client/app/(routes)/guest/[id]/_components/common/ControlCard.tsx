import React from 'react';

interface ControlCardProps {
  title: string;
  children: React.ReactNode;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  title,
  children
}) => {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

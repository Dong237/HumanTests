import React, { useState } from 'react';

interface InfoIconProps {
  title: string;
  content: string | React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  title,
  content,
  placement = 'top',
  size = 'md',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-sm',
    lg: 'w-6 h-6 text-base',
  };

  const tooltipPlacement = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <>
      {/* Info Icon Button */}
      <button
        className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded-full
          bg-blue-100 hover:bg-blue-200 border-2 border-gray-800
          transition-all duration-200 hover:scale-110
          relative group cursor-help ml-1.5`}
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={`了解更多：${title}`}
      >
        <span className="font-bold text-gray-800">i</span>

        {/* Tooltip on Hover */}
        {showTooltip && (
          <div
            className={`absolute ${tooltipPlacement[placement]} z-10
              px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg
              whitespace-nowrap pointer-events-none
              shadow-lg border border-gray-700`}
          >
            {title}
            <div className="absolute w-2 h-2 bg-gray-800 border-gray-700 transform rotate-45
              left-1/2 -translate-x-1/2 -bottom-1 border-b border-r" />
          </div>
        )}
      </button>

      {/* Modal on Click */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border-3 border-gray-800
              shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              max-w-2xl w-full max-h-[80vh] overflow-hidden
              transform transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-2 border-gray-800 bg-blue-50">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-200 border-2 border-gray-800
                  flex items-center justify-center text-sm">
                  i
                </span>
                {title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200
                  border-2 border-gray-800 flex items-center justify-center
                  transition-all duration-200 hover:scale-110"
                aria-label="关闭"
              >
                <span className="text-gray-800 font-bold">×</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] prose prose-sm max-w-none">
              {typeof content === 'string' ? (
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {content}
                </div>
              ) : (
                content
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-gray-800 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="excalidraw-button bg-blue-100 hover:bg-blue-200 text-gray-800"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0">
      <div className="text-sm text-gray-400">
        Showing {startItem}-{endItem} of {totalItems} chapters
      </div>

      <div className="flex items-center justify-center space-x-2">
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </motion.button>

        <div className="flex items-center justify-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <div key={`dots-${index}`} className="px-1 py-1 text-gray-500 sm:px-2 sm:py-2">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <motion.button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pageNumber}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            currentPage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </motion.button>
      </div>
    </div>
  );
};

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; // Assuming these components are part of your UI library

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pagination: { last_page: number }; // Assuming pagination object contains a 'last_page' property
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  pagination,
}) => {
  // Calculate total pages
  const totalPages = pagination?.last_page || 1;

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent className="flex items-center space-x-4">
        {/* Previous Button */}
        <PaginationPrevious
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationPrevious>

        {/* Page Number */}
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        <PaginationNext
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationNext>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

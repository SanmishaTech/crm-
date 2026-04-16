import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Filter, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Sidebar, { useSidebar } from "./Sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
  id: string;
  product: string;
  product_category: string;
  opening_qty: number;
  closing_qty: number;
  last_traded_price: number;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function InventoryIndex() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, setSearchTerm, toggle, isMinimized } = useSidebar();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const totalPages = pagination?.last_page || 1;

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

  const { data: InvResp } = useGetData({
    endpoint: `/api/products?search=${searchTerm}&page=${currentPage}&total=${totalPages}`,
    params: {
      queryKey: ["inventory", searchTerm, currentPage],
      retry: 1,
      onSuccess: (data) => {
        setPagination(data?.data?.Pagination);
        setLoading(false);
      },
      onError: (error) => {
        toast.error("Failed to fetch inventory data. Please try again.");
      },
    },
  });

  const products: Product[] = InvResp?.data?.Products || [];

  if (loading) {
    return (
      <div className="flex">
        <Sidebar className="" />
        <div className="p-6 w-full bg-accent/60 ml-4 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 mx-auto" />
            </div>
          </div>
          <div className="flex justify-between items-center py-1 space-x-3 mr-4">
            <div className="ml-4 mt-2">
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex-1 space-x-2">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="panel p-4 rounded-md bg-card mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar className="" />
      <div className="p-6 w-full bg-accent/60 ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mx-auto text-foreground">
              Inventory / Stock Ledger
            </h3>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 space-x-3 ">
          <div className="ml-4 mt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Filter
                    onClick={toggle}
                    className="h-5 text-foreground hover:text-foreground/80"
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground">
                  <p>Filter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 space-x-2">
            {isMinimized ? (
              <Input
                className="bg-background text-foreground border-border"
                placeholder="Search Product Inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : null}
          </div>
        </div>

        <div className="p-4 rounded-md bg-card mt-4 overflow-x-auto min-w-[600px]">
          <Table>
            <TableCaption className="text-muted-foreground">
              Live Stock Availability and Valuations.
            </TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-accent/50">
                <TableHead className="text-foreground font-semibold">Product Name</TableHead>
                <TableHead className="text-foreground font-semibold">Category</TableHead>
                <TableHead className="text-foreground font-semibold">Base Price</TableHead>
                <TableHead className="text-foreground font-semibold text-center mt-2 px-4 py-1 h-3 rounded-md border flex items-center justify-center">Opening Stock</TableHead>
                <TableHead className="text-foreground font-semibold text-center border-l">In Stock (Available)</TableHead>
                <TableHead className="text-right text-foreground font-semibold border-l">Current Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => {
                  const outOfStock = Number(product.closing_qty) <= 0;
                  const value = (Number(product.closing_qty) * Number(product.last_traded_price)).toFixed(2);

                  return (
                    <TableRow key={product.id} className="hover:bg-accent/50">
                      <TableCell className="text-foreground font-medium">{product.product}</TableCell>
                      <TableCell className="text-foreground">{product.product_category || 'N/A'}</TableCell>
                      <TableCell className="text-foreground">₹{product.last_traded_price}</TableCell>
                      <TableCell className="text-foreground text-center border">{product.opening_qty}</TableCell>
                      <TableCell className={`text-center font-bold border-l ${outOfStock ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
                        {product.closing_qty}
                      </TableCell>
                      <TableCell className="text-right text-foreground border-l">
                        ₹{Number(value) > 0 ? value : "0.00"}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No products found in inventory.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent className="flex items-center space-x-4">
                <PaginationPrevious
                  className={`hover:pointer text-foreground hover:text-foreground/80 hover:bg-accent border ${currentPage === 1 ? "cursor-default opacity-50" : "cursor-pointer"
                    }`}
                  onClick={goToPreviousPage}
                >
                  Previous
                </PaginationPrevious>
                <span className="text-sm text-foreground font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <PaginationNext
                  className={`hover:pointer text-foreground hover:text-foreground/80 hover:bg-accent border ${currentPage === totalPages ? "cursor-default opacity-50" : "cursor-pointer"
                    }`}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationNext>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}

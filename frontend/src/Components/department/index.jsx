import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// new
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Add from "./add";

const index = () => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State to control dialog visibility
  //   const [searchQuery, setSearchQuery] = useState("");
  const [searchName, setSearchName] = useState("");
  const [pages, setPages] = useState([]);

  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  // const fetchData = async (page = 1) => {
  //   const response = await axios.get("http://localhost:8000/api/departments", {
  //     params: {
  //       page: page,
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   console.log("Response received:", response);

  //   setData(response?.data?.data?.Department);
  //   setCurrentPage(response?.data?.data?.pagination.current_page);
  //   setTotalPages(response?.data?.data?.pagination.last_page);
  //   setTotalItems(response?.data?.data?.pagination.total);
  // };

  useEffect(() => {
    // fetchData();
    searchData(searchName, currentPage);
    console.log(data);
  }, [currentPage, searchName]);

  // // pagination
  // useEffect(() => {
  //   searchData(currentPage);
  // }, [currentPage]);

  useEffect(() => {
    const generatePages = () => {
      let pagesToDisplay = [];

      // Always show page 1
      pagesToDisplay.push(1);

      // If the current page is not the first page, add it
      if (currentPage > 1 && currentPage < totalPages) {
        pagesToDisplay.push(currentPage);
      }

      // Always show the last page if there are more than 3 pages
      if (totalPages > 3 && currentPage !== totalPages) {
        pagesToDisplay.push(totalPages);
      }

      // Add ellipsis if there are more than 3 pages
      if (totalPages > 3) {
        if (!pagesToDisplay.includes(2)) {
          pagesToDisplay.push("...");
        }
      }

      setPages(pagesToDisplay);
    };

    generatePages();
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // pagination end
  const searchData = async (nameQuery = "", page = 1) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/department_search",
        {
          params: {
            search: nameQuery,
            page: page,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response?.data?.data?.Department); // Adjust based on your API response format
      setCurrentPage(response?.data?.data?.pagination.current_page);
      setTotalPages(response?.data?.data?.pagination.last_page);
      setTotalItems(response?.data?.data?.pagination.total);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSearchChange = () => {
    if (searchName.length >= 3) {
      setTimeout(() => {
        searchData(searchName, currentPage);
      }, 50);
    } else if (searchName.length === 0) {
      setTimeout(() => {
        searchData("", currentPage);
      }, 50);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
    };
    const response = await axios.put(
      `http://localhost:8000/api/departments/${editId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setName("");
    setDescription("");
    setIsEditDialogOpen(false); // Close dialog after submission

    fetchData();
    toast.success("Department Updated Successfully");
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(
      `http://localhost:8000/api/departments/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchData();
    toast.success("Department Deleted Successfully");
  };

  const onEditClick = async (id) => {
    const response = await axios.get(
      `http://localhost:8000/api/departments/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setName(response.data.data.Department.name);
    setDescription(response.data.data.Department.description);
    setEditId(response.data.data.Department.id);
  };

  return (
    <>
      <div className="flex m-5 mr-20 justify-between">
        <div className="w-full">
          {/* here */}
          <Add searchData={searchData} currentPage={currentPage} />
        </div>
        <div className="ml-14">
          <Input
            type="text"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              handleSearchChange();
            }}
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex p-5">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((Department, index) => (
                <TableRow>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{Department.name}</TableCell>
                  <TableCell>{Department.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <p>
                        <Dialog
                          open={isEditDialogOpen}
                          onOpenChange={setIsEditDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => {
                                onEditClick(Department.id);
                              }}
                              variant="outline"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleEdit}>
                              <DialogHeader>
                                <DialogTitle>Edit Department</DialogTitle>
                                <DialogDescription>
                                  Make changes to your department here. Click
                                  save when you're done.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input
                                    id="name"
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="description"
                                    className="text-right"
                                  >
                                    description
                                  </Label>
                                  <Input
                                    id="description"
                                    defaultValue={description}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Save changes</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </p>
                      <p>
                        {" "}
                        <Button
                          onClick={() => {
                            handleDelete(Department.id);
                          }}
                          variant="outline"
                        >
                          Delete
                        </Button>
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page number links */}
              {pages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default index;

import { useState, useCallback, useEffect } from "react";
import { Check, ChevronsUpDown, MoreHorizontal, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/lib/HTTP/GET";
import { useQueryClient } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import AlertDialogbox from "./AlertBox";

// Contact type
type Contact = {
  id: string;
  client_id: string;
  contact_person: string;
  department: string;
  designation: string;
  email: string;
  mobile_1?: string;
  client_name?: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

type ContactsData = {
  Contact: Contact[];
  pagination: PaginationData;
};

export default function TableDemo() {
  const [contacts, setContacts] = useState<ApiResponse<ContactsData> | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [clientId, setClientId] = useState("");
  const [openClientSelect, setOpenClientSelect] = useState(false);
  const [clients, setClients] = useState<{ value: string; label: string }[]>([]);

  // Maintain search debouncing for performance while respecting your pattern
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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

  // Fetch Clients for dropdown
  const onClientsSuccess = useCallback((data: any) => {
    if (data?.data?.Client) {
      const formattedClients = data.data.Client.map((client: any) => ({
        value: client.id.toString(),
        label: client.client,
      }));
      setClients(formattedClients);
    }
  }, []);

  useGetData({
    endpoint: `/api/all_clients`,
    params: {
      queryKey: ["clients"],
      retry: 1,
      onSuccess: onClientsSuccess,
      staleTime: 0,
    },
  });


  // Fetch Contacts with search parameters - Using debouncedSearch for optimized refetching
  const { isLoading } = useGetData({
    endpoint: `/api/contacts?search=${debouncedSearch}&page=${currentPage.toString()}${clientId ? `&client_id=${clientId}` : ""}`,
    params: {
      queryKey: ["contacts", debouncedSearch, currentPage.toString(), clientId],
      retry: 1,
      onSuccess: (response: unknown) => {
        // Keeping your manual state syncing pattern
        const data = response as ApiResponse<ContactsData>;
        setContacts(data);
        setPagination(data.data.pagination);
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
      },
      onError: (error) => {
        console.error("Failed to fetch contacts", error);
      },
    },
  });

  return (
    <div className="flex w-full">
      <div className="p-2 md:p-6 w-full bg-accent/60 md:ml-4 mr-8 rounded-lg shadow-lg">
        <div className="p-2 mb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mx-auto text-primary">Contacts Management</h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 py-4 px-2 bg-background/50 rounded-t-lg border-b border-border/50">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[220px] justify-between bg-background border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <span className="truncate">
                    {clientId
                      ? clients.find((client) => client.value === clientId)?.label
                      : "All Clients"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0 shadow-xl border-border/50">
                <Command>
                  <CommandInput placeholder="Filter client..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No client found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setClientId("");
                          setOpenClientSelect(false);
                          setCurrentPage(1);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            clientId === "" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Clients
                      </CommandItem>
                      {clients.map((client) => (
                        <CommandItem
                          key={client.value}
                          value={client.value}
                          onSelect={(currentValue) => {
                            // Support for CommandItem's lowercase matching logic
                            const matchedClient = clients.find(c => 
                              c.value.toLowerCase() === currentValue.toLowerCase() || 
                              c.label.toLowerCase() === currentValue.toLowerCase()
                            );
                            const val = matchedClient ? matchedClient.value : currentValue;
                            
                            setClientId(val === clientId ? "" : val);
                            setOpenClientSelect(false);
                            setCurrentPage(1);
                          }}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              clientId === client.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {client.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={() => navigate("/contacts/add")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        <div className="panel p-4 rounded-b-lg bg-card shadow-sm border-t-0 border relative">
          {isLoading && (
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/20 animate-pulse" />
          )}
          <Table>
            <TableCaption>A list of your contacts.</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-foreground font-semibold">Contact person</TableHead>
                <TableHead className="text-foreground font-semibold">Client</TableHead>
                <TableHead className="text-foreground font-semibold">Department</TableHead>
                <TableHead className="text-foreground font-semibold">Designation</TableHead>
                <TableHead className="text-foreground font-semibold">Email</TableHead>
                <TableHead className="text-foreground font-semibold">Primary Mobile</TableHead>
                <TableHead className="text-foreground font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.data?.Contact?.length ? (
                contacts.data.Contact.map((contact: Contact) => (
                  <TableRow key={contact.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-primary">{contact.contact_person || "N/A"}</TableCell>
                    <TableCell>
                      {contact?.client_name
                        ? contact.client_name.charAt(0).toUpperCase() +
                        contact.client_name.slice(1)
                        : "N/A"}
                    </TableCell>
                    <TableCell>{contact.department || "N/A"}</TableCell>
                    <TableCell>{contact.designation || "N/A"}</TableCell>
                    <TableCell className="lowercase">{contact.email || "N/A"}</TableCell>
                    <TableCell>{contact.mobile_1 || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent focus-visible:ring-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/contacts/edit/${contact.id}`)}
                            className="w-full justify-start font-normal"
                          >
                            Edit Details
                          </Button>
                          <div className="border-t my-1" />
                          <AlertDialogbox url={contact.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    {isLoading ? "Loading contacts..." : "No contacts found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="mt-4 py-4 border-t">
            <Pagination>
              <PaginationContent className="flex items-center justify-between w-full">
                <div className="text-sm text-muted-foreground">
                  Showing {contacts?.data?.Contact?.length || 0} of {pagination?.total || 0} contacts
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-medium text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center space-x-2">
                    <PaginationPrevious
                      className={cn(
                        "cursor-pointer text-foreground hover:bg-accent",
                        currentPage === 1 && "pointer-events-none opacity-50"
                      )}
                      onClick={goToPreviousPage}
                    />
                    <PaginationNext
                      className={cn(
                        "cursor-pointer text-foreground hover:bg-accent",
                        currentPage === totalPages && "pointer-events-none opacity-50"
                      )}
                      onClick={goToNextPage}
                    />
                  </div>
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

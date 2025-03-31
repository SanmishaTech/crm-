import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Sidebar, { useSidebar } from "./Sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MoreHorizontal,
  Filter,
  Pencil,
  Eye,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useGetData } from "@/lib/HTTP/GET";
import AlertDialogbox from "./Delete";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { usePutData } from "@/lib/HTTP/PUT";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { usePostData } from "@/lib/HTTP/POST";

type Replacement = {
  id: string;
  supplier: string;
  street_address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
};

type PaginationData = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const formSchema = z.object({
  supplier: z.string().min(2).max(50),
  street_address: z.string().min(2).max(50),
  area: z.string().min(2).max(50),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  pincode: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  gstin: z.string().min(2).max(50),
});

// Define schema for editing a note.
const editSchema = z.object({
  note_title: z.string(),
  note_content: z.string(),
});

export default function TableDemo() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm, setSearchTerm, toggle, isMinimized } = useSidebar();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const queryClient = useQueryClient();
  const [activeNote, setActiveNote] = useState<any>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Add local search state
  const [localSearch, setLocalSearch] = useState("");

  // Move data fetching before any data usage
  const { data: Sup } = useGetData({
    endpoint: `/api/notepads?search=${searchTerm}`,
    params: {
      queryKey: ["notepad", searchTerm],
      retry: 1,

      onSuccess: (data) => {
        setLoading(false);
      },
      onError: (error) => {
        if (error.message && error.message.includes("Duplicate Challans")) {
          toast.error("Challan name is Duplicated. Please use a unique name.");
        } else {
          toast.error("Failed to  data. Please try again.");
        }
      },
    },
  });

  // Move filtered notes after Sup is defined
  const filteredNotes = React.useMemo(() => {
    return Sup?.data?.Notepad?.filter((note) =>
      (note?.note_title || "").toLowerCase().includes(localSearch.toLowerCase())
    );
  }, [Sup?.data?.Notepad, localSearch]);

  // Initialize the edit form.
  const editForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: { note_title: "", note_content: "" },
  });

  const noteForm = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      note_title: "",
      note_content: "",
    },
  });

  // Reset form values when a note is selected.
  useEffect(() => {
    if (selectedNote) {
      editForm.reset({
        note_title: selectedNote.note_title || "",
        note_content: selectedNote.note_content || "",
      });
    }
  }, [selectedNote, editForm]);

  // Reset form when selecting a note
  useEffect(() => {
    if (activeNote) {
      noteForm.reset({
        note_title: activeNote.note_title || "",
        note_content: activeNote.note_content || "",
      });
    }
  }, [activeNote]);

  // Set up the update hook; endpoint will be set when selectedNote is present.
  const updateNote = usePutData({
    endpoint: activeNote ? `/api/notepads/${activeNote.id}` : "",
    params: {
      onSuccess: (data) => {
        toast.success("Notepad updated successfully");
        queryClient.invalidateQueries({ queryKey: ["notepad"] });
        queryClient.invalidateQueries({ queryKey: ["notepad", activeNote.id] });
        setActiveNote(null);
        setIsCreatingNew(false);
        noteForm.reset({ note_title: "", note_content: "" });
      },
      onError: (error) => {
        if (error.response && error.response.data.errors) {
          const serverStatus = error.response.data.status;
          const serverErrors = error.response.data.errors;
          if (serverStatus === false) {
            if (serverErrors.notepad) {
              noteForm.setError("note_title", {
                type: "manual",
                message: serverErrors.notepad[0],
              });
              toast.error("The notepad has already been taken.");
            }
          } else {
            setError("Failed to update notepad");
          }
        } else {
          setError("Failed to update notepad");
        }
      },
    },
  });

  // Add POST hook for new notes
  const createNote = usePostData({
    endpoint: "/api/notepads",
    params: {
      onSuccess: (data) => {
        toast.success("Note saved successfully.");
        queryClient.invalidateQueries({ queryKey: ["notepad"] });
        setActiveNote(null);
        setIsCreatingNew(false);
        noteForm.reset({ note_title: "", note_content: "" });
      },
      onError: (error) => {
        toast.error("Failed to save note.");
      },
    },
  });

  // Modify handleEditSubmit to handle both new and existing notes
  const handleEditSubmit = (data: z.infer<typeof editSchema>) => {
    // Trim whitespace from the input
    const trimmedTitle = data.note_title.trim();
    const trimmedContent = data.note_content.trim();

    // Check if both fields are empty
    if (!trimmedTitle && !trimmedContent) {
      noteForm.setError("note_title", {
        type: "manual",
        message: "Title is required",
      });
      noteForm.setError("note_content", {
        type: "manual",
        message: "Content is required",
      });
      toast.error("Title or content must not be empty");
      return;
    }

    if (activeNote?.id) {
      updateNote.mutate({
        note_title: trimmedTitle || "Untitled", // Fallback title if empty
        note_content: trimmedContent || "", // Empty string if no content
      });
    } else {
      createNote.mutate({
        note_title: trimmedTitle || "Untitled", // Fallback title if empty
        note_content: trimmedContent || "", // Empty string if no content
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
    },
  });

  // Add useEffect for page title
  useEffect(() => {
    document.title = "Notepad | CRM";
  }, []);

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
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="panel p-4 rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className=" flex justify-center">
              <Skeleton className="h-5 w-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Replace handleNoteClick with this updated version
  const handleNoteClick = (note: any) => {
    // If clicking the same note that's already active, deselect it
    if (activeNote?.id === note.id && !activeNote?.editMode) {
      setActiveNote(null);
      setIsCreatingNew(false);
      noteForm.reset({
        note_title: "",
        note_content: "",
      });
      return;
    }

    // If we're already editing this note, don't do anything
    if (activeNote?.id === note.id && activeNote?.editMode) {
      return;
    }

    // Set the note for viewing (not editing)
    setActiveNote({ ...note, editMode: false });
    setIsCreatingNew(false);
    noteForm.reset({
      note_title: note.note_title,
      note_content: note.note_content,
    });
  };

  // Update handleEditClick
  const handleEditClick = (note: any, e: React.MouseEvent) => {
    e.stopPropagation();

    if (activeNote?.id === note.id && activeNote?.editMode) {
      // If already editing, cancel edit mode
      setActiveNote({ ...note, editMode: false });
    } else {
      // Enter edit mode
      setActiveNote({ ...note, editMode: true });
      setIsCreatingNew(false);
      noteForm.reset({
        note_title: note.note_title,
        note_content: note.note_content,
      });
    }
  };

  // Modify the new note button click handler
  const handleNewNoteClick = () => {
    setIsCreatingNew(true);
    setActiveNote(null);
    noteForm.reset({ note_title: "", note_content: "" });
  };

  // After the handleNewNoteClick function, add this new helper function
  const handleNoteDelete = (noteId: string) => {
    // If the deleted note is currently being viewed, clear it
    if (activeNote?.id === noteId) {
      setActiveNote(null);
      setIsCreatingNew(false);
      noteForm.reset({
        note_title: "",
        note_content: "",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <Sidebar className="md:sticky md:top-0 md:h-screen" />
      <div className="flex-1 p-2 md:p-4 w-full bg-accent/60 md:ml-4 mr-8 rounded-lg shadow-lg">
        {/* Reduce top margin */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-foreground text-center">
            Notes
          </h1>
        </div>
        {/* Adjust the height calculation to prevent scrolling */}
        <div className="flex h-[calc(100vh-9rem)] gap-4 ">
          {/* Left Column - Notes List - Changed width from w-1/3 to w-1/4 */}
          <div className="w-1/4 bg-card rounded-lg p-4 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                Saved Notes
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search notes..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="bg-background text-foreground border-input"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNewNoteClick}
                  className="h-10 w-10 p-0 text-foreground hover:text-foreground/80 hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {filteredNotes?.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className={`p-3 rounded-lg cursor-pointer ${
                    activeNote?.id === note.id
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {note?.note_title?.length > 15
                          ? note.note_title.substring(0, 15) + "..."
                          : note?.note_title || "Untitled"}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {note?.note_content?.length > 20
                          ? note.note_content.substring(0, 20) + "..."
                          : note?.note_content || "No content"}
                      </p>
                    </div>
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          handleEditClick(note, e);
                        }}
                        className={`h-8 w-8 p-0 ${
                          activeNote?.id === note.id && activeNote?.editMode
                            ? "bg-blue-500/20 text-blue-500"
                            : "hover:bg-blue-500/20 hover:text-blue-500 text-muted-foreground"
                        }`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialogbox
                        url={note.id}
                        onDelete={() => handleNoteDelete(note.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Note Editor - Changed width from w-2/3 to w-3/4 */}
          <div className="w-3/4 bg-card rounded-lg p-4">
            {activeNote?.editMode || isCreatingNew ? (
              <div className="space-y-4">
                <Form {...noteForm}>
                  <form
                    onSubmit={noteForm.handleSubmit(handleEditSubmit)}
                    className="space-y-4 h-full"
                  >
                    <FormField
                      control={noteForm.control}
                      name="note_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-foreground">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Note Title"
                              {...field}
                              className="bg-background text-foreground border-input"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={noteForm.control}
                      name="note_content"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-sm text-foreground">
                            Content
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter Note Content"
                              {...field}
                              className="bg-background text-foreground border-input h-[calc(100vh-23rem)]"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setActiveNote(null);
                          setIsCreatingNew(false);
                          noteForm.reset({
                            note_title: "",
                            note_content: "",
                          });
                        }}
                        className="text-foreground hover:text-foreground/80 hover:bg-accent"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {activeNote ? "Update Note" : "Save Note"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : activeNote ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-foreground text-center underline flex-1">
                    {activeNote.note_title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setActiveNote(null);
                      setIsCreatingNew(false);
                      noteForm.reset({
                        note_title: "",
                        note_content: "",
                      });
                    }}
                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-background/50 rounded-lg p-4 h-[calc(100vh-20rem)]">
                  <div className="whitespace-pre-wrap text-sm text-foreground overflow-y-auto h-full">
                    {activeNote.note_content}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                <p>Select a note to view or click + to create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

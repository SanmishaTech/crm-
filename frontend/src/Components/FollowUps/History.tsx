import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";

const History = ({ leads }) => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // Refetch the leads data when the component mounts
    queryClient.invalidateQueries("leads");
  }, [queryClient]);

  if (!leads) {
    return <div className="text-center py-4">Loading lead data...</div>;
  }

  const followUps = leads.follow_ups;

  // Log the leads data for debugging

  if (!followUps || followUps.length === 0) {
    return (
      <div className="text-center py-4">No follow-up details available.</div>
    );
  }

  const sortedFollowUps = [...followUps].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="overflow-hidden py-4 space-y-6">
      <div className="space-y-4">
        <Card className="bg-muted/70">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">
              Follow-Up Count: {followUps.length}
            </CardTitle>
            <CardDescription className="text-sm text-">
              Total number of follow-ups for this lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-">
              Total follow-ups: {followUps.length}
            </p>
          </CardContent>
          <CardFooter />
        </Card>
      </div>

      <div>
        <Table className="min-w-full bg-background rounded-md shadow-lg border border-muted">
          <TableHeader className="bg-muted text-sm">
            <TableRow>
              <TableCell className="px-4 py-2 text-left">#</TableCell>
              <TableCell className="px-4 py-2 text-left">
                Follow-Up Date
              </TableCell>
              <TableCell className="px-4 py-2 text-left">
                Next Follow-Up Date
              </TableCell>
              <TableCell className="px-4 py-2 text-left">
                Follow-Up Type
              </TableCell>
              <TableCell className="px-4 py-2 text-left">Remarks</TableCell>
              <TableCell className="px-4 py-2 text-left">Created At</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedFollowUps.map((followUp, index) => {
              const {
                follow_up_date,
                next_follow_up_date,
                follow_up_type,
                remarks,
                created_at,
              } = followUp;

              return (
                <TableRow
                  key={index}
                  className="hover:bg-muted/10 transition-colors duration-150"
                >
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {follow_up_date
                      ? new Date(follow_up_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {next_follow_up_date
                      ? new Date(next_follow_up_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {follow_up_type || "N/A"}
                  </TableCell>
                  <TableCell className="border-t px-4 py-2 text-sm">
                    {remarks || "N/A"}
                  </TableCell>

                  <TableCell className="border-t px-4 py-2 text-sm">
                    {created_at
                      ? `${new Date(
                          created_at
                        ).toLocaleDateString()} (${new Date(
                          created_at
                        ).toLocaleTimeString()})`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useQueryClient } from '@tanstack/react-query';

const History = ({ leads }) => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // Refetch the leads data when the component mounts
    queryClient.invalidateQueries('leads');
  }, [queryClient]);

  if (!leads) {
    return <div>Loading lead data...</div>;
  }

  const followUps = leads.follow_ups;  

  // Log the leads data for debugging
  console.log(followUps);

  if (!followUps || followUps.length === 0) {
    return <div>No follow-up details available.</div>;
  }

  // Sort follow-ups to show the latest first
  const sortedFollowUps = [...followUps].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="overflow-hidden py-4">
      {/* Follow-Up Count Card at the top */}
      <div className="mb-6">
        <Card className="bg-accent/70 w-full">
          <CardHeader>
            <CardTitle>Follow-Up Count: {followUps.length}</CardTitle>
            <CardDescription>
              Total number of follow-ups for this lead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Total follow-ups: {followUps.length}</p>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      {/* Follow-Up Details Table */}
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableCell className="py-2">Number</TableCell>
            <TableCell className="py-2">Follow-Up Date</TableCell>
            <TableCell className="py-2">Next Follow-Up Date</TableCell>
            <TableCell className="py-2">Follow-Up Type</TableCell>
            <TableCell className="py-2">Remarks</TableCell>
            <TableCell className="py-2">Created At</TableCell>
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
              <TableRow key={index} className="bg-gray-100">
                <TableCell className="border px-4 py-2">{index + 1}</TableCell>
                <TableCell className="border px-4 py-2">
                  {follow_up_date ? new Date(follow_up_date).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="border px-4 py-2">
                  {next_follow_up_date ? new Date(next_follow_up_date).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell className="border px-4 py-2">{follow_up_type || "N/A"}</TableCell>
                <TableCell className="border px-4 py-2">{remarks || "N/A"}</TableCell>
                <TableCell className="border px-4 py-2">
                  {created_at ? new Date(created_at).toLocaleDateString() : "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;

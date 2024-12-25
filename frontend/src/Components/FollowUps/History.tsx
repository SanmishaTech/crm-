import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const History = ({ leads }) => {
  if (!leads) {
    return <div>Loading lead data...</div>;
  }

  const followUps = leads.follow_ups; // Get all follow-ups

  // Log the leads data for debugging
  console.log(followUps);

  if (!followUps || followUps.length === 0) {
    return <div>No follow-up details available.</div>;
  }

  return (
    <div className="overflow-hidden py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Follow-Up Count Card at the top */}
      <div className="col-span-2">
        <Card className="bg-accent/70 w-full mt-6">
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

      {/* Loop through each follow-up */}
      {followUps.map((followUp, index) => {
        const {
          follow_up_date,
          next_follow_up_date,
          follow_up_type,
          remarks,
          created_at,
        } = followUp;

        return (
          <Card key={index} className="bg-accent/40 w-full">
            <CardHeader>
              <CardTitle>Follow-Up Details {index + 1}</CardTitle>
              <CardDescription>
                <p>
                  <strong>Created At:</strong>{" "}
                  {created_at
                    ? new Date(created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Follow-Up Date:</strong>{" "}
                {follow_up_date
                  ? new Date(follow_up_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Next Follow-Up Date:</strong>{" "}
                {next_follow_up_date
                  ? new Date(next_follow_up_date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Follow-Up Type:</strong> {follow_up_type || "N/A"}
              </p>
              <p>
                <strong>Remarks:</strong> {remarks || "N/A"}
              </p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default History;

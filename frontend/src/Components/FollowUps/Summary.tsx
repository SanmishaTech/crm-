import React from "react";
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

const Summary = ({ leads }) => {
  if (!leads) {
    return <div>Loading lead data...</div>;
  }

  const { id, employee_id, contact } = leads; // Destructure relevant data
  const contactName = contact?.contact_person || "Unknown"; // Fallback for missing name

  return (
    <div className="flex justify-end w-[900px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Show Summary</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-hidden h-60 grid col-span-2 gap-2 py-2 ">
            <h3 className="text-lg font-bold mb-2">Lead Summary</h3>
            <p>
              <strong>ID:</strong> {id}
            </p>
            <p>
              <strong>Employee ID:</strong> {employee_id}
            </p>
            <p>
              <strong>Contact Name:</strong> {contactName}
            </p>
            <p>
              <strong>Lead Source:</strong> {leads.lead_source}
            </p>
            {leads.lead_type && (
              <p>
                <strong>Lead Type:</strong> {leads.lead_type}
              </p>
            )}
            {leads.tender_number && (
              <p>
                <strong>Tender Number:</strong> {leads.tender_number}
              </p>
            )}
            {leads.bid_end_date && (
              <p>
                <strong>Bid End Date:</strong> {leads.bid_end_date}
              </p>
            )}
            {leads.portal && (
              <p>
                <strong>Portal:</strong> {leads.portal}
              </p>
            )}
            {leads.tender_category && (
              <p>
                <strong>Tender Category:</strong> {leads.tender_category}
              </p>
            )}
            {leads.emd !== undefined && (
              <p>
                <strong>EMD Status:</strong>{" "}
                {leads.emd === 0
                  ? "Paid"
                  : leads.emd === 1
                  ? "Pending"
                  : "Unpaid"}
              </p>
            )}

            {leads.tender_status && (
              <p>
                <strong>Tender Status:</strong> {leads.tender_status}
              </p>
            )}
            {leads.lead_status && (
              <p>
                <strong>Lead Status:</strong> {leads.lead_status}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Summary;

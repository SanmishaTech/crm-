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

  const { id, employee_id, contact } = leads;
  const contactName = contact?.contact_person || "Unknown";

  return (
    <div className="overflow-hidden py-2 grid grid-cols-3 gap-4">
      <h3 className="text-xl font-bold col-span-3 mb-4 text-center">
        Lead Summary
      </h3>

      <div className="col-span-1 space-y-3">
        <h3 className="text-lg font-bold">Basic Leads</h3>
        {/* <p>
          <strong>ID:</strong> {id}
        </p>
        <p>
          <strong>Employee ID:</strong> {employee_id}
        </p> */}
        <p>
          <strong>Contact Name:</strong> {contactName}
        </p>
        <p>
          <strong>Lead Source:</strong> {leads.lead_source}
        </p>
        {leads.lead_status && (
          <p>
            <strong>Lead Status:</strong> {leads.lead_status}
          </p>
        )}
      </div>

      <div className="col-span-1 space-y-3">
        <h3 className="text-lg font-bold">Tender </h3>

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
            <strong>Bid End Date:</strong>{" "}
            {new Date(leads.bid_end_date).toLocaleDateString()}
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
            {leads.emd === 0 ? "Paid" : leads.emd === 1 ? "Pending" : "Unpaid"}
          </p>
        )}
        {leads.tender_status && (
          <p>
            <strong>Tender Status:</strong> {leads.tender_status}
          </p>
        )}
      </div>

      <div className="col-span-1 space-y-3">
        <h3 className="text-lg font-bold text-center">Products</h3>
        <div className="flex space-x-4">
          <div className="flex-1 text-center font-bold">Product</div>
          <div className="flex-1 text-center font-bold">Quantity</div>
        </div>
        {leads.products && leads.products.length > 0 ? (
          leads.products.map((product, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex-1">{product.name}</div>
              <div className="flex-1 text-center">{product.quantity}</div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Summary;

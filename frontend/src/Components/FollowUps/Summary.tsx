import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Summary = ({ leads }) => {
  if (!leads) {
    return <div>Loading lead data...</div>;
  }

  const { id, employee_id, contact } = leads;
  const contactName = contact?.contact_person || "Unknown";

  return (
    <div className="overflow-hidden py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <h3 className="text-2xl font-bold col-span-3 mb-6 text-center">
        Lead Summary
      </h3>

      {/* Basic Leads Card */}
      <Card className="bg-accent/40">
        <CardHeader>
          <CardTitle>Basic Leads</CardTitle>
          <CardDescription>Key details about the lead</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      {/* Tender Card */}
      <Card className="bg-accent/40">
        <CardHeader>
          <CardTitle>Tender</CardTitle>
          <CardDescription>Details about the tender</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      {/* Products Card */}
      <Card className="bg-accent/40">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Quantity and details of the products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex space-x-4 mb-3">
              <div className="flex-1 text-center font-bold">Product</div>
              <div className="flex-1 text-center font-bold">Quantity</div>
            </div>
            {leads.products && leads.products.length > 0 ? (
              leads.products.map((product, index) => (
                <div key={index} className="">
                  <div className="flex justify-between">
                    <div className="flex-1">{product.name}</div>
                    <div className="flex-1 text-center">{product.quantity}</div>
                  </div>
                  <Separator className="my-2 mb-4 border-t border-gray-300" />
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
};

export default Summary;

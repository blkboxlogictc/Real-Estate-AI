import { useState } from "react";
import { useListListings } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Bed, Bath, Square, Database } from "lucide-react";

export default function Listings() {
  const { data: listings, isLoading } = useListListings({});

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0">Active</Badge>;
      case "pending": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-0">Pending</Badge>;
      case "sold": return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">Sold</Badge>;
      case "off_market": return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-0">Off Market</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "Contact Agent";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground mt-1">Manage your active properties and knowledge base.</p>
        </div>
        <Button>Add Listing</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-sm bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">MLS Connector</h3>
                <p className="text-sm text-muted-foreground">Not connected</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your MLS to automatically sync your listings and keep your AI assistant's knowledge base updated.
            </p>
            <Button variant="outline" className="w-full bg-background">Connect MLS</Button>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-sm border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              Property Database
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading listings...
                    </TableCell>
                  </TableRow>
                ) : listings?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No listings found. Add one manually or connect MLS.
                    </TableCell>
                  </TableRow>
                ) : (
                  listings?.map((listing) => (
                    <TableRow key={listing.id} className="hover:bg-accent/50 transition-colors">
                      <TableCell className="font-medium">{listing.address}</TableCell>
                      <TableCell className="font-semibold text-primary">{formatPrice(listing.price)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {listing.beds !== null && <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {listing.beds}</span>}
                          {listing.baths !== null && <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {listing.baths}</span>}
                          {listing.sqft !== null && <span className="flex items-center gap-1"><Square className="h-3 w-3" /> {listing.sqft}</span>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">{listing.source}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { CreateListingBody, UpdateListingBody, ListListingsQueryParams, GetListingParams, UpdateListingParams, DeleteListingParams } from "@workspace/api-zod";

const router = Router();

// Helper function to get agent ID from request
const getAgentId = (req: any): number => {
  const agentId = req.headers['x-agent-id'] || req.user?.id;
  if (!agentId) {
    throw new Error('Agent ID not found in request');
  }
  return parseInt(agentId.toString(), 10);
};

router.get("/listings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const query = ListListingsQueryParams.parse(req.query);

    const conditions = [eq(listingsTable.agentId, agentId)];
    if (query.status) {
      conditions.push(eq(listingsTable.status, query.status));
    }

    const listings = await db
      .select()
      .from(listingsTable)
      .where(and(...conditions))
      .orderBy(sql`${listingsTable.createdAt} DESC`);

    res.json(listings.map(l => ({
      ...l,
      price: l.price ? parseFloat(l.price.toString()) : null,
      bathrooms: l.baths ? parseFloat(l.baths.toString()) : null,
    })));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/listings", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const body = CreateListingBody.parse(req.body);
    const created = await db
      .insert(listingsTable)
      .values({
        ...body,
        agentId,
        price: body.price?.toString() || null,
        baths: body.baths?.toString() || null,
      })
      .returning();
    const l = created[0];
    res.status(201).json({
      ...l,
      price: l.price ? parseFloat(l.price.toString()) : null,
      bathrooms: l.baths ? parseFloat(l.baths.toString()) : null,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/listings/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = GetListingParams.parse(req.params);
    const listing = await db
      .select()
      .from(listingsTable)
      .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, agentId)))
      .limit(1);

    if (listing.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    const l = listing[0];
    return res.json({
      ...l,
      price: l.price ? parseFloat(l.price.toString()) : null,
      bathrooms: l.baths ? parseFloat(l.baths.toString()) : null,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/listings/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = UpdateListingParams.parse(req.params);
    const body = UpdateListingBody.parse(req.body);
    const updated = await db
      .update(listingsTable)
      .set({
        ...body,
        price: body.price?.toString() || null,
        baths: body.baths?.toString() || null,
        updatedAt: new Date(),
      })
      .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, agentId)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    const l = updated[0];
    return res.json({
      ...l,
      price: l.price ? parseFloat(l.price.toString()) : null,
      bathrooms: l.baths ? parseFloat(l.baths.toString()) : null,
    });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

router.delete("/listings/:id", async (req, res) => {
  try {
    const agentId = getAgentId(req);
    const { id } = DeleteListingParams.parse(req.params);
    const deleted = await db
      .delete(listingsTable)
      .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, agentId)))
      .returning();
      
    if (deleted.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

export default router;

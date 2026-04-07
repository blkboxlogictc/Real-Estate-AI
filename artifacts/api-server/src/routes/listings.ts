import { Router } from "express";
import { db } from "@workspace/db";
import { listingsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { CreateListingBody, UpdateListingBody, ListListingsQueryParams, GetListingParams, UpdateListingParams, DeleteListingParams } from "@workspace/api-zod";

const router = Router();
const DEMO_AGENT_ID = 1;

router.get("/listings", async (req, res) => {
  const query = ListListingsQueryParams.parse(req.query);

  const conditions = [eq(listingsTable.agentId, DEMO_AGENT_ID)];
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
    price: l.price ? parseFloat(l.price) : null,
    baths: l.baths ? parseFloat(l.baths) : null,
  })));
});

router.post("/listings", async (req, res) => {
  const body = CreateListingBody.parse(req.body);
  const created = await db
    .insert(listingsTable)
    .values({
      ...body,
      agentId: DEMO_AGENT_ID,
      price: body.price?.toString(),
      baths: body.baths?.toString(),
    })
    .returning();
  const l = created[0];
  res.status(201).json({
    ...l,
    price: l.price ? parseFloat(l.price) : null,
    baths: l.baths ? parseFloat(l.baths) : null,
  });
});

router.get("/listings/:id", async (req, res) => {
  const { id } = GetListingParams.parse(req.params);
  const listing = await db
    .select()
    .from(listingsTable)
    .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, DEMO_AGENT_ID)))
    .limit(1);

  if (listing.length === 0) return res.status(404).json({ error: "Not found" });
  const l = listing[0];
  res.json({
    ...l,
    price: l.price ? parseFloat(l.price) : null,
    baths: l.baths ? parseFloat(l.baths) : null,
  });
});

router.put("/listings/:id", async (req, res) => {
  const { id } = UpdateListingParams.parse(req.params);
  const body = UpdateListingBody.parse(req.body);
  const updated = await db
    .update(listingsTable)
    .set({
      ...body,
      price: body.price?.toString(),
      baths: body.baths?.toString(),
      updatedAt: new Date(),
    })
    .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, DEMO_AGENT_ID)))
    .returning();
  if (updated.length === 0) return res.status(404).json({ error: "Not found" });
  const l = updated[0];
  res.json({
    ...l,
    price: l.price ? parseFloat(l.price) : null,
    baths: l.baths ? parseFloat(l.baths) : null,
  });
});

router.delete("/listings/:id", async (req, res) => {
  const { id } = DeleteListingParams.parse(req.params);
  await db
    .delete(listingsTable)
    .where(and(eq(listingsTable.id, id), eq(listingsTable.agentId, DEMO_AGENT_ID)));
  res.status(204).send();
});

export default router;

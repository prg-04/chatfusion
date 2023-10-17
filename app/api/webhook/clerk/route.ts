import { Webhook, WebhookRequiredHeaders } from "svix";
import { parse } from "url";

import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted";

type Event = {
  data: Record<string, string | number | Record<string, string>[]>;
  object: "event";
  type: EventType;
};

export default async (request) => {
  const { pathname } = parse(request.url);
  const isWebhookEndpoint = pathname === "/api/your-webhook-endpoint";

  if (!isWebhookEndpoint || request.method !== "POST") {
    return new Response("Not Found", { status: 404 });
  }

  const payload = await request.json();
  const headers = request.headers;

  const heads = {
    "svix-id": headers.get("svix-id"),
    "svix-timestamp": headers.get("svix-timestamp"),
    "svix-signature": headers.get("svix-signature"),
  };

  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    return new Response(JSON.stringify({ message: err }), { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  if (eventType === "organization.created") {
    const { id, name, slug, logo_url, image_url, created_by } =
      evnt?.data ?? {};

    try {
      await createCommunity(
        id,
        name,
        slug,
        logo_url || image_url,
        "org bio",
        created_by
      );

      return new Response(JSON.stringify({ message: "User created" }), {
        status: 201,
      });
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }

  return new Response(JSON.stringify({ message: "Unhandled event type" }), {
    status: 400,
  });
};

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GalleryView from "@/components/GalleryView";

const VALID_ROOMS = ["all", "pobots", "prestlers", "cultural", "pisc", "submissions", "favourites", "nacky"];

/**
 * /gallery/[room] — Room view.
 *
 * This is a client component because GalleryView is heavily stateful
 * (lightbox, favourites, search, view modes, etc.) and uses hooks throughout.
 *
 * We read the [room] param via useParams() and pass it to GalleryView as
 * initialRoom. Invalid rooms are handled by GalleryView's "no results" state.
 *
 * Note: this could be a server component with generateStaticParams, but
 * doing so would require splitting GalleryView into server + client parts,
 * which is a much bigger refactor. For now, client-side is fine — the data
 * is cached at the API layer anyway.
 */
export default function RoomPage() {
  const params = useParams<{ room: string }>();
  const room = params?.room ?? "all";
  const [roomKey, setRoomKey] = useState(0);

  // Force GalleryView to remount when room changes (so internal state resets)
  useEffect(() => {
    setRoomKey((k) => k + 1);
  }, [room]);

  // Validate room — if invalid, GalleryView will show "no results"
  const safeRoom = VALID_ROOMS.includes(room) ? room : "all";

  return <GalleryView key={roomKey} initialRoom={safeRoom} />;
}

"use client";

import BloxFighter2D from "./dylan/blox_figther_2d/BloxFighter2D";
import MayPlaneUpdate from "./dylan/may_plane_update/MayPlaneUpdate";
import type { Kid } from "@/src/data/types";

type ReactGamePlayerProps = {
  kid: Kid;
  gameId: string;
};

export default function ReactGamePlayer({ kid, gameId }: ReactGamePlayerProps) {
  if (kid === "dylan" && gameId === "blox_figther_2d") {
    return <BloxFighter2D />;
  }

  if (kid === "dylan" && gameId === "may_plane_update") {
    return <MayPlaneUpdate />;
  }

  return null;
}

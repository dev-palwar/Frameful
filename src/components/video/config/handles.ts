export const HANDLES = [
  { id: "nw", cursor: "nwse-resize", top: -5,      left:   -5,    dx: -1, dy: -1 },
  { id: "n",  cursor: "ns-resize",   top: -5,      left: "50%",   dx:  0, dy: -1 },
  { id: "ne", cursor: "nesw-resize", top: -5,      right:  -5,    dx:  1, dy: -1 },
  { id: "w",  cursor: "ew-resize",   top: "50%",   left:   -5,    dx: -1, dy:  0 },
  { id: "e",  cursor: "ew-resize",   top: "50%",   right:  -5,    dx:  1, dy:  0 },
  { id: "sw", cursor: "nesw-resize", bottom: -5,   left:   -5,    dx: -1, dy:  1 },
  { id: "s",  cursor: "ns-resize",   bottom: -5,   left: "50%",   dx:  0, dy:  1 },
  { id: "se", cursor: "nwse-resize", bottom: -5,   right:  -5,    dx:  1, dy:  1 },
] as const;

export type HandleDescriptor = (typeof HANDLES)[number];

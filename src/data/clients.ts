export interface Client {
  name: string;
  logo?: string; // Will add actual logo paths later
}

export const clients: Client[] = [
  { name: "Google" },
  { name: "Universal Audio" },
  { name: "Iterra" },
  { name: "BILTFOUR" },
  { name: "Anthropic" },
  { name: "Vercel" },
  { name: "Figma" },
  { name: "Stripe" },
];

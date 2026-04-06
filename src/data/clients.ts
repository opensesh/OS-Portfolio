export interface Client {
  name: string;
  logo: string;
  url: string;
}

export const clients: Client[] = [
  { name: "Google", logo: "/logos/clients/google.svg", url: "https://google.com" },
  { name: "Universal Audio", logo: "/logos/clients/universal-audio.svg", url: "https://www.uaudio.com" },
  { name: "Iterra", logo: "/logos/clients/iterra.svg", url: "https://iterra.co" },
  { name: "BILTFOUR", logo: "/logos/clients/biltfour.svg", url: "https://biltfour.com" },
  { name: "Fitbit", logo: "/logos/clients/fitbit.svg", url: "https://www.fitbit.com" },
  { name: "Jalapajar", logo: "/logos/clients/jalapajar.svg", url: "https://jalapajar.com" },
  { name: "SAP", logo: "/logos/clients/sap.svg", url: "https://www.sap.com" },
  { name: "Salesforce", logo: "/logos/clients/salesforce.svg", url: "https://www.salesforce.com" },
];

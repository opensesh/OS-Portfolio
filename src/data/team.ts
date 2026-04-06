export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const team: TeamMember[] = [
  {
    id: "alex",
    name: "Alex Bouhdary",
    role: "Founder & Creative Director",
    bio: "Alex leads Open Session's creative vision, bringing over 15 years of experience in brand design and digital products.",
    social: {
      linkedin: "https://linkedin.com/in/alexbouhdary",
      github: "https://github.com/alexbouhdary",
    },
  },
  // Add more team members as needed
];

export const showcase: TeamMember[] = [
  {
    id: "karim",
    name: "Karim",
    role: "Co-Founder & CEO",
    bio: "Karim drives the strategic vision behind Open Session, bridging creative ambition with business impact to help brands find their voice.",
    image: "/images/team/karim.webp",
    social: {
      linkedin: "https://linkedin.com/in/karim",
    },
  },
  {
    id: "morgan",
    name: "Morgan",
    role: "Co-Founder & COO",
    bio: "Morgan brings operational excellence and creative leadership, ensuring every project delivers on its promise from concept to launch.",
    image: "/images/team/morgan.webp",
    social: {
      linkedin: "https://linkedin.com/in/morgan",
    },
  },
];

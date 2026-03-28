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

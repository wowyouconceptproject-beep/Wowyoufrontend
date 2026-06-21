export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;

  events?: {
    id: string;
    title: string;
  }[];
}
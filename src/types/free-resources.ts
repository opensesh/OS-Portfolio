// TEMPLATE: replace with your content

export type ResourceBadge = 'live' | 'coming-soon';

export interface ResourceMedia {
  type: 'image' | 'video';
  src: string;
}

export interface FreeResource {
  id: string;
  badge: ResourceBadge;
  media: ResourceMedia;
  hoverImage?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
}

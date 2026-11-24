export type ListingType = "sale" | "rent";
export type PropertyCategory = "apartment" | "villa" | "house" | "plot" | "commercial";
export type Furnishing = "furnished" | "semi-furnished" | "unfurnished";
export type PosterRole = "owner" | "agent" | "builder";
export type PublishStatus = "draft" | "published";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type InboxStatus = "new" | "contacted" | "closed";
export type UserRole = "admin" | "editor" | "viewer";

/** Mirrors the public site's Property model, plus admin-only fields (status, createdAt). */
export interface Property {
  id: string;
  title: string;
  description: string;
  /** Total price for sale, monthly rent for rent (INR). */
  price: number;
  type: ListingType;
  category: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  address: string;
  locality: string;
  city: string;
  district?: string;
  image?: string;
  furnishing?: Furnishing;
  /** e.g. "Ready to move", "Under construction", "Dec 2027" */
  possession: string;
  amenities: string[];
  posterName: string;
  posterRole: PosterRole;
  featured: boolean;
  /** "Verified by Havenly" badge. */
  verified: boolean;
  status: PublishStatus;
  /** ISO date; the site shows "Posted N days ago" from this. */
  createdAt: string;
}

/** A property posted by a visitor via /post-property, waiting for review. */
export interface Submission {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: PosterRole;
  type: ListingType;
  category: PropertyCategory;
  city: string;
  locality: string;
  price: number;
  areaSqft: number;
  description: string;
  status: ReviewStatus;
  createdAt: string;
}

/** A buyer/tenant requirement posted via /post-requirement. */
export interface Requirement {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: ListingType;
  category: PropertyCategory;
  city: string;
  locality?: string;
  budget: number;
  notes?: string;
  status: InboxStatus;
  createdAt: string;
}

/** Any lead from the public site: contact form, property enquiry, service enquiry, loan call-back. */
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: "contact" | "property" | "service" | "callback";
  /** Property reference (HVN1001) or service name, when relevant. */
  subject?: string;
  iAm?: "buyer" | "agent";
  message: string;
  status: InboxStatus;
  createdAt: string;
}

export interface Service {
  id: string;
  /** Anchor on /services: legal, registration, building. */
  slug: string;
  title: string;
  summary: string;
  points: string[];
  status: PublishStatus;
  createdAt: string;
}

/** A "Property guide" on /blog. */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** e.g. Buying guide, Finance, NRI guide, Legal */
  category: string;
  readMins: number;
  body: string;
  status: PublishStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
}

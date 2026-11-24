import type { Furnishing, ListingType, PosterRole, PropertyCategory } from "@/types";

/** Cities offered on the public site (search, post-property, post-requirement). */
export const cities = [
  "Bengaluru",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Gurugram",
  "Chennai",
  "Kochi",
  "Thiruvananthapuram",
  "Kozhikode",
  "Thrissur",
] as const;

export const keralaDistricts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
] as const;

export const categoryLabels: Record<PropertyCategory, string> = {
  apartment: "Apartment",
  villa: "Villa",
  house: "Independent house",
  plot: "Plot / Land",
  commercial: "Commercial",
};

export const listingTypeLabels: Record<ListingType, string> = {
  sale: "For sale",
  rent: "For rent",
};

export const furnishingLabels: Record<Furnishing, string> = {
  furnished: "Furnished",
  "semi-furnished": "Semi furnished",
  unfurnished: "Unfurnished",
};

export const posterRoleLabels: Record<PosterRole, string> = {
  owner: "Owner",
  agent: "Agent",
  builder: "Builder",
};

export const possessionOptions = [
  "Ready to move",
  "Under construction",
  "Within 3 months",
  "Within 6 months",
];

export const amenityOptions = [
  "Swimming pool",
  "Gym",
  "Clubhouse",
  "24x7 security",
  "Power backup",
  "Covered parking",
  "Kids play area",
  "Lift",
  "Garden",
  "CCTV",
  "Gated community",
  "Water supply 24x7",
];

export const serviceSlugs = ["legal", "registration", "building"] as const;

export const guideCategories = ["Buying guide", "Finance", "NRI guide", "Legal"];

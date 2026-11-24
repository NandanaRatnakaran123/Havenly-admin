import {
  blogSeed,
  enquiriesSeed,
  propertiesSeed,
  requirementsSeed,
  servicesSeed,
  submissionsSeed,
  usersSeed,
} from "@/data/seed";
import { createResource } from "@/lib/resource";
import type {
  AdminUser,
  BlogPost,
  Enquiry,
  Property,
  Requirement,
  Service,
  Submission,
} from "@/types";

export const propertiesApi = createResource<Property>("/properties", propertiesSeed, [
  "title",
  "city",
  "locality",
  "category",
  "posterName",
]);
export const submissionsApi = createResource<Submission>("/submissions", submissionsSeed, [
  "name",
  "city",
  "locality",
  "phone",
  "description",
]);
export const requirementsApi = createResource<Requirement>("/requirements", requirementsSeed, [
  "name",
  "city",
  "locality",
  "phone",
  "notes",
]);
export const enquiriesApi = createResource<Enquiry>("/enquiries", enquiriesSeed, [
  "name",
  "email",
  "phone",
  "message",
  "subject",
]);
export const servicesApi = createResource<Service>("/services", servicesSeed, [
  "title",
  "summary",
  "slug",
]);
export const blogApi = createResource<BlogPost>("/blog", blogSeed, ["title", "category", "slug"]);
export const usersApi = createResource<AdminUser>("/users", usersSeed, ["name", "email", "role"]);

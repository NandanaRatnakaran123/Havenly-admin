import {
  BookOpen,
  Building2,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { sectionRoles } from "@/config/access";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles that can see this item. */
  roles: UserRole[];
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard, roles: sectionRoles["/"] },
  { label: "Properties", href: "/properties", icon: Building2, roles: sectionRoles["/properties"] },
  { label: "Submissions", href: "/submissions", icon: Inbox, roles: sectionRoles["/submissions"] },
  {
    label: "Requirements",
    href: "/requirements",
    icon: ClipboardList,
    roles: sectionRoles["/requirements"],
  },
  {
    label: "Enquiries",
    href: "/enquiries",
    icon: MessageSquare,
    roles: sectionRoles["/enquiries"],
  },
  { label: "Services", href: "/services", icon: Wrench, roles: sectionRoles["/services"] },
  { label: "Blog", href: "/blog", icon: BookOpen, roles: sectionRoles["/blog"] },
  { label: "Users", href: "/users", icon: Users, roles: sectionRoles["/users"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: sectionRoles["/settings"] },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

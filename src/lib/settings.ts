import { api } from "@/lib/api";
import { USE_MOCKS } from "@/lib/resource";
import type { SiteSettings } from "@/types";

let mockSettings: SiteSettings = {
  siteName: "Havenly",
  supportEmail: "support@havenly.local",
  supportPhone: "+91 98765 43210",
  whatsappNumber: "919876543210",
};

export const settingsApi = {
  async get(): Promise<SiteSettings> {
    if (!USE_MOCKS) return api<SiteSettings>("/settings");
    return { ...mockSettings };
  },
  async save(values: SiteSettings): Promise<SiteSettings> {
    if (!USE_MOCKS)
      return api<SiteSettings>("/settings", { method: "PUT", body: JSON.stringify(values) });
    mockSettings = { ...values };
    return { ...mockSettings };
  },
};

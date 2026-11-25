export interface Plan {
  id: string;
  name: string;
  /** INR per month. 0 = free. */
  price: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    tagline: "For getting started",
    features: ["Up to 3 active listings", "Standard placement", "Email support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    tagline: "For active owners and agents",
    features: [
      "Up to 25 active listings",
      "Priority placement in search",
      "Verified by Havenly badge",
      "Phone and WhatsApp support",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    price: 2999,
    tagline: "For builders and agencies",
    features: [
      "Unlimited listings",
      "Featured listings included",
      "Verified by Havenly badge",
      "Dedicated account manager",
    ],
  },
];

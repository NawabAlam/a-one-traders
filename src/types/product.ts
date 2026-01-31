export type Attribute = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  priceType: "starting" | "fixed" | "on_request";
  price?: number | null;
  minimumOrderQty?: number;
  description?: string;
  attributes?: Attribute[];

  // ✅ ADD THIS
  images?: string[];

  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

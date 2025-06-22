export interface ListingUser {
  avatar?: {
    url: string;
    publicId: string;
  };
  _id: string;
  username: string;
  fullname: string;
}
export interface HouseSpecifications {
  type: "apartment" | "house" | "land" | "other";
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export interface ListingImage {
  url: string;
  publicId: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  sellingPrice?: number;
  rentalPrice?: number;
  discountedPrice: number;
  location: string;
  images: ListingImage[];
  user: ListingUser;
  type: "rent" | "sale";
  houseSpecifications: HouseSpecifications;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingData {
  title: string;
  description: string;
  sellingPrice?: number;
  rentalPrice?: number;
  discountedPrice?: number;
  location: string;
  type: "rent" | "sale";
  houseSpecifications: HouseSpecifications;
  images?: File[];
}

export interface ListingResponse {
  message: string;
  listing: Listing;
}

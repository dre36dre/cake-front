export interface Produto {
  id: number | null;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

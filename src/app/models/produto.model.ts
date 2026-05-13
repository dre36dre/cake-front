export interface Produto {
  id: number | null;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

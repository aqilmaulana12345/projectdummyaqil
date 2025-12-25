export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
}

export interface Category {
  id: string | number | null | undefined;
  slug: string;
  name: string;
  url: string;
}


export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

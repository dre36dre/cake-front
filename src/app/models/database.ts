export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          available: boolean;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string;
          price: number;
          available?: boolean;
          image_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
        Relationships: [];
      };
      home_images: {
        Row: {
          id: number;
          title: string;
          image_url: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          image_url: string;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['home_images']['Insert']>;
        Relationships: [];
      };
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

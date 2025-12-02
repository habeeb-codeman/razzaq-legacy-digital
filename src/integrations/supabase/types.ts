export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bill_items: {
        Row: {
          bill_id: string
          cgst_amount: number
          cgst_rate: number
          created_at: string
          description: string
          hsn_sac: string
          id: string
          product_id: string | null
          quantity: number
          rate: number
          sgst_amount: number
          sgst_rate: number
          taxable_value: number
          total_amount: number
          unit: string
        }
        Insert: {
          bill_id: string
          cgst_amount: number
          cgst_rate?: number
          created_at?: string
          description: string
          hsn_sac?: string
          id?: string
          product_id?: string | null
          quantity?: number
          rate: number
          sgst_amount: number
          sgst_rate?: number
          taxable_value: number
          total_amount: number
          unit?: string
        }
        Update: {
          bill_id?: string
          cgst_amount?: number
          cgst_rate?: number
          created_at?: string
          description?: string
          hsn_sac?: string
          id?: string
          product_id?: string | null
          quantity?: number
          rate?: number
          sgst_amount?: number
          sgst_rate?: number
          taxable_value?: number
          total_amount?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          bill_number: string
          cgst_amount: number
          created_at: string
          created_by: string | null
          id: string
          invoice_date: string
          notes: string | null
          party_address: string | null
          party_gstin: string | null
          party_name: string
          party_phone: string | null
          pdf_url: string | null
          place_of_supply: string
          remaining_amount: number
          sgst_amount: number
          subtotal: number
          total_amount: number
          total_tax: number
          updated_at: string
        }
        Insert: {
          bill_number: string
          cgst_amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_date?: string
          notes?: string | null
          party_address?: string | null
          party_gstin?: string | null
          party_name: string
          party_phone?: string | null
          pdf_url?: string | null
          place_of_supply?: string
          remaining_amount?: number
          sgst_amount?: number
          subtotal?: number
          total_amount?: number
          total_tax?: number
          updated_at?: string
        }
        Update: {
          bill_number?: string
          cgst_amount?: number
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_date?: string
          notes?: string | null
          party_address?: string | null
          party_gstin?: string | null
          party_name?: string
          party_phone?: string | null
          pdf_url?: string | null
          place_of_supply?: string
          remaining_amount?: number
          sgst_amount?: number
          subtotal?: number
          total_amount?: number
          total_tax?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: Json
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: Json
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_location_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_location: Database["public"]["Enums"]["product_location"]
          notes: string | null
          old_location: Database["public"]["Enums"]["product_location"] | null
          product_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_location: Database["public"]["Enums"]["product_location"]
          notes?: string | null
          old_location?: Database["public"]["Enums"]["product_location"] | null
          product_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_location?: Database["public"]["Enums"]["product_location"]
          notes?: string | null
          old_location?: Database["public"]["Enums"]["product_location"] | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_location_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          images: Json | null
          location: Database["public"]["Enums"]["product_location"] | null
          low_stock_threshold: number | null
          name: string
          phone: string | null
          price: number | null
          product_code: string
          published: boolean
          short_description: string | null
          sku: string | null
          slug: string
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          location?: Database["public"]["Enums"]["product_location"] | null
          low_stock_threshold?: number | null
          name: string
          phone?: string | null
          price?: number | null
          product_code: string
          published?: boolean
          short_description?: string | null
          sku?: string | null
          slug: string
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          location?: Database["public"]["Enums"]["product_location"] | null
          low_stock_threshold?: number | null
          name?: string
          phone?: string | null
          price?: number | null
          product_code?: string
          published?: boolean
          short_description?: string | null
          sku?: string | null
          slug?: string
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_bill_number: { Args: never; Returns: string }
      generate_product_code:
        | { Args: { p_location: string }; Returns: string }
        | { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      product_location: "RA1" | "RA2" | "RA3" | "RA4"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      product_location: ["RA1", "RA2", "RA3", "RA4"],
    },
  },
} as const

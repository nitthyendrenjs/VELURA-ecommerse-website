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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string | null
          line1: string
          line2: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          phone: string
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          phone?: string
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          min_order_value: number
          starts_at: string | null
          type: string
          updated_at: string
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          min_order_value?: number
          starts_at?: string | null
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          min_order_value?: number
          starts_at?: string | null
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      ndr_cases: {
        Row: {
          action: string | null
          action_payload: Json | null
          attempts: number
          awb: string | null
          created_at: string
          id: string
          reason: string | null
          resolved_at: string | null
          shipment_id: string
          status: string
          updated_at: string
        }
        Insert: {
          action?: string | null
          action_payload?: Json | null
          attempts?: number
          awb?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          resolved_at?: string | null
          shipment_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          action?: string | null
          action_payload?: Json | null
          attempts?: number
          awb?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          resolved_at?: string | null
          shipment_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ndr_cases_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_log: {
        Row: {
          channel: string
          created_at: string
          error: string | null
          id: string
          order_id: string | null
          payload: Json | null
          recipient: string
          shipment_id: string | null
          status: string
          template: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          recipient: string
          shipment_id?: string | null
          status?: string
          template?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          recipient?: string
          shipment_id?: string | null
          status?: string
          template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_log_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          total: number
          unit_price: number
          variant: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total?: number
          unit_price?: number
          variant?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total?: number
          unit_price?: number
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          channel: string
          created_at: string
          customer_name: string
          discount_amount: number
          discount_code: string | null
          email: string
          fulfillment_status: string
          id: string
          notes: string | null
          order_number: string
          payment_mode: string
          payment_status: string
          phone: string
          shipping_city: string
          shipping_country: string
          shipping_fee: number
          shipping_line1: string
          shipping_line2: string | null
          shipping_pincode: string
          shipping_state: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          channel?: string
          created_at?: string
          customer_name: string
          discount_amount?: number
          discount_code?: string | null
          email: string
          fulfillment_status?: string
          id?: string
          notes?: string | null
          order_number: string
          payment_mode?: string
          payment_status?: string
          phone: string
          shipping_city: string
          shipping_country?: string
          shipping_fee?: number
          shipping_line1: string
          shipping_line2?: string | null
          shipping_pincode: string
          shipping_state: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          customer_name?: string
          discount_amount?: number
          discount_code?: string | null
          email?: string
          fulfillment_status?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_mode?: string
          payment_status?: string
          phone?: string
          shipping_city?: string
          shipping_country?: string
          shipping_fee?: number
          shipping_line1?: string
          shipping_line2?: string | null
          shipping_pincode?: string
          shipping_state?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          description: string | null
          height_cm: number
          hsn_code: string | null
          id: string
          images: string[]
          is_featured: boolean
          is_new: boolean
          length_cm: number
          low_stock_threshold: number
          name: string
          options: Json
          price: number
          rating: number
          review_count: number
          sku: string | null
          slug: string
          status: string
          stock: number
          tags: string[]
          tax_rate: number
          updated_at: string
          weight_grams: number
          width_cm: number
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          height_cm?: number
          hsn_code?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          is_new?: boolean
          length_cm?: number
          low_stock_threshold?: number
          name: string
          options?: Json
          price?: number
          rating?: number
          review_count?: number
          sku?: string | null
          slug: string
          status?: string
          stock?: number
          tags?: string[]
          tax_rate?: number
          updated_at?: string
          weight_grams?: number
          width_cm?: number
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          height_cm?: number
          hsn_code?: string | null
          id?: string
          images?: string[]
          is_featured?: boolean
          is_new?: boolean
          length_cm?: number
          low_stock_threshold?: number
          name?: string
          options?: Json
          price?: number
          rating?: number
          review_count?: number
          sku?: string | null
          slug?: string
          status?: string
          stock?: number
          tags?: string[]
          tax_rate?: number
          updated_at?: string
          weight_grams?: number
          width_cm?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shipment_events: {
        Row: {
          created_at: string
          detail: string | null
          event_time: string
          id: string
          location: string | null
          raw: Json | null
          shipment_id: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          event_time?: string
          id?: string
          location?: string | null
          raw?: Json | null
          shipment_id: string
          status: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          event_time?: string
          id?: string
          location?: string | null
          raw?: Json | null
          shipment_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          awb: string | null
          carrier: string
          created_at: string
          expected_delivery: string | null
          id: string
          is_reverse: boolean
          label_url: string | null
          last_synced_at: string | null
          order_id: string
          payment_mode: string
          pickup_date: string | null
          pickup_id: string | null
          qc_payload: Json | null
          qc_required: boolean
          raw: Json | null
          shipping_cost: number | null
          status: string
          status_detail: string | null
          updated_at: string
          warehouse_id: string | null
          weight_grams: number | null
        }
        Insert: {
          awb?: string | null
          carrier?: string
          created_at?: string
          expected_delivery?: string | null
          id?: string
          is_reverse?: boolean
          label_url?: string | null
          last_synced_at?: string | null
          order_id: string
          payment_mode?: string
          pickup_date?: string | null
          pickup_id?: string | null
          qc_payload?: Json | null
          qc_required?: boolean
          raw?: Json | null
          shipping_cost?: number | null
          status?: string
          status_detail?: string | null
          updated_at?: string
          warehouse_id?: string | null
          weight_grams?: number | null
        }
        Update: {
          awb?: string | null
          carrier?: string
          created_at?: string
          expected_delivery?: string | null
          id?: string
          is_reverse?: boolean
          label_url?: string | null
          last_synced_at?: string | null
          order_id?: string
          payment_mode?: string
          pickup_date?: string | null
          pickup_id?: string | null
          qc_payload?: Json | null
          qc_required?: boolean
          raw?: Json | null
          shipping_cost?: number | null
          status?: string
          status_detail?: string | null
          updated_at?: string
          warehouse_id?: string | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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
      warehouses: {
        Row: {
          address: string
          city: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          is_default: boolean
          name: string
          phone: string | null
          pincode: string
          registered_name: string | null
          return_address: string | null
          return_city: string | null
          return_pincode: string | null
          return_state: string | null
          state: string | null
          synced_with_carrier: boolean
          updated_at: string
        }
        Insert: {
          address: string
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          name: string
          phone?: string | null
          pincode: string
          registered_name?: string | null
          return_address?: string | null
          return_city?: string | null
          return_pincode?: string | null
          return_state?: string | null
          state?: string | null
          synced_with_carrier?: boolean
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          name?: string
          phone?: string | null
          pincode?: string
          registered_name?: string | null
          return_address?: string | null
          return_city?: string | null
          return_pincode?: string | null
          return_state?: string | null
          state?: string | null
          synced_with_carrier?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      next_order_number: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
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
      app_role: ["admin", "staff", "customer"],
    },
  },
} as const

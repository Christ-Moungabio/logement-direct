// Fichier généré par `npm run db:types` : ne pas modifier à la main.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      listing_photos: {
        Row: {
          created_at: string;
          file_size_bytes: number;
          id: string;
          is_primary: boolean;
          listing_id: string;
          mime_type: string;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          created_at?: string;
          file_size_bytes: number;
          id?: string;
          is_primary?: boolean;
          listing_id: string;
          mime_type: string;
          sort_order: number;
          storage_path: string;
        };
        Update: {
          created_at?: string;
          file_size_bytes?: number;
          id?: string;
          is_primary?: boolean;
          listing_id?: string;
          mime_type?: string;
          sort_order?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listing_photos_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "public_listings";
            referencedColumns: ["id"];
          },
        ];
      };
      listings: {
        Row: {
          advance_months: number | null;
          availability:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from: string | null;
          city_id: string | null;
          close_reason: Database["public"]["Enums"]["close_reason"] | null;
          created_at: string;
          description: string | null;
          doors_count: number | null;
          electricity: Database["public"]["Enums"]["utility_status"] | null;
          hidden_reason: string | null;
          id: string;
          monthly_rent: number | null;
          neighborhood_id: string | null;
          owner_id: string;
          property_type_id: number | null;
          published_at: string | null;
          status: Database["public"]["Enums"]["listing_status"];
          updated_at: string;
          visible_from: string | null;
          water: Database["public"]["Enums"]["utility_status"] | null;
        };
        Insert: {
          advance_months?: number | null;
          availability?:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from?: string | null;
          city_id?: string | null;
          close_reason?: Database["public"]["Enums"]["close_reason"] | null;
          created_at?: string;
          description?: string | null;
          doors_count?: number | null;
          electricity?: Database["public"]["Enums"]["utility_status"] | null;
          hidden_reason?: string | null;
          id?: string;
          monthly_rent?: number | null;
          neighborhood_id?: string | null;
          owner_id: string;
          property_type_id?: number | null;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          updated_at?: string;
          visible_from?: string | null;
          water?: Database["public"]["Enums"]["utility_status"] | null;
        };
        Update: {
          advance_months?: number | null;
          availability?:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from?: string | null;
          city_id?: string | null;
          close_reason?: Database["public"]["Enums"]["close_reason"] | null;
          created_at?: string;
          description?: string | null;
          doors_count?: number | null;
          electricity?: Database["public"]["Enums"]["utility_status"] | null;
          hidden_reason?: string | null;
          id?: string;
          monthly_rent?: number | null;
          neighborhood_id?: string | null;
          owner_id?: string;
          property_type_id?: number | null;
          published_at?: string | null;
          status?: Database["public"]["Enums"]["listing_status"];
          updated_at?: string;
          visible_from?: string | null;
          water?: Database["public"]["Enums"]["utility_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "listings_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_neighborhood_matches_city";
            columns: ["neighborhood_id", "city_id"];
            isOneToOne: false;
            referencedRelation: "neighborhoods";
            referencedColumns: ["id", "city_id"];
          },
          {
            foreignKeyName: "listings_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_property_type_id_fkey";
            columns: ["property_type_id"];
            isOneToOne: false;
            referencedRelation: "property_types";
            referencedColumns: ["id"];
          },
        ];
      };
      neighborhoods: {
        Row: {
          city_id: string;
          id: string;
          name: string;
        };
        Insert: {
          city_id: string;
          id?: string;
          name: string;
        };
        Update: {
          city_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "neighborhoods_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          city_id: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["account_role"];
          terms_accepted_at: string;
          updated_at: string;
          whatsapp_number: string;
        };
        Insert: {
          city_id?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["account_role"];
          terms_accepted_at: string;
          updated_at?: string;
          whatsapp_number: string;
        };
        Update: {
          city_id?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          role?: Database["public"]["Enums"]["account_role"];
          terms_accepted_at?: string;
          updated_at?: string;
          whatsapp_number?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
        ];
      };
      property_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          comment: string | null;
          created_at: string;
          handled_at: string | null;
          handled_by: string | null;
          id: string;
          listing_id: string | null;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id: string;
          status: Database["public"]["Enums"]["report_status"];
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          listing_id?: string | null;
          reason: Database["public"]["Enums"]["report_reason"];
          reporter_id: string;
          status?: Database["public"]["Enums"]["report_status"];
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          handled_at?: string | null;
          handled_by?: string | null;
          id?: string;
          listing_id?: string | null;
          reason?: Database["public"]["Enums"]["report_reason"];
          reporter_id?: string;
          status?: Database["public"]["Enums"]["report_status"];
        };
        Relationships: [
          {
            foreignKeyName: "reports_handled_by_fkey";
            columns: ["handled_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "public_listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      public_listings: {
        Row: {
          advance_months: number | null;
          availability:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from: string | null;
          city_id: string | null;
          description: string | null;
          doors_count: number | null;
          electricity: Database["public"]["Enums"]["utility_status"] | null;
          id: string | null;
          monthly_rent: number | null;
          neighborhood_id: string | null;
          owner_id: string | null;
          property_type_id: number | null;
          published_at: string | null;
          updated_at: string | null;
          water: Database["public"]["Enums"]["utility_status"] | null;
        };
        Insert: {
          advance_months?: number | null;
          availability?:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from?: string | null;
          city_id?: string | null;
          description?: string | null;
          doors_count?: number | null;
          electricity?: Database["public"]["Enums"]["utility_status"] | null;
          id?: string | null;
          monthly_rent?: number | null;
          neighborhood_id?: string | null;
          owner_id?: string | null;
          property_type_id?: number | null;
          published_at?: string | null;
          updated_at?: string | null;
          water?: Database["public"]["Enums"]["utility_status"] | null;
        };
        Update: {
          advance_months?: number | null;
          availability?:
            Database["public"]["Enums"]["availability_status"] | null;
          available_from?: string | null;
          city_id?: string | null;
          description?: string | null;
          doors_count?: number | null;
          electricity?: Database["public"]["Enums"]["utility_status"] | null;
          id?: string | null;
          monthly_rent?: number | null;
          neighborhood_id?: string | null;
          owner_id?: string | null;
          property_type_id?: number | null;
          published_at?: string | null;
          updated_at?: string | null;
          water?: Database["public"]["Enums"]["utility_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "listings_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_neighborhood_matches_city";
            columns: ["neighborhood_id", "city_id"];
            isOneToOne: false;
            referencedRelation: "neighborhoods";
            referencedColumns: ["id", "city_id"];
          },
          {
            foreignKeyName: "listings_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "listings_property_type_id_fkey";
            columns: ["property_type_id"];
            isOneToOne: false;
            referencedRelation: "property_types";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      brazzaville_today: { Args: Record<PropertyKey, never>; Returns: string };
      get_listing_contact: {
        Args: { p_listing_id: string };
        Returns: {
          owner_name: string;
          whatsapp_number: string;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      refresh_listing_states: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
    };
    Enums: {
      account_role: "tenant" | "owner" | "admin";
      availability_status: "available" | "available_soon";
      close_reason: "rented" | "withdrawn";
      listing_status: "draft" | "scheduled" | "published" | "closed" | "hidden";
      report_reason: "false_information" | "already_rented" | "scam" | "other";
      report_status: "pending" | "resolved" | "rejected";
      utility_status: "individual" | "shared" | "none";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      account_role: ["tenant", "owner", "admin"],
      availability_status: ["available", "available_soon"],
      close_reason: ["rented", "withdrawn"],
      listing_status: ["draft", "scheduled", "published", "closed", "hidden"],
      report_reason: ["false_information", "already_rented", "scam", "other"],
      report_status: ["pending", "resolved", "rejected"],
      utility_status: ["individual", "shared", "none"],
    },
  },
} as const;

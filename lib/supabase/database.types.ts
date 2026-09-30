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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          reason?: string | null
        }
        Relationships: []
      }
      investigations: {
        Row: {
          content_en: Json | null
          content_es: Json | null
          cover_path: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          summary_en: string
          summary_es: string
          title_en: string
          title_es: string
          updated_at: string
        }
        Insert: {
          content_en?: Json | null
          content_es?: Json | null
          cover_path?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          summary_en?: string
          summary_es?: string
          title_en?: string
          title_es: string
          updated_at?: string
        }
        Update: {
          content_en?: Json | null
          content_es?: Json | null
          cover_path?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          summary_en?: string
          summary_es?: string
          title_en?: string
          title_es?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          alt_en: string
          alt_es: string
          caption_en: string | null
          caption_es: string | null
          created_at: string
          id: string
          path: string
          site_id: string
          sort_order: number
        }
        Insert: {
          alt_en?: string
          alt_es?: string
          caption_en?: string | null
          caption_es?: string | null
          created_at?: string
          id?: string
          path: string
          site_id: string
          sort_order?: number
        }
        Update: {
          alt_en?: string
          alt_es?: string
          caption_en?: string | null
          caption_es?: string | null
          created_at?: string
          id?: string
          path?: string
          site_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_images_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "study_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_visits: {
        Row: {
          count: number
          id: number
        }
        Insert: {
          count?: number
          id?: number
        }
        Update: {
          count?: number
          id?: number
        }
        Relationships: []
      }
      study_sites: {
        Row: {
          altitude: string | null
          annual_rate: number | null
          audio_path: string | null
          audio_title_en: string | null
          audio_title_es: string | null
          change_pct: number | null
          content_en: Json | null
          content_es: Json | null
          cover_path: string | null
          created_at: string
          distance_en: string | null
          distance_es: string | null
          id: string
          kind: string
          map_x: number | null
          map_y: number | null
          name: string
          population_2050: number | null
          population_now: number | null
          province: string
          province_id: string
          published: boolean
          slug: string
          sort_order: number
          summary_en: string
          summary_es: string
          tagline_en: string | null
          tagline_es: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          altitude?: string | null
          annual_rate?: number | null
          audio_path?: string | null
          audio_title_en?: string | null
          audio_title_es?: string | null
          change_pct?: number | null
          content_en?: Json | null
          content_es?: Json | null
          cover_path?: string | null
          created_at?: string
          distance_en?: string | null
          distance_es?: string | null
          id?: string
          kind: string
          map_x?: number | null
          map_y?: number | null
          name: string
          population_2050?: number | null
          population_now?: number | null
          province: string
          province_id: string
          published?: boolean
          slug: string
          sort_order?: number
          summary_en?: string
          summary_es?: string
          tagline_en?: string | null
          tagline_es?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          altitude?: string | null
          annual_rate?: number | null
          audio_path?: string | null
          audio_title_en?: string | null
          audio_title_es?: string | null
          change_pct?: number | null
          content_en?: Json | null
          content_es?: Json | null
          cover_path?: string | null
          created_at?: string
          distance_en?: string | null
          distance_es?: string | null
          id?: string
          kind?: string
          map_x?: number | null
          map_y?: number | null
          name?: string
          population_2050?: number | null
          population_now?: number | null
          province?: string
          province_id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          summary_en?: string
          summary_es?: string
          tagline_en?: string | null
          tagline_es?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          audio_path: string | null
          created_at: string
          id: string
          person_detail_en: string | null
          person_detail_es: string | null
          person_name: string
          photo_path: string | null
          published: boolean
          quote_en: string
          quote_es: string
          site_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          audio_path?: string | null
          created_at?: string
          id?: string
          person_detail_en?: string | null
          person_detail_es?: string | null
          person_name: string
          photo_path?: string | null
          published?: boolean
          quote_en?: string
          quote_es: string
          site_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          audio_path?: string | null
          created_at?: string
          id?: string
          person_detail_en?: string | null
          person_detail_es?: string | null
          person_name?: string
          photo_path?: string | null
          published?: boolean
          quote_en?: string
          quote_es?: string
          site_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonies_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "study_sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_visits: { Args: never; Returns: number }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

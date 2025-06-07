export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_distributions: {
        Row: {
          asset_id: string
          created_at: string
          division_project_id: string
          heir_id: string
          id: string
          percentage: number
          updated_at: string
          value: number
        }
        Insert: {
          asset_id: string
          created_at?: string
          division_project_id: string
          heir_id: string
          id?: string
          percentage: number
          updated_at?: string
          value: number
        }
        Update: {
          asset_id?: string
          created_at?: string
          division_project_id?: string
          heir_id?: string
          id?: string
          percentage?: number
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "asset_distributions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_distributions_division_project_id_fkey"
            columns: ["division_project_id"]
            isOneToOne: false
            referencedRelation: "division_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_distributions_heir_id_fkey"
            columns: ["heir_id"]
            isOneToOne: false
            referencedRelation: "heirs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_asset_distributions_asset"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_asset_distributions_division_project"
            columns: ["division_project_id"]
            isOneToOne: false
            referencedRelation: "division_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_asset_distributions_heir"
            columns: ["heir_id"]
            isOneToOne: false
            referencedRelation: "heirs"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          document_number: string | null
          id: string
          location: string | null
          name: string
          type: string
          updated_at: string
          value: number
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          document_number?: string | null
          id?: string
          location?: string | null
          name: string
          type: string
          updated_at?: string
          value: number
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          document_number?: string | null
          id?: string
          location?: string | null
          name?: string
          type?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "assets_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assets_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      case_sessions: {
        Row: {
          case_id: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          session_date: string
          session_type: string
          status: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          session_date: string
          session_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          session_date?: string
          session_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_sessions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          created_at: string
          description: string
          id: string
          priority: string
          resolution: string | null
          status: string
          submitted_by: string
          submitted_date: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          submitted_by: string
          submitted_date?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolution?: string | null
          status?: string
          submitted_by?: string
          submitted_date?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      debts: {
        Row: {
          amount: number
          case_id: string
          created_at: string
          description: string | null
          document_number: string | null
          due_date: string | null
          id: string
          party_name: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          case_id: string
          created_at?: string
          description?: string | null
          document_number?: string | null
          due_date?: string | null
          id?: string
          party_name: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          case_id?: string
          created_at?: string
          description?: string | null
          document_number?: string | null
          due_date?: string | null
          id?: string
          party_name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "debts_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_debts_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          case_id: string
          created_at: string
          description: string
          dispute_type: string
          id: string
          resolution: string | null
          status: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description: string
          dispute_type: string
          id?: string
          resolution?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string
          dispute_type?: string
          id?: string
          resolution?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_disputes_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      division_projects: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          project_type: string
          status: string
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          project_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          project_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "division_projects_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_division_projects_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          case_id: string
          created_at: string
          description: string | null
          document_type: string
          file_path: string
          id: string
          updated_at: string
          upload_date: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description?: string | null
          document_type: string
          file_path: string
          id?: string
          updated_at?: string
          upload_date?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string
          id?: string
          updated_at?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_documents_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_attachments: {
        Row: {
          attachment_type: string
          created_at: string
          description: string | null
          expert_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          updated_at: string
        }
        Insert: {
          attachment_type: string
          created_at?: string
          description?: string | null
          expert_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          updated_at?: string
        }
        Update: {
          attachment_type?: string
          created_at?: string
          description?: string | null
          expert_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_attachments_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          created_at: string
          email: string
          experience_years: number | null
          graduation_year: string | null
          id: string
          name: string
          national_id: string | null
          phone: string
          previous_cases: number
          qualification: string | null
          specialty: string
          status: string
          university: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          experience_years?: number | null
          graduation_year?: string | null
          id?: string
          name: string
          national_id?: string | null
          phone: string
          previous_cases?: number
          qualification?: string | null
          specialty: string
          status?: string
          university?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          experience_years?: number | null
          graduation_year?: string | null
          id?: string
          name?: string
          national_id?: string | null
          phone?: string
          previous_cases?: number
          qualification?: string | null
          specialty?: string
          status?: string
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      heirs: {
        Row: {
          agent_name: string | null
          case_id: string
          contact_info: string | null
          created_at: string
          gender: string
          id: string
          id_number: string | null
          is_minor: boolean
          is_missing: boolean
          is_pregnant: boolean
          name: string
          quota: string | null
          relationship: string
          share_amount: number | null
          share_percentage: number | null
          updated_at: string
        }
        Insert: {
          agent_name?: string | null
          case_id: string
          contact_info?: string | null
          created_at?: string
          gender: string
          id?: string
          id_number?: string | null
          is_minor?: boolean
          is_missing?: boolean
          is_pregnant?: boolean
          name: string
          quota?: string | null
          relationship: string
          share_amount?: number | null
          share_percentage?: number | null
          updated_at?: string
        }
        Update: {
          agent_name?: string | null
          case_id?: string
          contact_info?: string | null
          created_at?: string
          gender?: string
          id?: string
          id_number?: string | null
          is_minor?: boolean
          is_missing?: boolean
          is_pregnant?: boolean
          name?: string
          quota?: string | null
          relationship?: string
          share_amount?: number | null
          share_percentage?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_heirs_case"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "heirs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "inheritance_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      inheritance_cases: {
        Row: {
          assigned_expert: string
          case_number: string
          case_type: string
          comments: string | null
          court_number: string
          created_at: string
          death_certificate_number: string | null
          death_date: string
          deceased_name: string
          id: string
          status: string
          total_estate_value: number | null
          updated_at: string
        }
        Insert: {
          assigned_expert: string
          case_number: string
          case_type: string
          comments?: string | null
          court_number: string
          created_at?: string
          death_certificate_number?: string | null
          death_date: string
          deceased_name: string
          id?: string
          status?: string
          total_estate_value?: number | null
          updated_at?: string
        }
        Update: {
          assigned_expert?: string
          case_number?: string
          case_type?: string
          comments?: string | null
          court_number?: string
          created_at?: string
          death_certificate_number?: string | null
          death_date?: string
          deceased_name?: string
          id?: string
          status?: string
          total_estate_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_inheritance_cases_expert"
            columns: ["assigned_expert"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          language: string | null
          name: string | null
          notifications: Json | null
          phone: string | null
          security: Json | null
          system: Json | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          notifications?: Json | null
          phone?: string | null
          security?: Json | null
          system?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          notifications?: Json | null
          phone?: string | null
          security?: Json | null
          system?: Json | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_any_role: {
        Args: {
          _user_id: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "staff"
        | "judge"
        | "expert"
        | "notary"
        | "inheritance_officer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "staff",
        "judge",
        "expert",
        "notary",
        "inheritance_officer",
      ],
    },
  },
} as const

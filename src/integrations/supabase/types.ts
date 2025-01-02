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
      organization_registrations: {
        Row: {
          created_at: string
          created_by: string
          csv_file_url: string
          id: string
          org_address: string
          org_email: string
          org_name: string
          unique_code: string
        }
        Insert: {
          created_at?: string
          created_by: string
          csv_file_url: string
          id?: string
          org_address: string
          org_email: string
          org_name: string
          unique_code: string
        }
        Update: {
          created_at?: string
          created_by?: string
          csv_file_url?: string
          id?: string
          org_address?: string
          org_email?: string
          org_name?: string
          unique_code?: string
        }
        Relationships: []
      }
      peer_groups: {
        Row: {
          created_at: string
          created_by: string
          id: string
          members: string[]
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          members: string[]
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          members?: string[]
          name?: string
        }
        Relationships: []
      }
      peer_sessions: {
        Row: {
          created_at: string
          created_by: string
          date: string
          end_time: string
          group_id: string | null
          id: string
          questions: string[]
          session_code: string
          start_time: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          end_time: string
          group_id?: string | null
          id?: string
          questions: string[]
          session_code: string
          start_time: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          end_time?: string
          group_id?: string | null
          id?: string
          questions?: string[]
          session_code?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "peer_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "peer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          college: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          college?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          college?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      question_test_cases: {
        Row: {
          created_at: string
          expected_output: string
          id: string
          input: string
          is_hidden: boolean | null
          question_id: string
        }
        Insert: {
          created_at?: string
          expected_output: string
          id?: string
          input: string
          is_hidden?: boolean | null
          question_id: string
        }
        Update: {
          created_at?: string
          expected_output?: string
          id?: string
          input?: string
          is_hidden?: boolean | null
          question_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          approach: string
          code: string
          created_at: string
          evaluation_feedback: string | null
          evaluation_score: number | null
          id: string
          language: string
          question_id: string
          session_id: string
          space_complexity: string
          test_cases: string
          time_complexity: string
          user_id: string
        }
        Insert: {
          approach: string
          code: string
          created_at?: string
          evaluation_feedback?: string | null
          evaluation_score?: number | null
          id?: string
          language: string
          question_id: string
          session_id: string
          space_complexity: string
          test_cases: string
          time_complexity: string
          user_id: string
        }
        Update: {
          approach?: string
          code?: string
          created_at?: string
          evaluation_feedback?: string | null
          evaluation_score?: number | null
          id?: string
          language?: string
          question_id?: string
          session_id?: string
          space_complexity?: string
          test_cases?: string
          time_complexity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "peer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

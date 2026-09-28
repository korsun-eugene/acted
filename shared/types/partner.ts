
export interface Partner {
  id: number
  code: string
  name: string
  type: string | null
  oblast: string | null
  eligibilityStatus: string | null
}

export interface ImportResult {
  imported: number
  updated: number
  skipped: number
}

export interface PartnersResponse {
  items: Partner[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
}
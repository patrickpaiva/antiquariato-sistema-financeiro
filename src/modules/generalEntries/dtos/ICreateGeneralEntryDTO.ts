export default interface ICreateGeneralEntryDTO {
  date: Date
  description: string
  value: number
  type: string
  status: string
  cost_center: string
  presentation_rubric: string
  specific_rubric: string
  statement_id?: string | null
  created_by: string
  authorized_by?: string
}

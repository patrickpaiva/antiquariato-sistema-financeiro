export default interface ICreateStatementDTO {
  date: Date
  bank_number: number
  account_number: number
  transaction_type: string
  value: number
  transaction_history: string
  transaction_document: string
  created_by: string
  created_manually: boolean
  import_id?: string
}

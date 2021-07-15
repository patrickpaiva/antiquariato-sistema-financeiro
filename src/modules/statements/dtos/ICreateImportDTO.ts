export default interface ICreateImportDTO {
  bank_id: number
  account_id: number
  hash: string
  start_import_date: Date
  end_import_date: Date
  created_by: string
}

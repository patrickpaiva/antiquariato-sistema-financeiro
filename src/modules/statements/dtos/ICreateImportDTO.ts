export default interface ICreateImportDTO {
  bank_number: number
  account_number: number
  hash: string
  start_import_date: Date
  end_import_date: Date
  created_by: string
}

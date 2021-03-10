export default interface IFilterStatementsParamsDTO {
  maxDate?: Date
  minDate?: Date
  maxValue?: number
  minValue?: number
  transaction_type?: 'CREDIT' | 'DEBIT'
}

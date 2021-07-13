import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import { injectable, inject } from 'tsyringe'
import fs from 'fs'
import ofx from 'ofx-convertjs'

interface IImportTransaction {
  date: Date
  bank_id: number
  account_id: number
  transaction_type: string
  value: number
  transaction_history: string
  transaction_document: string
}

interface IOFXTransaction {
  DTPOSTED: string
  TRNTYPE: string
  TRNAMT: string
  MEMO: string
  CHECKNUM: string
}

@injectable()
class ImportStatementsService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async loadTransactions(
    file: Express.Multer.File,
  ): Promise<IImportTransaction[]> {
    const transactions: IImportTransaction[] = []

    const archive = fs.readFileSync(file.path, 'utf-8')
    const data = await ofx.toJson(archive)

    const bankId = data.OFX.BANKMSGSRSV1.BANKACCTFROM.BANKID
    const accountId = data.OFX.BANKMSGSRSV1.BANKACCTFROM.ACCTID

    await data.OFX.BANKMSGSRSV1.BANKTRANLIST.STMTTRN.forEach(
      (item: IOFXTransaction) => {
        const { DTPOSTED } = item

        const date = [
          DTPOSTED.slice(0, 4),
          DTPOSTED.slice(4, 6),
          DTPOSTED.slice(6, 8),
        ].join('/')

        const dateParse = new Date(date)
        const valueParse = item.TRNAMT.replace('.', '')

        transactions.push({
          date: dateParse,
          bank_id: bankId,
          account_id: accountId,
          transaction_type: item.TRNTYPE,
          value: parseInt(valueParse),
          transaction_history: item.MEMO,
          transaction_document: item.CHECKNUM,
        })
      },
    )

    return transactions
  }

  public async execute(
    file: Express.Multer.File,
    created_by: string,
  ): Promise<void> {
    try {
      const transactions = await this.loadTransactions(file)

      transactions.map(async transaction => {
        await this.statementsRepository.create({
          ...transaction,
          created_by,
          created_manually: false,
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export { ImportStatementsService }

import IStatementsRepository from '@modules/statements/repositories/IStatementsRepository'
import { injectable, inject } from 'tsyringe'
import fs from 'fs'
import ofx from 'ofx-convertjs'
import { createHash } from 'crypto'
import IImportsRepository from '../repositories/IImportsRepository'
import AppError from '@shared/errors/AppError'

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

function parseDate(date: string): Date {
  const dateShape = [date.slice(0, 4), date.slice(4, 6), date.slice(6, 8)].join(
    '/',
  )

  const dateParsed = new Date(dateShape)

  return dateParsed
}

@injectable()
class ImportStatementsService {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('ImportsRepository')
    private importsRepository: IImportsRepository,
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
      const archive = fs.readFileSync(file.path, 'utf-8')
      const data = await ofx.toJson(archive)
      const bankId = data.OFX.BANKMSGSRSV1.BANKACCTFROM.BANKID
      const accountId = data.OFX.BANKMSGSRSV1.BANKACCTFROM.ACCTID
      const startDate = parseDate(data.OFX.BANKMSGSRSV1.BANKTRANLIST.DTSTART)
      const endDate = parseDate(data.OFX.BANKMSGSRSV1.BANKTRANLIST.DTEND)

      const crypto = createHash('sha256')
      crypto.update(archive)
      const hash = crypto.digest('base64')

      const findImport = await this.importsRepository.findByHash(hash)

      if (findImport) {
        throw new AppError('Arquivo já foi importado anteriormente', 409)
      }

      const importation = await this.importsRepository.create({
        account_id: accountId,
        bank_id: bankId,
        created_by,
        start_import_date: startDate,
        end_import_date: endDate,
        hash,
      })

      const transactions = await this.loadTransactions(file)

      transactions.map(async transaction => {
        await this.statementsRepository.create({
          ...transaction,
          created_by,
          created_manually: false,
          import_id: importation.id,
        })
      })
    } catch (error) {
      throw new AppError(error)
    }
  }
}

export { ImportStatementsService }

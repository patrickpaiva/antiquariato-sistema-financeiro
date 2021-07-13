declare namespace Express {
  export interface Request {
    user: {
      id: string
    }
    /** `Multer.File` object populated by `single()` middleware. */
    file: Multer.File
    /**
     * Array or dictionary of `Multer.File` object populated by `array()`,
     * `fields()`, and `any()` middleware.
     */
    files:
      | {
          [fieldname: string]: Multer.File[]
        }
      | Multer.File[]
  }
}

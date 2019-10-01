import i18n from 'i18n'
import Email from 'email-templates'

const Mailer = new Email({
  message: {
    from: process.env.MAIL_FROM
  },
  send: true,
  transport: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    i18n: i18n.__,
  }
})

export default Mailer

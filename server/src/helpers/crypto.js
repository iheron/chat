import config from '../../config'
import crypto from 'crypto'
import padStart from 'lodash/padStart'

const secret = config.secret

let sha256Hash = (str) => {
  return crypto.createHmac('sha256', secret).update(str).digest('hex').toString('base64')
}

let base34Hash = (n) => {
  let baseArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let quotient = n
  let mod = 0
  let res = ''
  while (quotient !== 0) {
    mod = quotient % 34
    quotient = Math.floor(quotient / 34)
    res = baseArr[mod] + res
  }
  return padStart(res, 6 , '0')
}

export { sha256Hash, base34Hash }



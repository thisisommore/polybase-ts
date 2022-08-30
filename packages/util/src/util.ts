export function stringifiableToHex (value: any) {
  return hexlify(Buffer.from(JSON.stringify(value)))
}

const HexCharacters: string = '0123456789abcdef'

export type Bytes = ArrayLike<number>;

export type BytesLike = Bytes | string;

export type DataOptions = {
  allowMissingPrefix?: boolean;
  hexPad?: 'left' | 'right' | null;
};

export interface Hexable {
  toHexString(): string;
}

export function hexlify (value: BytesLike | Hexable | number | bigint, options?: DataOptions): string {
  if (!options) { options = { } }

  if (typeof (value) === 'number') {
    checkSafeUint53(value)

    let hex = ''
    while (value) {
      hex = HexCharacters[value & 0xf] + hex
      value = Math.floor(value / 16)
    }

    if (hex.length) {
      if (hex.length % 2) { hex = '0' + hex }
      return '0x' + hex
    }

    return '0x00'
  }

  if (typeof (value) === 'bigint') {
    value = value.toString(16)
    if (value.length % 2) { return ('0x0' + value) }
    return '0x' + value
  }

  if (options.allowMissingPrefix && typeof (value) === 'string' && value.substring(0, 2) !== '0x') {
    value = '0x' + value
  }

  if (isHexable(value)) { return value.toHexString() }

  if (isHexString(value)) {
    if ((<string>value).length % 2) {
      if (options.hexPad === 'left') {
        value = '0x0' + (<string>value).substring(2)
      } else if (options.hexPad === 'right') {
        value += '0'
      } else {
        throw new Error(`hex data is odd-length: ${value}`)
      }
    }
    return (<string>value).toLowerCase()
  }

  if (isBytes(value)) {
    let result = '0x'
    for (let i = 0; i < value.length; i++) {
      const v = value[i]
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f]
    }
    return result
  }

  throw new Error(`invalid hexlify value: ${value}`)
}

export function isBytesLike (value: any): value is BytesLike {
  return ((isHexString(value) && !(value.length % 2)) || isBytes(value))
}

function isInteger (value: number) {
  // eslint-disable-next-line no-self-compare
  return (typeof (value) === 'number' && value === value && (value % 1) === 0)
}

export function isBytes (value: any): value is Bytes {
  if (value == null) { return false }

  if (value.constructor === Uint8Array) { return true }
  if (typeof (value) === 'string') { return false }
  if (!isInteger(value.length) || value.length < 0) { return false }

  for (let i = 0; i < value.length; i++) {
    const v = value[i]
    if (!isInteger(v) || v < 0 || v >= 256) { return false }
  }
  return true
}

export function isHexString (value: any, length?: number): boolean {
  if (typeof (value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }
  if (length && value.length !== 2 + 2 * length) { return false }
  return true
}

function isHexable (value: any): value is Hexable {
  return !!(value.toHexString)
}

function checkSafeUint53 (value: number): void {
  if (typeof (value) !== 'number') return

  if (value < 0 || value >= 0x1fffffffffffff) {
    throw new Error(`Outside safe range: ${value}`)
  }

  if (value % 1) {
    throw new Error(`Value is not integer: ${value}`)
  }
}

export function isNullish (value: any) {
  return value === null || value === undefined
}

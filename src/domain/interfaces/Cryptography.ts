export default interface Cryptography {
  encrypt(plainText: string): Promise<string>;
  compare(plainText: string, encryptedText: string): Promise<boolean>;
}

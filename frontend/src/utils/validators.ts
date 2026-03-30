/**
 * Valida CPF usando o algoritmo oficial da Receita Federal.
 * Rejeita sequências de dígitos iguais (ex: 111.111.111-11).
 */
export function validateCPF(cpf: string): boolean {
  const c = cpf.replace(/\D/g, '');

  if (c.length !== 11) return false;

  // Rejeita sequências como 000.000.000-00 ... 999.999.999-99
  if (/^(\d)\1{10}$/.test(c)) return false;

  const digit = (i: number): number => Number(c.charAt(i));

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digit(i) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digit(9)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += digit(i) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digit(10)) return false;

  return true;
}

/**
 * Valida CNPJ usando o algoritmo oficial da Receita Federal.
 * Rejeita sequências de dígitos iguais (ex: 11.111.111/1111-11).
 */
export function validateCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, '');

  if (c.length !== 14) return false;

  // Rejeita sequências como 00.000.000/0000-00 ... 99.999.999/9999-99
  if (/^(\d)\1{13}$/.test(c)) return false;

  const digit = (i: number): number => Number(c.charAt(i));

  const calcDigit = (len: number): number => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += digit(len - i) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11;
    return result < 2 ? 0 : 11 - result;
  };

  if (calcDigit(12) !== digit(12)) return false;
  if (calcDigit(13) !== digit(13)) return false;

  return true;
}


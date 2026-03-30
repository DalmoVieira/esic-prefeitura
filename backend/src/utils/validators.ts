/**
 * Valida CPF usando o algoritmo oficial da Receita Federal.
 * Rejeita sequências de dígitos iguais (ex: 111.111.111-11),
 * que passam no cálculo dos dígitos verificadores mas são inválidas.
 */
export function validateCPF(cpf: string): boolean {
  // Remove formatação
  const c = cpf.replace(/\D/g, '');

  if (c.length !== 11) return false;

  // Rejeita sequências conhecidas (todos os dígitos iguais)
  if (/^(\d)\1{10}$/.test(c)) return false;

  const digit = (i: number): number => Number(c.charAt(i));

  // Cálculo do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digit(i) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digit(9)) return false;

  // Cálculo do 2º dígito verificador
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
  // Remove formatação
  const c = cnpj.replace(/\D/g, '');

  if (c.length !== 14) return false;

  // Rejeita sequências conhecidas (todos os dígitos iguais)
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

  // Cálculo do 1º dígito verificador
  if (calcDigit(12) !== digit(12)) return false;

  // Cálculo do 2º dígito verificador
  if (calcDigit(13) !== digit(13)) return false;

  return true;
}


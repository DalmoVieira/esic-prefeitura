/**
 * Valida CPF usando o algoritmo oficial da Receita Federal.
 * Rejeita sequências de dígitos iguais (ex: 111.111.111-11),
 * que passam no cálculo dos dígitos verificadores mas são inválidas.
 */
export declare function validateCPF(cpf: string): boolean;
/**
 * Valida CNPJ usando o algoritmo oficial da Receita Federal.
 * Rejeita sequências de dígitos iguais (ex: 11.111.111/1111-11).
 */
export declare function validateCNPJ(cnpj: string): boolean;

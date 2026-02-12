/**
 * Gerador de Protocolo Único
 * 
 * Gera protocolos no formato: ESIC-YYYYMMDD-XXXXX
 * Exemplo: ESIC-20260212-00001
 * 
 * O protocolo é único e identifica cada solicitação no sistema
 */

/**
 * Gera um protocolo único para uma solicitação
 * @returns {string} Protocolo no formato ESIC-YYYYMMDD-XXXXX
 */
export function generateProtocol() {
  // Obtém a data atual
  const now = new Date();
  
  // Formata a data como YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Gera um número aleatório de 5 dígitos
  const randomNum = Math.floor(Math.random() * 100000);
  const randomStr = String(randomNum).padStart(5, '0');
  
  // Retorna o protocolo completo
  return `ESIC-${dateStr}-${randomStr}`;
}

/**
 * Calcula o prazo de resposta (20 dias úteis)
 * Por simplicidade, estamos adicionando 28 dias corridos
 * que aproximadamente equivale a 20 dias úteis
 * 
 * @returns {Date} Data limite para resposta
 */
export function calculateDeadline() {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 28); // Aproximadamente 20 dias úteis
  return deadline;
}

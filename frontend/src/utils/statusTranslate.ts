export const statusTranslations: Record<string, string> = {
  'OPEN': 'Pendente',
  'IN_ANALYSIS': 'Em Análise',
  'RESPONDED': 'Respondido',
  'EXTENDED': 'Prorrogado',
  'CANCELED': 'Cancelado'
};

export const translateStatus = (status: string) => {
  return statusTranslations[status] || status;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN': return { bg: '#fff4e6', text: '#d9480f' }; // Laranja/Pendente
    case 'IN_ANALYSIS': return { bg: '#e7f5ff', text: '#1971c2' }; // Azul/Análise
    case 'RESPONDED': return { bg: '#e6fcf5', text: '#087f5b' }; // Verde/Respondido
    case 'EXTENDED': return { bg: '#f3f0ff', text: '#6741d9' }; // Roxo/Prorrogado
    case 'CANCELED': return { bg: '#fff5f5', text: '#c92a2a' }; // Vermelho/Cancelado
    default: return { bg: '#f8f9fa', text: '#495057' };
  }
};

export function handlePriorityName(priorityName: string) {
  switch (priorityName) {
    case 'low':
      return 'Baixa';
    case 'medium':
      return 'Média';
    case 'high':
      return 'Alta';

    default:
      return '-';
  }
}

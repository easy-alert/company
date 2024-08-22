export const getStatusName = (status: string) => {
  let statusName = '';

  switch (status) {
    case 'expired':
      statusName = 'Vencida';
      break;

    case 'pending':
      statusName = 'Pendente';
      break;

    case 'completed':
      statusName = 'Concluída';
      break;

    case 'overdue':
      statusName = 'Feita em atraso';
      break;

    case 'occasional':
      statusName = 'Avulsa';
      break;

    case 'common':
      statusName = 'Preventiva';
      break;

    default:
      break;
  }

  return statusName;
};

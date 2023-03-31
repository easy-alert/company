export const getStatusNameforPdf = (status: string) => {
  let statusName = '';

  switch (status) {
    case 'expired':
      statusName = 'Vencidas';
      break;

    case 'pending':
      statusName = 'Pendentes';
      break;

    case 'completed':
      statusName = 'Concluídas';
      break;

    case 'overdue':
      statusName = 'Feitas em atraso';
      break;

    default:
      break;
  }

  return statusName;
};

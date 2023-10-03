export const getPluralStatusNameforPdf = (status: string) => {
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

export const getSingularStatusNameforPdf = (status: string) => {
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

    default:
      break;
  }

  return statusName;
};

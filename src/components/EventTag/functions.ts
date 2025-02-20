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

    case 'ticket':
      statusName = 'Chamado';
      break;

    case 'checklist':
      statusName = 'Checklist';
      break;

    case 'open':
      statusName = 'Aberto';
      break;

    default:
      statusName = status;
      break;
  }

  return statusName;
};

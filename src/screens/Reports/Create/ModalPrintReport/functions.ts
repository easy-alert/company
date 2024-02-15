import { theme } from '../../../../styles/theme';

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

export const getStatusBackgroundColor = (
  status: 'completed' | 'expired' | 'pending' | 'overdue' | 'occasional' | 'inProgress',
) => {
  const backgroundColor = {
    completed: theme.color.success,
    overdue: theme.color.primaryM,
    pending: theme.color.warning,
    expired: theme.color.actionDanger,
    occasional: theme.color.purple,
    inProgress: theme.color.actionBlue,
  };

  return backgroundColor[status];
};

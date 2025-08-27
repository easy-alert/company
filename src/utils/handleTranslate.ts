import { capitalizeFirstLetter } from './functions';

interface IHandleTranslate {
  key: string;
  capitalize?: boolean;
  plural?: boolean;
  alternative?: boolean;
}

interface TranslationMap {
  [key: string]: string;
}

const alternativeSingularTranslations: TranslationMap = {
  unpaid: 'pendente',
  awaitingtofinish: 'em execução',
  finished: 'concluída',
  oldExpired: 'expirada',
};

const alternativePluralTranslations: TranslationMap = {
  unpaid: 'pendentes',
  awaitingToFinish: 'em execução',
  awaitingtofinish: 'em execução',
  finished: 'concluídas',
  oldExpired: 'expiradas',
};

const singularTranslations: TranslationMap = {
  alert: 'alerta',
  announcement: 'anúncio',
  news: 'notícia',
  tutorial: 'tutorial',
  platformVideo: 'vídeo da plataforma',
  promotion: 'promoção',
  event: 'evento',
  feature: 'funcionalidade',
  maintenance: 'manutenção',
  draft: 'rascunho',
  published: 'publicado',
  archived: 'arquivado',
  expired: 'vencida',
  expiredOld: 'expirada',
  pending: 'pendente',
  inProgress: 'em execução',
  completed: 'concluída',
  overdue: 'feita em atraso',
  paid: 'pago',
  canceled: 'cancelado',
  sent: 'enviado',
  open: 'em aberto',
  dismissed: 'indeferido',

  // STOCK
  registration: 'registro',
  incoming: 'entrada',
  outgoing: 'saída',
  transferIn: 'transferência de entrada',
  transfer_in: 'transferência de entrada',
  transferOut: 'transferência de saída',
  transfer_out: 'transferência de saída',
  adjustment: 'ajuste',
  loss: 'perda',
  damaged: 'danificado',
  deleted: 'deletado',
  removal: 'remoção',
};

const pluralTranslations: TranslationMap = {
  alert: 'alertas',
  announcements: 'anúncios',
  news: 'notícias',
  tutorials: 'tutoriais',
  platformVideos: 'vídeos da plataforma',
  promotions: 'promoções',
  events: 'eventos',
  features: 'funcionalidades',
  maintenances: 'manutenções',
  drafts: 'rascunhos',
  published: 'publicados',
  archived: 'arquivados',
  expired: 'vencidas',
  expiredOld: 'expiradas',
  pending: 'pendentes',
  inProgress: 'em execução',
  completed: 'concluídas',
  overdue: 'feitas em atraso',
  paid: 'pagos',
  canceled: 'cancelados',
  sent: 'enviados',
  open: 'em aberto',
  dismissed: 'indeferidos',

  // STOCK
  registration: 'registros',
  incoming: 'entradas',
  outgoing: 'saídas',
  transferIn: 'transferências de entrada',
  transfer_in: 'transferências de entrada',
  transferOut: 'transferências de saída',
  transfer_out: 'transferências de saída',
  adjustment: 'ajustes',
  loss: 'perdas',
  damaged: 'danificados',
  deleted: 'deletados',
  removal: 'remoções',
};

const reverseSingularTranslations: TranslationMap = Object.fromEntries(
  Object.entries(singularTranslations).map(([key, value]) => [value, key]),
);

const reversePluralTranslations: TranslationMap = Object.fromEntries(
  Object.entries(pluralTranslations).map(([key, value]) => [value, key]),
);

const reverseAlternativePluralTranslations: TranslationMap = Object.fromEntries(
  Object.entries(alternativePluralTranslations).map(([key, value]) => [value, key]),
);

const reverseAlternativeSingularTranslations: TranslationMap = Object.fromEntries(
  Object.entries(alternativeSingularTranslations).map(([key, value]) => [value, key]),
);

export function handleTranslate({
  key,
  capitalize,
  plural = false,
  alternative = false,
}: IHandleTranslate): string {
  const lowerKey = key.toLowerCase();
  const translations = plural ? pluralTranslations : singularTranslations;
  const reverseTranslations = plural ? reversePluralTranslations : reverseSingularTranslations;

  if (alternative) {
    const alternativeTranslation = plural
      ? alternativePluralTranslations
      : alternativeSingularTranslations;
    const reverseAlternativeTranslation = plural
      ? reverseAlternativePluralTranslations
      : reverseAlternativeSingularTranslations;

    if (Object.prototype.hasOwnProperty.call(alternativeTranslation, lowerKey)) {
      const translation = alternativeTranslation[lowerKey];
      return capitalize ? capitalizeFirstLetter(translation) : translation;
    }

    if (Object.prototype.hasOwnProperty.call(reverseAlternativeTranslation, lowerKey)) {
      const translation = reverseAlternativeTranslation[lowerKey];
      return capitalize ? capitalizeFirstLetter(translation) : translation;
    }
  }

  // Check if the key exists in the translations map
  if (Object.prototype.hasOwnProperty.call(translations, lowerKey)) {
    const translation = translations[lowerKey];
    return capitalize ? capitalizeFirstLetter(translation) : translation;
  }

  // If the key is not found in the translations map, check if it exists in the reverse translations map
  if (Object.prototype.hasOwnProperty.call(reverseTranslations, lowerKey)) {
    const translation = reverseTranslations[lowerKey];
    return capitalize ? capitalizeFirstLetter(translation) : translation;
  }

  console.warn(`Translation for key "${key}" not found.`);
  return key; // Return the key itself if no translation is found
}

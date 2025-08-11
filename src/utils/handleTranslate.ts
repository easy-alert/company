import { capitalizeFirstLetter } from './functions';

interface TranslationMap {
  [key: string]: string;
}

const translations: TranslationMap = {
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
  expired: 'vencidas',
  expiredOld: 'expiradas',
  pending: 'pendentes',
  inProgress: 'em execução',
  completed: 'concluídas',
  overdue: 'feitas em atraso',
  paid: 'pago',
  unpaid: 'pendente',
  canceled: 'cancelado',
  sent: 'enviado',
  open: 'em aberto',
  awaitingToFinish: 'em execução',
  finished: 'concluída',
  dismissed: 'indeferido',
};

const reverseTranslations: TranslationMap = Object.fromEntries(
  Object.entries(translations).map(([key, value]) => [value, key]),
);

export function handleTranslate(key: string, capitalize?: boolean): string {
  // Check if the key exists in the translations map
  if (Object.prototype.hasOwnProperty.call(translations, key.toLocaleLowerCase())) {
    return capitalize
      ? capitalizeFirstLetter(translations[key.toLocaleLowerCase()])
      : translations[key.toLocaleLowerCase()];
  }

  // If the key is not found in the translations map, check if it exists in the reverse translations map
  if (Object.prototype.hasOwnProperty.call(reverseTranslations, key.toLocaleLowerCase())) {
    return capitalize
      ? capitalizeFirstLetter(reverseTranslations[key.toLocaleLowerCase()])
      : reverseTranslations[key.toLocaleLowerCase()];
  }

  console.warn(`Translation for key "${key}" not found.`);
  return key; // Return the key itself if no translation is found
}

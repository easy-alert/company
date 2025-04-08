import React from 'react';
import * as Style from './styles';

type CountAndCostItem = {
  category: string;
  count: number;
};

interface InfoCardProps {
  title: string;
  totals: number;
  valueInvested: number;
  name?: string[];
  tickets?: number;
  checklists?: number;
  categories?: CountAndCostItem[];
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  totals,
  valueInvested,
  name,
  tickets,
  checklists,
  categories,
}) => (
  <Style.Card>
    <h5>{title}</h5>
    <Style.Subtitles>
      <Style.InfoItem>
        <h2>Totais:</h2>
        <h2>{totals}</h2>
      </Style.InfoItem>

      <Style.InfoItem>
        <h2>Valor investido:</h2>
        <h2>R$ {valueInvested.toLocaleString('pt-BR')}</h2>
      </Style.InfoItem>

      {name && (
        <Style.InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2>Nome:</h2>
          <Style.NameScrollContainer>
            {name.map((n) => (
              <h2 key={n}>{n}</h2>
            ))}
          </Style.NameScrollContainer>
        </Style.InfoItem>
      )}

      {typeof tickets !== 'undefined' && (
        <Style.InfoItem>
          <h2>Tickets:</h2>
          <h2>{tickets}</h2>
        </Style.InfoItem>
      )}

      {typeof checklists !== 'undefined' && (
        <Style.InfoItem>
          <h2>Checklists:</h2>
          <h2>{checklists}</h2>
        </Style.InfoItem>
      )}

      {categories && (
        <Style.InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2>Categorias:</h2>
          <Style.CategoryScrollContainer>
            {categories.map((item) => (
              <Style.CategoryItem key={item.category}>
                <h2>{item.category}</h2>
                <h2>{item.count}</h2>
              </Style.CategoryItem>
            ))}
          </Style.CategoryScrollContainer>
        </Style.InfoItem>
      )}
    </Style.Subtitles>
  </Style.Card>
);

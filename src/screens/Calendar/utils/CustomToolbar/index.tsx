// TYPES
import type { ToolbarProps, View } from 'react-big-calendar';

// COMPONENTS
import { Button } from '@components/Buttons/Button';

// STYLES
import * as Style from './styles';

export const CustomToolbar = ({ date, label, onNavigate, onView, view }: ToolbarProps) => (
  <Style.ToolbarContainer>
    <Style.TitleWrapper>
      <Button label="Hoje" onClick={() => onNavigate('TODAY')} />
      <Button label="Anterior" onClick={() => onNavigate('PREV')} />
      <Button label="Próximo" onClick={() => onNavigate('NEXT')} />
    </Style.TitleWrapper>

    <Style.Title>{label}</Style.Title>

    <Style.ViewSwitcher>
      <Button
        label="« Ano"
        onClick={() => onNavigate('DATE', new Date(date.getFullYear() - 1, date.getMonth(), 1))}
      />
      <Button
        label="Ano »"
        onClick={() => onNavigate('DATE', new Date(date.getFullYear() + 1, date.getMonth(), 1))}
      />

      {(['month', 'week'] as View[]).map((type) => (
        <Style.ViewButtonWrapper key={type} selected={view === type}>
          <Button label={type === 'month' ? 'Mês' : 'Semana'} onClick={() => onView(type)} />
        </Style.ViewButtonWrapper>
      ))}
    </Style.ViewSwitcher>
  </Style.ToolbarContainer>
);

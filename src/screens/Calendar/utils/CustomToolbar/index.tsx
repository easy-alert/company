// TYPES
import type { ToolbarProps, View } from 'react-big-calendar';

// COMPONENTS
import { Button } from '@components/Buttons/Button';

// STYLES
import * as Style from './styles';

export const CustomToolbar = ({ date, label, onNavigate, onView, view }: ToolbarProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Style.ToolbarContainer>
      <Style.TitleWrapper>
        <Button label="Hoje" onClick={() => onNavigate('TODAY')} />
        <Button label="Anterior" onClick={() => onNavigate('PREV')} />
        <Button label="Próximo" onClick={() => onNavigate('NEXT')} />
      </Style.TitleWrapper>

      <Style.Title>{label}</Style.Title>
      <Style.ViewSwitcher>
        <span style={{ marginRight: 8 }}>Ano</span>
        <select
          aria-label="Ano"
          value={String(date.getFullYear())}
          onChange={(e) => onNavigate('DATE', new Date(Number(e.target.value), date.getMonth(), 1))}
        >
          {years.map((year) => (
            <option key={year} value={String(year)}>
              {year}
            </option>
          ))}
        </select>

        {(['month', 'week'] as View[]).map((type) => (
          <Style.ViewButtonWrapper key={type} selected={view === type}>
            <Button label={type === 'month' ? 'Mês' : 'Semana'} onClick={() => onView(type)} />
          </Style.ViewButtonWrapper>
        ))}
      </Style.ViewSwitcher>
    </Style.ToolbarContainer>
  );
};

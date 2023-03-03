// LIBS

// COMPONENTS
import { IconButton } from '../../../components/Buttons/IconButton';
import { Select } from '../../../components/Inputs/Select';
import { Button } from '../../../components/Buttons/Button';
import { Input } from '../../../components/Inputs/Input';

// STYLES
import { icon } from '../../../assets/icons';
import * as Style from './styles';
import { theme } from '../../../styles/theme';

export const CreateReport = () => (
  <Style.Container>
    <Style.Header>
      <h2>Relatórios</h2>
      <IconButton
        icon={icon.downloadRed}
        label="Baixar"
        color={theme.color.primary}
        size="16px"
        onClick={() => {
          //
        }}
      />
    </Style.Header>
    <Style.FiltersAndCount>
      <h5>Filtros</h5>
      <Style.FiltersGrid>
        <Select label="Edificação" />
        <Select label="Categoria" />
        <Select label="Responsável" />
        <Input type="date" typeDatePlaceholderValue="" label="Data de notificação inicial" />
        <Input type="date" typeDatePlaceholderValue="" label="Data de notificação final" />
        <Select label="Status" />
      </Style.FiltersGrid>
      <Style.TagWrapper>
        <Style.Tag>
          <p className="p5" title="teste">
            monte monte monte monte monte monte monte monte monte monte monte monte monte monte
            monte monte monte
          </p>
          <IconButton
            icon={icon.xBlack}
            size="12px"
            onClick={() => {
              //
            }}
          />
        </Style.Tag>
      </Style.TagWrapper>
      <Style.ButtonContainer>
        <Button borderless label="Limpar filtros" />
        <Button label="Filtrar" />
      </Style.ButtonContainer>
    </Style.FiltersAndCount>
  </Style.Container>
);

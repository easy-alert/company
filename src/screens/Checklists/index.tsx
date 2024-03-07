import { useState } from 'react';
import { icon } from '../../assets/icons';
import { IconButton } from '../../components/Buttons/IconButton';
import { Select } from '../../components/Inputs/Select';
import { MiniCalendar } from './MiniCalendar';
import * as Style from './styles';
import { Button } from '../../components/Buttons/Button';
import { NoDataFound } from '../../components/NoDataFound';

export const Checklists = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <Style.Container>
      <Style.Header>
        <Style.HeaderLeftSide>
          <h2>Checklists</h2>
          <Select selectPlaceholderValue=" ">
            <option value="">Building</option>
          </Select>
        </Style.HeaderLeftSide>
        <IconButton
          icon={icon.plusWithBg}
          hideLabelOnMedia
          label="Cadastrar"
          onClick={() => {
            //
          }}
        />
      </Style.Header>

      <Style.Content>
        <Style.DateHeader>
          <Style.NavigateButtons>
            <Button
              label="Hoje"
              onClick={() => {
                setCurrentDate(new Date());
              }}
            />
            <Button
              label="Anterior"
              onClick={() => {
                setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
              }}
            />
            <Button
              label="Próximo"
              onClick={() => {
                setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));
              }}
            />
          </Style.NavigateButtons>
          <p className="p1">
            {currentDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </Style.DateHeader>

        <Style.ContentRow>
          <Style.CalendarDiv>
            <MiniCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
          </Style.CalendarDiv>
          <Style.Checklists>
            <NoDataFound label="Nenhum checklist encontrado" height="100%" />
          </Style.Checklists>
        </Style.ContentRow>
      </Style.Content>
    </Style.Container>
  );
};

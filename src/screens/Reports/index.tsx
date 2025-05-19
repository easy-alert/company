import { useState } from 'react';
import { Button } from '@components/Buttons/Button';
import { MaintenanceReports } from './Maintenances';
import { TicketReports } from './Tickets';
import { ChecklistReports } from './Checklists';

import * as Style from './styles';

export const Report = () => {
  const [reportType, setReportType] = useState<'maintenance' | 'ticket' | 'checklist'>(
    'maintenance',
  );

  const handleReportChange = (type: 'maintenance' | 'ticket' | 'checklist') => {
    setReportType(type);
  };

  return (
    <Style.Container>
      <Style.ButtonGroup>
        <Style.ButtonWrapper
          active={reportType === 'maintenance'}
          onClick={() => handleReportChange('maintenance')}
        >
          <Button label="Manutenção" />
        </Style.ButtonWrapper>

        <Style.ButtonWrapper
          active={reportType === 'ticket'}
          onClick={() => handleReportChange('ticket')}
        >
          <Button label="Chamados" />
        </Style.ButtonWrapper>

        <Style.ButtonWrapper
          active={reportType === 'checklist'}
          onClick={() => handleReportChange('checklist')}
        >
          <Button label="Checklist" />
        </Style.ButtonWrapper>
      </Style.ButtonGroup>

      {reportType === 'maintenance' && <MaintenanceReports />}
      {reportType === 'ticket' && <TicketReports />}
      {reportType === 'checklist' && <ChecklistReports />}
    </Style.Container>
  );
};

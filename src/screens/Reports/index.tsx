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
        <Style.ButtonWrapper active={reportType === 'maintenance'}>
          <Button label="Manutenção" onClick={() => handleReportChange('maintenance')} />
        </Style.ButtonWrapper>

        <Style.ButtonWrapper active={reportType === 'ticket'}>
          <Button label="Chamados" onClick={() => handleReportChange('ticket')} />
        </Style.ButtonWrapper>

        <Style.ButtonWrapper active={reportType === 'checklist'}>
          <Button label="Checklist" onClick={() => handleReportChange('checklist')} />
        </Style.ButtonWrapper>
      </Style.ButtonGroup>

      {reportType === 'maintenance' && <MaintenanceReports />}
      {reportType === 'ticket' && <TicketReports />}
      {reportType === 'checklist' && <ChecklistReports />}
    </Style.Container>
  );
};

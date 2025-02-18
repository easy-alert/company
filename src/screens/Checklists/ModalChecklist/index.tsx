import { useState, useEffect } from 'react';

// COMPONENTES
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { NewChecklist } from './NewChecklist';
import { ModelTemplate } from './ModelTemplate';
import { ModalSendReport } from '../ModalSendReport';

// STYLES
import * as Style from './styles';
import { SelectContainer } from './ModelTemplate/styles';

export const ModalChecklist = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showTemplate, setShowTemplate] = useState(false);
  const [showNewChecklist, setShowNewChecklist] = useState(true);
  const [showSendReport, setShowSendReport] = useState(false);
  const [checklistData, setChecklistData] = useState<{
    title: string;
    tasks: { id: string; task: string }[];
  } | null>(null);

  const [selectedPriority, setSelectedPriority] = useState('');

  const [savedTemplates, setSavedTemplates] = useState<
    { title: string; tasks: { id: string; task: string }[] }[]
  >([]);

  useEffect(() => {
    setShowNewChecklist(true);
    setShowTemplate(false);
  }, []);

  const handleSaveChecklist = (checklist: {
    title: string;
    tasks: { id: string; task: string }[];
  }) => {
    setChecklistData(checklist);
    setSavedTemplates((prev) => [...prev, checklist]);
  };

  const handleOpenModalSendReport = () => {
    if (checklistData) {
      setShowSendReport(true);
    } else {
      alert('Por favor, crie e salve um checklist antes de continuar.');
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriority(e.target.value);
  };

  return (
    <>
      <Modal setModal={setModal} title="Checklist">
        <Style.Content>
          <Style.Checklist>
            <Style.ChecklistItem>
              <input
                type="checkbox"
                checked={showNewChecklist}
                onChange={() => {
                  setShowNewChecklist(!showNewChecklist);
                  setShowTemplate(false);
                }}
              />
              Criar novo
            </Style.ChecklistItem>
            <Style.ChecklistItem>
              <input
                type="checkbox"
                checked={showTemplate}
                onChange={() => {
                  setShowTemplate(!showTemplate);
                  setShowNewChecklist(false);
                }}
              />
              Usar template
            </Style.ChecklistItem>
          </Style.Checklist>

          {showTemplate && (
            <ModelTemplate
              savedTemplates={savedTemplates}
              onSelectTemplate={(template) => setChecklistData(template)}
            />
          )}

          {showNewChecklist && <NewChecklist onSaveChecklist={handleSaveChecklist} />}

          <p className="p3">Resposável *</p>
          <input type="text" />
          <Style.InputText>
            <SelectContainer />
            <p className="p3">Prioridade *</p>
            <select value={selectedPriority} onChange={handlePriorityChange}>
              <option value="" disabled>
                Selecione
              </option>
              <option value="avulso">Avulso</option>
              <option value="diario">Diário</option>
              <option value="aCadaDoisDias">A cada 2 dias</option>
              <option value="aCadaTresDias">A cada 3 dias</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="bimestral">Bimestral</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </Style.InputText>

          <Style.InputText>
            <p className="p3">Data de execução *</p>
            <input type="date" />
          </Style.InputText>

          <Style.ButtonContainer>
            <Button label="Criar" onClick={handleOpenModalSendReport} />
            <Button
              label="Iniciar execução"
              bgColor="transparent"
              textColor="actionBlue"
              onClick={handleOpenModalSendReport}
            />
          </Style.ButtonContainer>
        </Style.Content>
      </Modal>

      {showSendReport && checklistData && (
        <ModalSendReport setModal={setShowSendReport} checklist={checklistData} />
      )}
    </>
  );
};

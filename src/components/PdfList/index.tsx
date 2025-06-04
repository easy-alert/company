import { useEffect, useState } from 'react';

// GLOBAL COMPONENTS
import { ColorfulTable, ColorfulTableContent } from '@components/ColorfulTable';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Button } from '@components/Buttons/Button';

// GLOBAL UTILS
import { dateTimeFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconPdfLogo from '@assets/icons/IconPdfLogo';
import IconEdit from '@assets/icons/IconEdit';

// GLOBAL TYPES
import type { IReportPdf } from '@customTypes/IReportPdf';

// SERVICES
import { putReportPdf } from '@services/apis/putReportPdf';

// STYLES
import * as Style from './styles';

interface IPdfList {
  pdfList: IReportPdf[];
  loading: boolean;
  handleRefreshPdf: () => void;
  reportType: 'ticket' | 'maintenance' | 'checklist';
}

interface IPartialPdf {
  id: string;
  name: string;
  url: string;
}

export const PdfList = ({ pdfList, loading, handleRefreshPdf, reportType }: IPdfList) => {
  const [editingPdf, setEditingPdf] = useState<IPartialPdf | null>(null);
  const [editedName, setEditedName] = useState('');
  const [pdfListState, setPdfListState] = useState<IReportPdf[]>(pdfList);

  const statusTranslation: { [key: string]: string } = {
    pending: 'Pendente',
    finished: 'Concluído',
    failed: 'Erro',
  };

  const handleSharePdf = async (url: string, name: string) => {
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
      const message = `Confira o relatório: ${name}\n${url}`;

      const whatsappDeepLink = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const whatsappUri = `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      const whatsappUrl = isMobile ? whatsappDeepLink : whatsappUri;

      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Erro ao compartilhar no WhatsApp:', err);
    }
  };

  const openEditModal = (pdf: IPartialPdf) => {
    setEditedName(pdf.name);
    setEditingPdf(pdf);
  };

  const saveEditedName = async () => {
    if (editingPdf) {
      const updatedList = pdfListState.map((pdf) =>
        pdf.id === editingPdf.id ? { ...pdf, name: editedName } : pdf,
      );
      setPdfListState(updatedList);

      try {
        await putReportPdf({
          reportId: editingPdf.id,
          reportType,
          reportName: editedName,
        });
        setEditingPdf(null);
      } catch (error) {
        setPdfListState(pdfList);
      }
    }
  };

  useEffect(() => {
    if (!editingPdf) {
      setPdfListState(pdfList);
    }
  }, [pdfList]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {!loading && pdfListState.length === 0 && (
        <Style.NoMaintenanceCard>
          <h4>Nenhum histórico encontrado.</h4>
        </Style.NoMaintenanceCard>
      )}

      {!loading && pdfListState.length > 0 && (
        <Style.TableCard>
          <ColorfulTable
            colsHeader={[
              { label: 'Datas filtradas' },
              { label: 'Criado em' },
              { label: 'Criado por' },
              { label: 'Status' },
              {
                label: (
                  <IconButton
                    label="Atualizar"
                    icon={icon.update}
                    onClick={() => handleRefreshPdf()}
                  />
                ),
              },
            ]}
          >
            {pdfListState.map(({ author, createdAt, id, status, url, name }) => (
              <ColorfulTableContent
                key={id}
                colsBody={[
                  { cell: name },
                  { cell: dateTimeFormatter(createdAt) },
                  { cell: author?.name },
                  { cell: statusTranslation[status] },
                  {
                    cell: (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        <IconButton
                          disabled={status !== 'finished'}
                          label="Compartilhar"
                          icon={icon.whatsApp}
                          onClick={() => handleSharePdf(url, name)}
                        />
                        <IconButton
                          disabled={status !== 'finished'}
                          label="Editar"
                          icon={<IconEdit strokeColor="primary" />}
                          onClick={() => openEditModal({ id, name, url })}
                        />
                        <IconButton
                          disabled={status !== 'finished'}
                          label="Visualizar"
                          icon={<IconPdfLogo strokeColor="primary" />}
                          onClick={() => window.open(url, '_blank')}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            ))}
          </ColorfulTable>
        </Style.TableCard>
      )}

      {editingPdf && (
        <Style.ModalOverlay>
          <Style.ModalContent>
            <Style.ModalHeader>
              <h3>Editar relatório</h3>
              <IconButton icon={icon.x} onClick={() => setEditingPdf(null)} />
            </Style.ModalHeader>

            <Style.ModalInput value={editedName} onChange={(e) => setEditedName(e.target.value)} />

            <Style.ModalFooter>
              <Button label="Atualizar" onClick={saveEditedName} />
            </Style.ModalFooter>
          </Style.ModalContent>
        </Style.ModalOverlay>
      )}
    </>
  );
};

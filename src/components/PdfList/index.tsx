// GLOBAL COMPONENTS
import { ColorfulTable, ColorfulTableContent } from '@components/ColorfulTable';
import { IconButton } from '@components/Buttons/IconButton';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';

// GLOBAL UTILS
import { dateTimeFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';
import IconPdfLogo from '@assets/icons/IconPdfLogo';

// GLOBAL TYPES
import type { IReportPdf } from '@customTypes/IReportPdf';

// STYLES
import * as Style from './styles';

interface IPdfList {
  pdfList: IReportPdf[];
  loading: boolean;
  handleRefreshPdf: () => void;
}

export const PdfList = ({ pdfList, loading, handleRefreshPdf }: IPdfList) => {
  const statusTranslation: { [key: string]: string } = {
    pending: 'Pendente',
    finished: 'Concluído',
    failed: 'Erro',
  };

  const handleSharePdf = async (url: string, name: string) => {
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
      const message = `Confira o PDF referente às datas: ${name}\n${url}`;
      const whatsappUrl = `https://${
        isMobile ? 'api' : 'web'
      }.whatsapp.com/send?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Erro ao compartilhar no WhatsApp:', err);
    }
  };

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {!loading && pdfList.length === 0 && (
        <Style.NoMaintenanceCard>
          <h4>Nenhum histórico encontrado.</h4>
        </Style.NoMaintenanceCard>
      )}

      {!loading && pdfList.length > 0 && (
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
            {pdfList.map(({ author, createdAt, id, status, url, name }) => (
              <ColorfulTableContent
                key={id}
                colsBody={[
                  { cell: name },
                  { cell: dateTimeFormatter(createdAt) },
                  { cell: author?.name },
                  { cell: statusTranslation[status] },
                  {
                    cell: (
                      <div style={{ gap: '8px' }}>
                        <IconButton
                          disabled={status !== 'finished'}
                          label="Visualizar"
                          icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
                          onClick={() => {
                            window.open(url, '_blank');
                          }}
                        />
                        <IconButton
                          disabled={status !== 'finished'}
                          label="Compartilhar"
                          icon={icon.whatsApp}
                          onClick={() => handleSharePdf(url, name)}
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
    </>
  );
};

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
                      <IconButton
                        disabled={status !== 'finished'}
                        label="Visualizar"
                        icon={<IconPdfLogo strokeColor="primary" fillColor="" />}
                        onClick={() => {
                          window.open(url, '_blank');
                        }}
                      />
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

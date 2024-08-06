import { useEffect, useState } from 'react';
import { Api } from '../../../../services/api';
import { catchHandler, dateTimeFormatter } from '../../../../utils/functions';
import * as Style from './styles';
import { ColorfulTable, ColorfulTableContent } from '../../../../components/ColorfulTable';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { icon } from '../../../../assets/icons';
import { DotSpinLoading } from '../../../../components/Loadings/DotSpinLoading';

interface Pdf {
  author: { name: string };
  createdAt: string;
  id: string;
  status: string;
  url: string;
  name: string;
}

export const PDFList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pdfs, setPdfs] = useState<Pdf[]>([]);

  const statusTranslation: { [key: string]: string } = {
    pending: 'Pendente',
    finished: 'Concluído',
    failed: 'Erro',
  };

  const requestPdf = async () => {
    setLoading(true);

    await Api.get(`/buildings/reports/list/pdf`)
      .then((res) => {
        setPdfs(res.data.pdfs);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    requestPdf();
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {!loading && pdfs.length === 0 && (
        <Style.NoMaintenanceCard>
          <h4>Nenhum histórico encontrado.</h4>
        </Style.NoMaintenanceCard>
      )}

      {!loading && pdfs.length > 0 && (
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
                    onClick={() => {
                      requestPdf();
                    }}
                  />
                ),
              },
            ]}
          >
            {pdfs.map(({ author, createdAt, id, status, url, name }) => (
              <ColorfulTableContent
                key={id}
                colsBody={[
                  { cell: name },
                  { cell: dateTimeFormatter(createdAt) },
                  { cell: author.name },
                  { cell: statusTranslation[status] },
                  {
                    cell: (
                      <IconButton
                        disabled={status !== 'finished'}
                        label="Visualizar"
                        icon={icon.pdfLogo}
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

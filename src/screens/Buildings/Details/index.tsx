// COMPONENTS
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { NotificationTable, NotificationTableContent } from './utils/components/NotificationTable';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

export const BuildingDetails = () => {
  const oi = '';
  // eslint-disable-next-line no-console
  console.log(oi);

  return (
    <>
      <Style.Header>
        <h2>Detalhes de edificação</h2>
        <ReturnButton path="/buildings" />
      </Style.Header>

      <Style.CardWrapper>
        <Style.Card>
          <Style.CardHeader>
            <h5>Manutenções</h5>
          </Style.CardHeader>
          <Style.MaintenanceCardFooter>
            <Style.MaintenanceCardFooterInfo>
              <h5 className="pending">0</h5>
              <p className="p5">Pendentes</p>
            </Style.MaintenanceCardFooterInfo>
            <Style.MaintenanceCardFooterInfo>
              <h5 className="expired">0</h5>
              <p className="p5">Vencidas</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="delayed">0</h5>
              <p className="p5">Feitas em atraso</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="completed">0</h5>
              <p className="p5">Concluídas</p>
            </Style.MaintenanceCardFooterInfo>
          </Style.MaintenanceCardFooter>
        </Style.Card>

        <Style.Card>
          <Style.CardHeader>
            <h5>Dados da edificação</h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                //
              }}
            />
          </Style.CardHeader>
          <Style.BuildingCardWrapper>
            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">Nome:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Tipo:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">CEP:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Cidade:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Data de entrega da edificação:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Continuar notificando após término da garantia?:</p>
                <p className="p3">Sim</p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>

            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">Estado:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Bairro:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Logradouro:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Área:</p>
                <p className="p3">1.200,00 m²</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Término da garantia:</p>
                <p className="p3">Monte Ravello</p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>
          </Style.BuildingCardWrapper>
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>Dados de notificação</h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                //
              }}
            />
          </Style.CardHeader>
          <NotificationTable
            colsHeader={[
              { label: 'Nome do responsável' },
              { label: 'E-mail' },
              { label: 'Função' },
              { label: 'WhatsApp' },
              { label: '' },
            ]}
          >
            <NotificationTableContent
              key="a"
              onClick={() => {
                //
              }}
              colsBody={[
                {
                  cell: 'Jorge Luiz Dutra Andrade',
                  cssProps: { width: '25%', borderBottomLeftRadius: theme.size.xxsm },
                },
                { cell: 'jorgeluiz112233@gmail.com', cssProps: { width: '25%' } },
                { cell: 'Auxiliar de auxiliar', cssProps: { width: '20%' } },
                {
                  cell: (
                    <Style.PhoneNumberWrapper>
                      (48) 99928-3494
                      <Style.MainContactTag>
                        <p className="p5">Principal</p>
                      </Style.MainContactTag>
                    </Style.PhoneNumberWrapper>
                  ),
                  cssProps: { width: '20%' },
                },
                {
                  cell: (
                    <IconButton
                      size="16px"
                      icon={icon.edit}
                      label="Editar"
                      onClick={() => {
                        //
                      }}
                    />
                  ),
                  cssProps: { width: '10%', borderBottomRightRadius: theme.size.xxsm },
                },
              ]}
            />
          </NotificationTable>
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>Manutenções a serem realizadas (0/20)</h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                //
              }}
            />
          </Style.CardHeader>
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>Anexos</h5>
            <IconButton
              icon={icon.plusWithBg}
              label="Cadastrar"
              hideLabelOnMedia
              onClick={() => {
                //
              }}
            />
          </Style.CardHeader>
        </Style.Card>
      </Style.CardWrapper>
    </>
  );
};

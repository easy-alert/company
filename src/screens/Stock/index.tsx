// REACT
import { useState } from 'react';

// GLOBAL COMPONENTS
import { IconButton } from '@components/Buttons/IconButton';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { Select } from '@components/Inputs/Select';
import { Image } from '@components/Image';

// GLOBAL ASSETS
import IconPlus from '@assets/icons/IconPlus';
import { icon } from '@assets/icons';

// STYLES
import * as Style from './styles';

function ListTag({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Style.ListTag clickable={!!onClick} onClick={onClick}>
      {label}
      {onClick && <Style.ListTagClose>×</Style.ListTagClose>}
    </Style.ListTag>
  );
}

const edificacoes = [
  { id: 'Plaza Milano', name: 'Plaza Milano' },
  { id: 'Condomínio Jupiá', name: 'Condomínio Jupiá' },
  { id: 'Burble Marx', name: 'Burble Marx' },
];

const ativosMock = [
  {
    nome: 'Registros',
    tipo: 'Materiais',
    edificacao: 'Plaza Milano',
    status: 'CONFORME',
    quantidade: 2,
    quantidadeNecessaria: 2,
    ultimaMovimentacao: 'Cadastrado 10/05/2025',
  },
  {
    nome: 'Máquina de Cortar Grama',
    tipo: 'Patrimônio',
    edificacao: 'Plaza Milano',
    status: 'CONFORME',
    quantidade: 1,
    quantidadeNecessaria: '-',
    ultimaMovimentacao: 'Transferido da Obra TKWS dia 06/07/2025',
  },
  {
    nome: 'Disjuntores',
    tipo: 'Patrimônio',
    edificacao: 'Condomínio Jupiá',
    status: 'NÃO CONFORME',
    quantidade: 1,
    quantidadeNecessaria: 10,
    ultimaMovimentacao: 'Cadastrado 30/11/2024',
  },
  {
    nome: 'Vap',
    tipo: 'Patrimônio',
    edificacao: 'Burble Marx',
    status: 'CONFORME',
    quantidade: 1,
    quantidadeNecessaria: '-',
    ultimaMovimentacao: 'Cadastrado 30/08/2024',
  },
];

export const Stock = () => {
  const [ativos, setAtivos] = useState(ativosMock);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isNovo, setIsNovo] = useState(false);
  const [edificacaoFiltro, setEdificacaoFiltro] = useState<string[]>([]);
  const [busca, setBusca] = useState('');
  const [tipoManutencao, setTipoManutencao] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  const ativosFiltrados = ativos.filter((a) => {
    const filtroEdificacao =
      edificacaoFiltro.length === 0 || edificacaoFiltro.includes(a.edificacao);
    const filtroTipo = !tipoManutencao || a.tipo === tipoManutencao;
    const filtroStatus = !statusFiltro || a.status === statusFiltro;
    const filtroBusca =
      !busca ||
      a.nome.toLowerCase().includes(busca.toLowerCase()) ||
      a.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      a.edificacao.toLowerCase().includes(busca.toLowerCase()) ||
      a.status.toLowerCase().includes(busca.toLowerCase()) ||
      String(a.quantidade).toLowerCase().includes(busca.toLowerCase()) ||
      String(a.quantidadeNecessaria).toLowerCase().includes(busca.toLowerCase()) ||
      a.ultimaMovimentacao.toLowerCase().includes(busca.toLowerCase());
    return filtroEdificacao && filtroTipo && filtroStatus && filtroBusca;
  });

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditData(ativosFiltrados[idx]);
    setIsNovo(false);
    setModalOpen(true);
  };

  const handleNovo = () => {
    setEditData({
      nome: '',
      tipo: '',
      edificacao: '',
      status: 'CONFORME',
      quantidade: '',
      quantidadeNecessaria: '',
    });
    setIsNovo(true);
    setModalOpen(true);
    setEditIndex(null);
  };

  const handleSave = () => {
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.getDate().toString().padStart(2, '0')}/${(
      dataAtual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${dataAtual.getFullYear()}`;

    if (isNovo) {
      setAtivos([
        ...ativos,
        {
          ...editData,
          ultimaMovimentacao: `Cadastrado ${dataFormatada}`,
        },
      ]);
      setModalOpen(false);
      setIsNovo(false);
    } else if (editIndex !== null) {
      const novosAtivos = [...ativos];
      const realIndex = ativos.findIndex(
        (a) =>
          a.nome === ativosFiltrados[editIndex].nome && a.tipo === ativosFiltrados[editIndex].tipo,
      );
      novosAtivos[realIndex] = {
        ...editData,
        ultimaMovimentacao: `Editado ${dataFormatada}`,
      };
      setAtivos(novosAtivos);
      setModalOpen(false);
      setEditIndex(null);
    }
  };

  const handleLimparFiltros = () => {
    setEdificacaoFiltro([]);
    setBusca('');
    setTipoManutencao('');
    setStatusFiltro('');
  };

  return (
    <Style.Container>
      <Style.Header>
        <Style.HeaderLeft>
          <h2>Estoque</h2>
        </Style.HeaderLeft>
        <IconButton
          label="Cadastrar"
          icon={<IconPlus strokeColor="primary" />}
          onClick={handleNovo}
        />
      </Style.Header>

      <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
        <Style.FiltrosWrapper>
          <Style.IconReportWrapper>
            <Image img={icon.report2} size="24px" />
          </Style.IconReportWrapper>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            <Style.Filtros>
              <div>
                <p>Edificação</p>
                <Select
                  value=""
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setEdificacaoFiltro([]);
                    } else if (!edificacaoFiltro.includes(e.target.value)) {
                      setEdificacaoFiltro([...edificacaoFiltro, e.target.value]);
                    }
                  }}
                >
                  <option value="" disabled hidden>
                    Selecione
                  </option>
                  <option value="all" disabled={edificacaoFiltro.length === 0}>
                    Todas
                  </option>
                  {edificacoes.map((ed) => (
                    <option value={ed.id} key={ed.id} disabled={edificacaoFiltro.includes(ed.id)}>
                      {ed.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <p>Buscar</p>
                <input
                  placeholder="Procurar por algum termo"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <div>
                <p>Tipo de ativo</p>
                <Select value={tipoManutencao} onChange={(e) => setTipoManutencao(e.target.value)}>
                  <option value="" disabled hidden>
                    Selecione
                  </option>
                  <option value="Materiais">Materiais</option>
                  <option value="Patrimônio">Patrimônio</option>
                </Select>
              </div>
              <div>
                <p>Status</p>
                <Select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
                  <option value="" disabled hidden>
                    Selecione
                  </option>
                  <option value="CONFORME">CONFORME</option>
                  <option value="NÃO CONFORME">NÃO CONFORME</option>
                </Select>
              </div>
            </Style.Filtros>
            <Style.FilterButtonWrapper>
              <Style.Tags>
                {edificacaoFiltro.length === 0 ? (
                  <ListTag label="Todas as edificações" />
                ) : (
                  edificacaoFiltro.map((ed) => (
                    <ListTag
                      key={ed}
                      label={edificacoes.find((e) => e.id === ed)?.name || ed}
                      onClick={() => setEdificacaoFiltro(edificacaoFiltro.filter((e) => e !== ed))}
                    />
                  ))
                )}

                {tipoManutencao === '' ? (
                  <ListTag label="Todos os tipos de ativo" />
                ) : (
                  <ListTag label={tipoManutencao} onClick={() => setTipoManutencao('')} />
                )}

                {statusFiltro === '' ? (
                  <ListTag label="Todos os status" />
                ) : (
                  <ListTag label={statusFiltro} onClick={() => setStatusFiltro('')} />
                )}

                {busca === '' ? null : (
                  <ListTag label={`Busca: ${busca}`} onClick={() => setBusca('')} />
                )}
              </Style.Tags>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <Button
                  label="Limpar filtros"
                  type="button"
                  textColor="primary"
                  borderless
                  onClick={handleLimparFiltros}
                />
                <Button type="submit" label="Filtrar" bgColor="primary" />
              </div>
            </Style.FilterButtonWrapper>
          </div>
        </Style.FiltrosWrapper>
      </form>

      <Style.Tabela>
        <thead>
          <tr>
            <Style.CelulaHeader>Ativo</Style.CelulaHeader>
            <Style.CelulaHeader>Tipo de Ativo</Style.CelulaHeader>
            <Style.CelulaHeader>Edificação</Style.CelulaHeader>
            <Style.CelulaHeader>Status</Style.CelulaHeader>
            <Style.CelulaHeader>Quantidade</Style.CelulaHeader>
            <Style.CelulaHeader>Quantidade Necessária</Style.CelulaHeader>
            <Style.CelulaHeader>Última movimentação</Style.CelulaHeader>
          </tr>
        </thead>
        <tbody>
          {ativosFiltrados.map((ativo) => (
            <Style.Linha key={`${ativo.nome}-${ativo.tipo}-${ativo.edificacao}`}>
              <Style.Text>{ativo.nome}</Style.Text>
              <Style.Text>{ativo.tipo}</Style.Text>
              <Style.Text>{ativo.edificacao}</Style.Text>
              <Style.Text>
                {ativo.status === 'CONFORME' ? (
                  <Style.StatusConforme>CONFORME</Style.StatusConforme>
                ) : (
                  <Style.StatusNaoConforme>NÃO CONFORME</Style.StatusNaoConforme>
                )}
              </Style.Text>
              <Style.Text>{ativo.quantidade}</Style.Text>
              <Style.Text>{ativo.quantidadeNecessaria}</Style.Text>
              <Style.Text>
                <span style={{ fontWeight: 700, color: '#222' }}>{ativo.ultimaMovimentacao}</span>
              </Style.Text>

              <td>
                <Style.CelulaAcoes>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button label="Transferir" type="button" textColor="primary" borderless />
                    <Button
                      type="button"
                      label="Editar"
                      bgColor="primary"
                      onClick={() =>
                        handleEdit(
                          ativosFiltrados.findIndex(
                            (a) =>
                              a.nome === ativo.nome &&
                              a.tipo === ativo.tipo &&
                              a.edificacao === ativo.edificacao,
                          ),
                        )
                      }
                    />
                  </div>
                </Style.CelulaAcoes>
              </td>
            </Style.Linha>
          ))}
        </tbody>
      </Style.Tabela>

      {modalOpen && (
        <Modal
          title={isNovo ? 'Cadastrar item no estoque' : 'Editar item no estoque'}
          setModal={setModalOpen}
        >
          <Style.ModalContainer>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <Style.ModalRow>
                <p>Nome</p>
                <input
                  value={editData.nome}
                  onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                  placeholder="Nome"
                />
              </Style.ModalRow>
              <Style.ModalRow>
                <p>Tipo</p>
                <input
                  value={editData.tipo}
                  onChange={(e) => setEditData({ ...editData, tipo: e.target.value })}
                  placeholder="Tipo"
                />
              </Style.ModalRow>
              <Style.ModalRow>
                <p>Edificação</p>
                <input
                  value={editData.edificacao}
                  onChange={(e) => setEditData({ ...editData, edificacao: e.target.value })}
                  placeholder="Edificação"
                />
              </Style.ModalRow>
              <Style.ModalRow>
                <p>Status</p>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="CONFORME">CONFORME</option>
                  <option value="NÃO CONFORME">NÃO CONFORME</option>
                </select>
              </Style.ModalRow>
              <Style.ModalRow>
                <p>Quantidade</p>
                <input
                  type="number"
                  value={editData.quantidade}
                  onChange={(e) => setEditData({ ...editData, quantidade: e.target.value })}
                  placeholder="Quantidade"
                />
              </Style.ModalRow>
              <Style.ModalRow>
                <p>Quantidade Necessária</p>
                <input
                  value={editData.quantidadeNecessaria}
                  onChange={(e) =>
                    setEditData({ ...editData, quantidadeNecessaria: e.target.value })
                  }
                  placeholder="Quantidade Necessária"
                />
              </Style.ModalRow>
              <Style.ModalButtonRow>
                <Button
                  label="Cancelar"
                  type="button"
                  textColor="primary"
                  borderless
                  onClick={() => {
                    setModalOpen(false);
                    setIsNovo(false);
                  }}
                />
                <Button label={isNovo ? 'Cadastrar' : 'Salvar'} type="submit" bgColor="primary" />
              </Style.ModalButtonRow>
            </form>
          </Style.ModalContainer>
        </Modal>
      )}
    </Style.Container>
  );
};

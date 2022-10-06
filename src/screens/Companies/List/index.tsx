/* eslint-disable no-shadow */
// LIBS
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// COMPONENTS
import { IconButton } from '../../../components/Buttons/IconButton';
import { Image } from '../../../components/Image';
import { Tag } from '../../../components/Tag';
import { Table, TableContent } from '../../../components/Table';
import { icon } from '../../../assets/icons/index';
import { Pagination } from '../../../components/Pagination';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

// TYPES
import { ICompany } from './utils/types';

// FUNCTIONS
import { requestUsersList } from './utils/functions';
import { dateFormatter } from '../../../utils/functions';

// MODALS
import { ModalCreateCompanyAndOwner } from './utils/modals/ModalCreateCompanyAndOwner';

export const CompaniesList = () => {
  // UTILS
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  // FILTER
  const [filter, setFilter] = useState<string>('');

  // PAGINATION
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const offset = 20;

  // CONSTS
  const [companies, setCompanies] = useState<ICompany[] | null>(null);

  const [modalCreateCompanyAndOwnerIsOpen, setModalCreateCompanyAndOwnerIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    requestUsersList({
      setCompanies,
      setLoading,
      page,
      setCount,
    });
  }, [state]);

  return (
    <>
      {modalCreateCompanyAndOwnerIsOpen && (
        <ModalCreateCompanyAndOwner
          setCompanies={setCompanies}
          page={page}
          setCount={setCount}
          setModal={setModalCreateCompanyAndOwnerIsOpen}
        />
      )}

      {loading ? (
        <DotSpinLoading />
      ) : (
        <>
          <Style.Header>
            <Style.LeftSide>
              <h2>Usuários</h2>

              <Style.SearchField>
                <IconButton
                  icon={icon.search}
                  size="16px"
                  onClick={() => {
                    requestUsersList({
                      setCompanies,
                      page: 1,
                      setCount,
                      filter,
                      setPage,
                    });
                  }}
                />
                <input
                  type="text"
                  maxLength={40}
                  placeholder="Procurar"
                  value={filter}
                  onChange={(evt) => {
                    setFilter(evt.target.value);
                    if (evt.target.value === '') {
                      requestUsersList({
                        setCompanies,
                        page: 1,
                        setCount,
                        filter: '',
                        setPage,
                      });
                    }
                  }}
                  onKeyUp={(evt) => {
                    if (evt.key === 'Enter') {
                      requestUsersList({
                        setCompanies,
                        page: 1,
                        setCount,
                        filter,
                        setPage,
                      });
                    }
                  }}
                />
              </Style.SearchField>
            </Style.LeftSide>
            <IconButton
              hideLabelOnMedia
              fontWeight="500"
              label="Cadastrar"
              className="p2"
              icon={icon.plusWithBg}
              onClick={() => {
                setModalCreateCompanyAndOwnerIsOpen(true);
              }}
            />
          </Style.Header>

          {companies?.length ? (
            <>
              <Table
                colsHeader={[
                  { label: '' },
                  {
                    label: 'Nome',
                    cssProps: {
                      paddingLeft: theme.size.xsm,
                    },
                  },
                  {
                    label: 'Responsável',
                    cssProps: {
                      paddingRight: theme.size.sm,
                    },
                  },
                  { label: 'Último acesso' },
                  { label: 'Status' },
                ]}
              >
                {companies.map((companie) => (
                  <TableContent
                    onClick={() => {
                      navigate(`/companies/${companie.id}`, {
                        state: companie,
                      });
                    }}
                    key={companie.id}
                    colsBody={[
                      {
                        cell: <Image size="32px" img={companie.image} key={companie.id} />,
                        cssProps: { width: '1%' },
                      },
                      {
                        cell: companie.name,
                        cssProps: {
                          width: '30%',
                          paddingLeft: theme.size.xsm,
                          paddingRight: theme.size.sm,
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '150px',
                        },
                      },
                      {
                        cell: companie.UserCompanies[0].User.name,
                        cssProps: {
                          width: '30%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '150px',
                          paddingRight: theme.size.sm,
                        },
                      },
                      {
                        cell: companie.UserCompanies[0].User.lastAccess
                          ? dateFormatter(companie.UserCompanies[0].User.lastAccess)
                          : '-',
                        cssProps: { width: '25%' },
                      },
                      {
                        cell: <Tag isInvalid={companie.isBlocked} key={companie.id} />,
                        cssProps: { width: '30%' },
                      },
                      {
                        cell: <img src={icon.rightArrow} width="16px" height="16px" alt="" />,
                        cssProps: { textAlign: 'end' },
                      },
                    ]}
                  />
                ))}
              </Table>

              <Style.PaginationFooter>
                <Pagination
                  totalCountOfRegister={count}
                  currentPage={page}
                  registerPerPage={offset}
                  onPageChange={(page) => {
                    setPage(page);
                    requestUsersList({
                      setCompanies,
                      setLoading,
                      page,
                      setCount,
                      filter,
                    });
                  }}
                />
              </Style.PaginationFooter>
            </>
          ) : (
            <Style.Container>
              <Image img={icon.paper} size="80px" radius="0" />
              <h3>Nenhum usuário encontrado.</h3>
            </Style.Container>
          )}
        </>
      )}
    </>
  );
};

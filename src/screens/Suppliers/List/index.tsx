import { useEffect, useState } from 'react';
import * as Style from './styles';
import { Api } from '../../../services/api';
import { applyMask, catchHandler } from '../../../utils/functions';
import { Image } from '../../../components/Image';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { ModalCreateSupplier } from './ModalCreateSupplier';
import { Pagination } from '../../../components/Pagination';
import { PaginationFooter } from '../../Tickets/styles';
import { ListTag } from '../../../components/ListTag';

interface ISupplier {
  id: string;
  image: string;
  name: string;
  state: string;
  city: string;

  phone: string | null;
  email: string | null;

  serviceTypes: {
    type: { label: string };
  }[];
}

export const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [supplierCounts, setSupplierCounts] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [modalCreateSupplierOpen, setModalCreateSupplierOpen] = useState(false);

  const findManySuppliers = async () => {
    await Api.get(`/suppliers`)
      .then((res) => {
        setSuppliers(res.data.suppliers);
        setSupplierCounts(res.data.supplierCounts);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findManySuppliers();
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <Style.Container>
      {modalCreateSupplierOpen && (
        <ModalCreateSupplier
          setModal={setModalCreateSupplierOpen}
          onThenRequest={async () => {
            findManySuppliers();
          }}
        />
      )}
      <Style.Header>
        <Style.LeftSide>
          <h2>Fornecedores</h2>
          {/*
          <Style.SearchField>
            <IconButton
              icon={icon.search}
              size="16px"
              onClick={() => {
                findManySuppliers(search);
              }}
            />
            <input
              type="text"
              maxLength={80}
              placeholder="Procurar"
              value={search}
              onChange={(evt) => {
                setSearch(evt.target.value);
                if (evt.target.value === '') {
                  findManySuppliers('');
                }
              }}
              onKeyUp={(evt) => {
                if (evt.key === 'Enter') {
                  findManySuppliers(search);
                }
              }}
            />
          </Style.SearchField> */}
        </Style.LeftSide>
        <IconButton
          hideLabelOnMedia
          fontWeight="500"
          label="Cadastrar"
          className="p2"
          icon={icon.plusWithBg}
          onClick={() => {
            setModalCreateSupplierOpen(true);
          }}
        />
      </Style.Header>

      {suppliers?.length > 0 ? (
        <Style.PaginationContainer>
          <Style.Wrapper>
            {suppliers.map((supplier) => (
              <Style.Card key={supplier.id} to={`/suppliers/${supplier.id}`}>
                <Style.ImageDiv>
                  <Image img={supplier.image} size="100px" />
                </Style.ImageDiv>

                <Style.CardContent>
                  <h5>{supplier.name}</h5>

                  <Style.Tags>
                    {supplier.serviceTypes.map(({ type }) => (
                      <ListTag
                        key={type.label}
                        label={type.label}
                        fontSize="14px"
                        lineHeight="16px"
                      />
                    ))}
                  </Style.Tags>

                  <p className="p">{`${supplier.city} / ${supplier.state}`}</p>
                </Style.CardContent>

                <Style.CardFooter>
                  <Style.Line />
                  <p className="p4">
                    {supplier.phone ? applyMask({ mask: 'TEL', value: supplier.phone }).value : '-'}
                  </p>
                  <p className="p4">{supplier.email || '-'}</p>
                </Style.CardFooter>
              </Style.Card>
            ))}
          </Style.Wrapper>
          <PaginationFooter>
            <Pagination
              totalCountOfRegister={supplierCounts}
              currentPage={page}
              registerPerPage={10}
              onPageChange={(pageParam) => {
                setPage(pageParam);
                findManySuppliers();
              }}
            />
          </PaginationFooter>
        </Style.PaginationContainer>
      ) : (
        <Style.Container>
          <Image img={icon.paper} size="80px" radius="0" />
          <h3>Nenhum fornecedor encontrado.</h3>
        </Style.Container>
      )}
    </Style.Container>
  );
};

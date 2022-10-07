// COMPONENTS
import { IconButton } from '../../../components/Buttons/IconButton';
import { icon } from '../../../assets/icons/index';
import { Image } from '../../../components/Image';

// STYLES
import * as Style from './styles';

export const BuildingsList = () => {
  // FILTER
  // const [filter, setFilter] = useState<string>('');

  // PAGINATION
  // const [count, setCount] = useState<number>(0);
  // const [page, setPage] = useState<number>(1);
  // const offset = 20;
  const buildings = [
    {
      name: 'Monte Ravello',
      location: 'Rio Maina, Criciúma',
      pending: 2,
      expired: 0,
      delayed: 10,
      completed: 20,
    },
    {
      name: 'Monte Ravello',
      location: 'Rio Maina, Criciúma',
      pending: 2,
      expired: 0,
      delayed: 10,
      completed: 20,
    },
    {
      name: 'Monte Ravello',
      location: 'Rio Maina, Criciúma',
      pending: 2,
      expired: 0,
      delayed: 10,
      completed: 20,
    },
    {
      name: 'Monte Ravello',
      location: 'Rio Maina, Criciúma',
      pending: 2,
      expired: 0,
      delayed: 10,
      completed: 20,
    },
    {
      name: 'Monte Ravello',
      location: 'Rio Maina, Criciúma',
      pending: 2,
      expired: 0,
      delayed: 10,
      completed: 20,
    },
  ];

  return (
    <>
      <Style.Header>
        <Style.LeftSide>
          <h2>Usuários</h2>

          <Style.SearchField>
            <IconButton
              icon={icon.search}
              size="16px"
              onClick={() => {
                // requestUsersList({
                //   setCompanies,
                //   page: 1,
                //   setCount,
                //   filter,
                //   setPage,
                // });
              }}
            />
            <input
              type="text"
              maxLength={40}
              placeholder="Procurar"
              // value={filter}
              // onChange={(evt) => {
              //   setFilter(evt.target.value);
              //   if (evt.target.value === '') {
              //     requestUsersList({
              //       setCompanies,
              //       page: 1,
              //       setCount,
              //       filter: '',
              //       setPage,
              //     });
              //   }
              // }}
              onKeyUp={(evt) => {
                if (evt.key === 'Enter') {
                  // requestUsersList({
                  //   setCompanies,
                  //   page: 1,
                  //   setCount,
                  //   filter,
                  //   setPage,
                  // });
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
            // setModalCreateCompanyAndOwnerIsOpen(true);
          }}
        />
      </Style.Header>

      <Style.GridContainer>
        {buildings.map((building, i: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <Style.BuildingCard key={i}>
            <Style.BuildingCardHeader>
              <Style.BuildingCardHeaderInfo>
                <h5>{building.name}</h5>
                <p className="p3">{building.location}</p>
              </Style.BuildingCardHeaderInfo>

              <Image img={icon.rightArrow} size="16px" />
            </Style.BuildingCardHeader>

            <Style.BuildingCardFooter>
              <Style.BuildingCardFooterInfo>
                <h5 className="pending">{building.pending}</h5>
                <p className="p5">Pendentes</p>

                <h5 className="delayed">{building.delayed}</h5>
                <p className="p5">Feitas em atraso</p>
              </Style.BuildingCardFooterInfo>
              <Style.BuildingCardFooterInfo>
                <h5 className="expired">{building.expired}</h5>
                <p className="p5">Vencidas</p>

                <h5 className="completed">{building.completed}</h5>
                <p className="p5">Concluídas</p>
              </Style.BuildingCardFooterInfo>
            </Style.BuildingCardFooter>
          </Style.BuildingCard>
        ))}
      </Style.GridContainer>
    </>
  );
};

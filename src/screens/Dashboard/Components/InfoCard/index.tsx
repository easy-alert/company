import * as Style from './styles';

type CountAndCostItem = {
  category: string;
  count: number;
};

interface InfoCardProps {
  title: string;
  totals?: number;
  names?: { name: string; number: number }[];
  categories?: CountAndCostItem[];
}

export const InfoCard = ({ title, totals, names, categories }: InfoCardProps) => {
  const noData =
    !totals && (!names || names.length === 0) && (!categories || categories.length === 0);

  return (
    <Style.Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <h5>{title}</h5>
        {categories && categories.length > 0 && <h5>(Categorias) </h5>}
      </div>

      {noData ? (
        <Style.EmptyMessage>Sem dados</Style.EmptyMessage>
      ) : (
        <>
          <Style.Container>
            {!categories && (
              <Style.InfoItem style={{ marginBottom: '12px' }}>
                <h2>Totais:</h2>
                <h2>{totals}</h2>
              </Style.InfoItem>
            )}
          </Style.Container>

          <Style.Container>
            {names && names.length > 0 && (
              <Style.InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Style.NameScrollContainer>
                  {names.map((item) => (
                    <Style.NameItem key={item.name}>
                      <h2>{item.name}</h2>
                      <h2>{item.number}</h2>
                    </Style.NameItem>
                  ))}
                </Style.NameScrollContainer>
              </Style.InfoItem>
            )}

            {categories && categories.length > 0 && (
              <Style.InfoItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Style.CategoryScrollContainer>
                  {categories.map((item) => (
                    <Style.CategoryItem key={item.category}>
                      <h2>{item.category}</h2>
                      <h2>{item.count}</h2>
                    </Style.CategoryItem>
                  ))}
                </Style.CategoryScrollContainer>
              </Style.InfoItem>
            )}
          </Style.Container>
        </>
      )}
    </Style.Card>
  );
};

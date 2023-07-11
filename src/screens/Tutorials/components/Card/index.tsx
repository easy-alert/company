import * as Style from './styles';
import { Image } from '../../../../components/Image';

interface ICard {
  figure: any;
  title: string;
  description: string;
  onClick: () => void;
}

export const Card = ({ figure, title, description, onClick }: ICard) => (
  <Style.Card onClick={() => onClick()}>
    <Style.Header>
      <Image img={figure} size="200px" />
    </Style.Header>

    <Style.Content>
      <h3>{title}</h3>
      <h6>{description}</h6>
    </Style.Content>
  </Style.Card>
);

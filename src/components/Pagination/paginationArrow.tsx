import IconRightArrow from '@assets/icons/IconRightArrow';
import IconLeftArrow from '@assets/icons/IconLeftArrow';
import { Next, Previous } from './style';

interface PaginationItemProps {
  pageNumber: number;
  onPageChange: (page: number) => void;
  previous?: boolean;
  disabled?: boolean;
}

const PaginationArrow: React.FC<PaginationItemProps> = ({
  pageNumber,
  onPageChange,
  previous,
  disabled,
}: PaginationItemProps) => {
  if (previous) {
    return (
      <Previous disabled={disabled} onClick={() => onPageChange(pageNumber)}>
        <IconLeftArrow strokeColor="primary" />
      </Previous>
    );
  }

  return (
    <Next disabled={disabled} onClick={() => onPageChange(pageNumber)}>
      <IconRightArrow strokeColor="primary" />
    </Next>
  );
};

export default PaginationArrow;

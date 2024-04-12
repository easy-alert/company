/* eslint-disable no-nested-ternary */
import * as Style from './styles';
import { ITagsArray } from './types';
import { ListTag } from '../ListTag';

export const TagsArray = ({ data }: ITagsArray) => (
  <Style.TagsWrapper>
    {data && data?.length > 0
      ? data?.map((tag, index) => {
          const bgColorToRender =
            index % 3 === 0 ? '#28A5FF' : index % 3 === 1 ? '#104B75' : '#FF7B1C';

          return (
            <ListTag
              // eslint-disable-next-line react/no-array-index-key
              key={tag + index}
              label={tag}
              color="#FFFFFF"
              backgroundColor={bgColorToRender}
              fontWeight={500}
              padding="2px 4px"
            />
          );
        })
      : '-'}
  </Style.TagsWrapper>
);

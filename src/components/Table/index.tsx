/* eslint-disable react/no-array-index-key */
import { useState } from 'react';

import { Pagination } from '@components/Pagination';

import { theme } from '@styles/theme';

import * as Style from './styles';

import type { ITableBody, ITableHeader } from './types';

export const Table = ({
  colsHeader,
  children,
  pagination,
  totalCountOfRegister,
  registerPerPage,
}: ITableHeader) => {
  const [page, setPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Style.Background>
      <Style.TableContainer>
        <Style.TableHead>
          <Style.TableRowHead>
            {colsHeader.map((col) => (
              <Style.TableColHeader
                key={col.label}
                cssProps={col.cssProps}
                cssOnMedia={col.cssOnMedia}
              >
                {col.label}
              </Style.TableColHeader>
            ))}
          </Style.TableRowHead>
        </Style.TableHead>

        <Style.TableBody>
          {children.slice((page - 1) * (registerPerPage || 0), page * (registerPerPage || 0))}
        </Style.TableBody>
      </Style.TableContainer>

      {pagination && (
        <Style.PaginationContainer>
          <Pagination
            currentPage={page}
            totalCountOfRegister={totalCountOfRegister || 0}
            registerPerPage={registerPerPage || 0}
            onPageChange={handlePageChange}
          />
        </Style.PaginationContainer>
      )}
    </Style.Background>
  );
};

export const TableContent = ({ colsBody, onClick }: ITableBody) => (
  <Style.TableRow bgColor={theme.color.white} hasOnClick={!!onClick} onClick={onClick}>
    {colsBody.map((col, i: number) => (
      <Style.TableColBody key={col.cell + i} cssOnMedia={col.cssOnMedia} cssProps={col.cssProps}>
        {col.cell}
      </Style.TableColBody>
    ))}
  </Style.TableRow>
);

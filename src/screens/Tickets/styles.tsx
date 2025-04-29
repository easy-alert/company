import styled from 'styled-components';

import { theme } from '@styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 96vh;

  margin-top: ${theme.size.sm};

  gap: ${theme.size.sm};

  @media (max-width: 1100px) {
    height: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.xxsm};

  @media (max-width: 900px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

export const HeaderSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  @media (max-width: 600px) {
    gap: ${theme.size.sm};
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};

  .select {
    max-width: 300px;
  }

  @media (max-width: 900px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const FiltersContainer = styled.div`
  background-color: ${theme.color.white};
  padding: ${theme.size.sm};
  border-radius: ${theme.size.xxsm};
`;

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${theme.size.xsm};

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${theme.size.sm};
  grid-area: 2 / 4;
  align-self: flex-start;
`;

export const FilterTags = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
  flex-wrap: wrap;

  grid-area: 2 / 1 / 2 / 4;
`;

export const FilterWrapperFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: ${theme.size.sm};
`;

export const Kanban = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.size.sm};
  overflow: auto;
  height: 100%;

  scrollbar-width: none;
  scrollbar-color: transparent;
  scroll-snap-type: x mandatory;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

export const KanbanCard = styled.div`
  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  scroll-snap-align: start;
  min-width: 300px;
  overflow: auto;
  padding-bottom: ${theme.size.sm};

  scrollbar-width: none;
  scrollbar-color: transparent;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

export const KanbanHeader = styled.div<{ status?: string }>`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${theme.color.white};
  z-index: 9;
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.xsm} ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.sm};

  border-left: ${({ status }) => {
    if (status === 'Em execução') return `4px solid ${theme.color.warning}`;
    if (status === 'Concluídos') return `4px solid ${theme.color.success}`;
    if (status === 'Indeferidos') return `4px solid ${theme.color.danger}`;
    return 'none';
  }};

  > label {
    display: flex;
    align-items: center;
    gap: ${theme.size.xxsm};

    cursor: pointer;
    color: ${theme.color.gray4};
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }
`;

export const KanbanTicketWrapper = styled.div`
  padding: 0 ${theme.size.sm} 0 ${theme.size.sm};
  margin: 1rem 0;
`;

export const KanbanTicketInfo = styled.div<{
  statusBgColor?: string;
}>`
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.sm} 23px;
  background-color: ${theme.color.gray0};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};
  border-radius: ${theme.size.xxsm};

  :hover {
    opacity: 0.8;
    cursor: pointer;
  }

  > h6 {
    > span {
      display: flex;
      align-items: center;
      gap: ${theme.size.xxsm};
      flex-wrap: wrap;
      margin-bottom: 4px;
    }
  }

  word-break: break-word;

  ${({ statusBgColor }) =>
    statusBgColor &&
    `
    background: linear-gradient(90deg, ${statusBgColor} 0%, ${statusBgColor} 7px, white 7px, white 100%);
    `}
`;

export const KanbanTicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: ${theme.size.xsm};
`;

export const KanbanTicketHeaderInfo = styled.div`
  display: flex;
  flex-direction: row;

  gap: ${theme.size.xsm};
`;

export const KanbanTicketNumber = styled.h1`
  min-width: 30px;

  font-size: 18px;
  font-weight: 700;
  line-height: 16px;

  color: ${theme.color.primary};
`;

export const KanbanTicketBuildingName = styled.h6`
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${theme.color.gray6};
`;

export const KanbanTicketNewTag = styled.span`
  background-color: ${theme.color.primary};
  padding: 4px 4px;
  border-radius: 100%;
`;

export const KanbanTicketGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row: 1fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

export const KanbanTicketGridBox = styled.div`
  font-size: 40px;
  font-family: sans-serif;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const KanbanTicketTitle = styled.h6`
  font-size: 10px;
  line-height: 16px;
  color: ${theme.color.gray4};
  margin-bottom: ${theme.size.xxsm};
`;

export const KanbanTicketDescription = styled.p`
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  color: ${theme.color.black};
`;

export const KanbanTicketListTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.xsm};
`;

export const PaginationFooter = styled.footer`
  margin-top: 8px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: flex-end;
`;

export const NoDataContainer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 84%;
  gap: ${theme.size.xxsm};
  > h3 {
    color: ${theme.color.gray4};
    text-align: center;
  }
`;

export const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ListItemWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }

  h5 {
    margin: 0 0 8px;
    font-weight: 600;
  }

  p {
    margin: 4px 0;
  }
`;

export const Chevron = styled.span<{ $expanded: boolean }>`
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid ${theme.color.primary};
  transition: transform 0.2s ease;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(0)' : 'rotate(-90deg)')};
`;

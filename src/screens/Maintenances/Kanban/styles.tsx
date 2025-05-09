import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

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
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.size.xsm};
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

export const FilterWrapperFooter = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${theme.size.xsm};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;

  gap: ${theme.size.sm};

  margin-top: ${theme.size.xsm};
`;

export const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: ${theme.size.xsm};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;

  gap: ${theme.size.sm};
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
  min-width: 300px;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: ${theme.size.xsm};

  overflow: auto;

  background-color: ${theme.color.white};
  border-radius: ${theme.size.xxsm};
  padding-bottom: ${theme.size.sm};

  scrollbar-width: none;
  scrollbar-color: transparent;
  scroll-snap-align: start;

  ::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

export const KanbanHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${theme.color.white};
  z-index: 4;
  padding: ${theme.size.sm} ${theme.size.sm} ${theme.size.xsm} ${theme.size.sm};
  border-radius: ${theme.size.xxsm};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.size.sm};

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

export const KanbanMaintenanceWrapper = styled.div`
  padding: 0 ${theme.size.sm} 0 ${theme.size.sm};
`;

export const MaintenanceInfo = styled.div<{
  status: 'expired' | 'pending' | 'completed' | 'overdue' | 'inProgress';
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
      margin-bottom: 4px;
    }
  }

  word-break: break-word;

  ${({ status }) =>
    (status === 'pending' || status === 'inProgress') &&
    css`
      p.p3 {
        color: ${theme.color.warning};
        font-weight: 500;
      }
      background: linear-gradient(
        90deg,
        rgba(255, 178, 0, 1) 0%,
        rgba(255, 178, 0, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}

  ${({ status }) =>
    status === 'expired' &&
    css`
      p.p3 {
        color: ${theme.color.actionDanger};
        font-weight: 500;
      }
      background: linear-gradient(
        90deg,
        rgba(255, 53, 8, 1) 0%,
        rgba(255, 53, 8, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}

    ${({ status }) =>
    (status === 'overdue' || status === 'completed') &&
    css`
      p.p3 {
        color: ${theme.color.success};
        font-weight: 500;
      }
    `}

    ${({ status }) =>
    (status === 'completed' || status === 'overdue') &&
    css`
      background: linear-gradient(
        90deg,
        rgba(52, 181, 58, 1) 0%,
        rgba(52, 181, 58, 1) 7px,
        rgba(250, 250, 250, 1) 7px,
        rgba(250, 250, 250, 1) 100%
      );
    `}
`;

export const EventsWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: ${theme.size.xxsm};
`;

export const NoDataContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${theme.color.gray4};
  padding: 0 ${theme.size.sm} 0 ${theme.size.sm};
`;

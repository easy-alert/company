import styled from 'styled-components';

export const Container = styled.header`
  width: 100%;
  padding-top: ${({ theme }) => theme.size.sm};
`;

export const MonthEventWrapper = styled.div`
  display: flex;
  align-items: center;
  color: black;
  border-radius: 8px;
  padding: 0px 12px;
  font-weight: 500;
  font-size: 13px;
  height: 24px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
`;

export const WeekMaintenanceEventWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  color: black;
  box-sizing: border-box;
  padding: 12px;
  cursor: pointer;
`;

export const CustomEventBar = styled.div`
  height: ${({ theme }) => theme.size.xxsm};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.size.xxsm};
  border-radius: ${({ theme }) => theme.size.xxsm};
  background: ${({ theme }) => theme.color.gray2};
`;

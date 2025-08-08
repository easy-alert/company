import styled from 'styled-components';

export const Container = styled.div`
  padding: ${({ theme }) => theme.size.lg};
`;

export const FiltrosWrapper = styled.div`
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
  box-shadow: 0 2px 8px #0001;
  padding: ${({ theme }) => `${theme.size.md} ${theme.size.lg}`};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.size.csm2};
  position: relative;
`;

export const IconReportWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 24px;
  z-index: 2;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Filtros = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size.md};
  justify-content: center;
  align-items: flex-start;

  & > div {
    display: flex;
    flex-direction: column;
    min-width: 220px;
  }
`;
export const Tabela = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 ${({ theme }) => theme.size.md};
`;

export const Linha = styled.tr`
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.xxsm};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.size.md};
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.size.csm};
  > h2 {
    font-size: 22px;
    font-weight: 600;
    margin: 0;
  }
`;

export const CelulaHeader = styled.th`
  color: ${({ theme }) => theme.color.gray4};

  padding-top: ${({ theme }) => theme.size.md};
  text-align: center;
`;

export const Text = styled.td`
  padding: ${({ theme }) => theme.size.md};
  text-align: center;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.size.csm2};
`;

export const StatusConforme = styled.span`
  color: ${({ theme }) => theme.color.success};
`;

export const StatusNaoConforme = styled.span`
  color: ${({ theme }) => theme.color.danger};
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const FilterButtonWrapper2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  gap: ${({ theme }) => theme.size.csm};
  padding-right: ${({ theme }) => theme.size.xsm};
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.md};
`;

export const ModalRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.size.xsm};

  input,
  select {
    padding: ${({ theme }) => `${theme.size.xsm} ${theme.size.csm}`};
    border-radius: ${({ theme }) => theme.size.csm};
    border: 1px solid ${({ theme }) => theme.color.gray2};
  }
`;

export const ModalButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.size.csm};
  margin-top: ${({ theme }) => theme.size.csm};
  align-items: center;
`;

export const Tags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.size.xsm};

  margin: ${({ theme }) => `${theme.size.csm} 0 0 0`};
  font-size: ${({ theme }) => theme.size.csm2};
`;

export const ListTag = styled.span<{ clickable?: boolean }>`
  background-color: rgb(220, 38, 38);
  color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.size.csm};
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.size.xsm};
  font-size: ${({ theme }) => theme.size.csm};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
`;

export const ListTagClose = styled.span`
  margin-left: ${({ theme }) => theme.size.xsm};
  font-weight: 700;
  font-size: 16px;
`;

export const CelulaAcoes = styled.td`
  padding: ${({ theme }) => `${theme.size.csm} ${theme.size.lg}`};
`;

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { theme } from '../../../styles/theme';

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.size.sm};
  padding-top: ${theme.size.sm};

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.sm};

  @media (max-width: 900px) {
    width: 60%;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.size.xxsm};
  }
`;

export const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xxsm};
  width: 100%;
  > input {
    height: 24px;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none !important;
    outline: none;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.size.xxsm};
  > h3 {
    color: ${theme.color.gray4};
    text-align: center;
  }
`;

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(325px, 1fr));
  gap: ${theme.size.md};
`;

export const Card = styled(Link)`
  background-color: ${theme.color.white};
  padding: ${theme.size.md};
  border-radius: ${theme.size.xsm};
  color: ${theme.color.black};

  cursor: pointer;
  transition: 0.1s;

  :hover {
    scale: 1.05;
  }

  display: flex;
  flex-direction: column;
  gap: ${theme.size.md};
`;

export const Line = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${theme.color.gray3};
  margin-bottom: ${theme.size.xsm};
`;

export const CardContent = styled.div`
  > p {
    margin-top: ${theme.size.xsm};
    color: #3f3e3e;
  }
`;

export const CardFooter = styled.div`
  color: #3f3e3e;
  margin-top: auto;
`;

export const ImageDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export const PaginationContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.size.xxsm};
  margin-top: ${theme.size.xsm};
`;

export const NameAndImage = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.size.xsm};
`;

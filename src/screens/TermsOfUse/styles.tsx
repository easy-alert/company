import styled from 'styled-components';

export const Container = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: auto;

  > img {
    margin-top: 40px;
    margin-bottom: 20px;
    max-width: 250px;
  }
`;

export const Content = styled.div`
  max-width: 1050px;
  text-align: center;
  padding: 10px;
  > h1 {
    margin-top: 40px;
    margin-bottom: 24px;
  }
  > p {
    white-space: pre-wrap;
    text-align: center;
  }
`;

export const Footer = styled.div`
  width: 100%;
  height: 65px;
  background-color: #b21d1d;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  > span {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
`;

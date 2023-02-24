import styled from 'styled-components';
import bg from '../../../../../../assets/images/backgroundForPDF.png';

export const Container = styled.div`
  overflow: hidden;
  background: url(${bg}) no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  text-align: center;

  min-height: 1122px;
  height: 100vh; /* Use 100% here to support printing more than a single page*/
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden;

  > img {
    object-fit: contain;
    max-height: 200px;
    min-height: 100px;
  }

  > :first-child {
    margin-top: 50px;
  }

  > :last-child {
    margin-bottom: 50px;
  }
`;

export const Middle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 70px;

  > h2 {
    font-weight: 400;
    width: 640px;
    font-size: 26px;
    line-height: 28px;
  }
`;

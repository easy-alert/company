// COMPONENTS
import { theme } from '../../styles/theme';
import * as Style from './styles';
import { IColorfulTableBody, IColorfulTableHeader } from './types';

export const ColorfulTable = ({ colsHeader, children, cssProps }: IColorfulTableHeader) => (
  <Style.TableBackground>
    <Style.TableContainer $cssProps={cssProps || ''}>
      <Style.TableHead>
        <Style.TableRowHead>
          {colsHeader.map((col) => (
            <Style.TableColHeader
              key={col.label}
              $cssProps={col.cssProps}
              $cssOnMedia={col.cssOnMedia}
            >
              {col.label}
            </Style.TableColHeader>
          ))}
        </Style.TableRowHead>
      </Style.TableHead>
      <Style.TableBody>{children}</Style.TableBody>
    </Style.TableContainer>
  </Style.TableBackground>
);

export const ColorfulTableContent = ({
  colsBody,
  bgColor = theme.color.white,
}: IColorfulTableBody) => (
  <Style.TableRow $bgColor={bgColor}>
    {colsBody.map((col) => (
      <Style.TableColBody
        key={col.cell + Math.floor(Math.random() * 10000) + 1}
        $cssOnMedia={col.cssOnMedia}
        $cssProps={col.cssProps}
      >
        {col.cell}
      </Style.TableColBody>
    ))}
  </Style.TableRow>
);

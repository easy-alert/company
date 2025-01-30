import * as Style from './styles';

function Forbidden() {
  return (
    <Style.ForbiddenContainer>
      <Style.ForbiddenContent>
        <Style.ForbiddenTitle>Você não tem permissão para acessar essa página</Style.ForbiddenTitle>
        <Style.ForbiddenText>
          Entre em contato com o administrador para mais informações
        </Style.ForbiddenText>
      </Style.ForbiddenContent>
    </Style.ForbiddenContainer>
  );
}

export default Forbidden;

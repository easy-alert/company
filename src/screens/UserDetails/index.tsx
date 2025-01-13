// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// CONTEXTS
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// SERVICES
import { Api } from '@services/api';
import { getUserById } from '@services/apis/getUserById';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { Tag } from '@components/Tag';
import { PopoverButton } from '@components/Buttons/PopoverButton';

// GLOBAL UTILS
import {
  applyMask,
  catchHandler,
  dateFormatter,
  dateTimeFormatter,
  translateTicketType,
} from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import { theme } from '@styles/theme';

// GLOBAL TYPES
import type { IUser } from '@customTypes/IUser';

// STYLES
import { handleToastify } from '@utils/toastifyResponses';
import { ReturnButton } from '@components/Buttons/ReturnButton';
import * as Style from './styles';

function UserDetails() {
  const { userId } = useParams() as { userId: string };
  const { account, setAccount } = useAuthContext();

  const [userData, setUserData] = useState<IUser>();
  const [userModulePermissions, setUserModulePermissions] = useState([
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
    {
      label: 'Usuários',
      moduleName: 'users',
      permissions: [
        { name: 'user:create', label: 'Criar usuário', value: true },
        { name: 'user:read', label: 'Listar usuários', value: true },
        { name: 'user:update', label: 'Editar usuário', value: true },
        { name: 'user:delete', label: 'Deletar usuário', value: true },
      ],
    },
  ]);

  const [onQuery, setOnQuery] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGetUserById = async () => {
    setLoading(true);

    try {
      const responseData = await getUserById(userId);

      setUserData(responseData);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeModuloCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const newPermissions = userModulePermissions.map((module) => {
      if (module.moduleName === name) {
        return {
          ...module,
          permissions: module.permissions.map((perm) => ({ ...perm, value: checked })),
        };
      }

      return module;
    });

    setUserModulePermissions(newPermissions);
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const newPermissions = userModulePermissions.map((module) => {
      if (module.permissions.find((perm) => perm.name === name)) {
        return {
          ...module,
          permissions: module.permissions.map((perm) => {
            if (perm.name === name) {
              return { ...perm, value: checked };
            }

            return perm;
          }),
        };
      }

      return module;
    });

    setUserModulePermissions(newPermissions);
  };

  useEffect(() => {
    handleGetUserById();
  }, [userId]);

  return (
    <>
      <Style.Header>
        <Style.HeaderTitle>Configurações de usuário</Style.HeaderTitle>
        <ReturnButton path="/account" />
      </Style.Header>

      <Style.PermissionsContainer>
        <Style.PermissionsHeader>
          <h5>Permissões</h5>
        </Style.PermissionsHeader>

        <Style.PermissionsCardContainer>
          {userModulePermissions.map((module) => (
            <Style.PermissionsCard key={module.moduleName}>
              <Style.PermissionsCardHeader>
                <Style.PermissionsCardHeaderTitle>{module.label}</Style.PermissionsCardHeaderTitle>

                <Style.Checkbox
                  name={module.moduleName}
                  type="checkbox"
                  checked={module.permissions.every((perm) => perm.value)}
                  onChange={handleChangeModuloCheckbox}
                />
              </Style.PermissionsCardHeader>

              {module.permissions.map((perm) => (
                <Style.PermissionsCardItem key={perm.name}>
                  <Style.PermissionsCardItemTitle>{perm.label}</Style.PermissionsCardItemTitle>

                  <Style.Checkbox
                    name={perm.name}
                    type="checkbox"
                    checked={perm.value}
                    onChange={handleChangeCheckbox}
                  />
                </Style.PermissionsCardItem>
              ))}
            </Style.PermissionsCard>
          ))}
        </Style.PermissionsCardContainer>
      </Style.PermissionsContainer>
    </>
  );
}

export default UserDetails;

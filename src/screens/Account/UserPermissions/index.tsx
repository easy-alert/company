// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useParams } from 'react-router-dom';

// HOOKS
import { useBuildings } from '@hooks/useBuildings';

// SERVICES
import { getAllPermissions } from '@services/apis/getAllPermissions';
import { getUserPermissionsById } from '@services/apis/getUserPermissionsById';
import { putUserPermissionsById } from '@services/apis/putUserPermissionsById';
import { getUserBuildingsPermissionsById } from '@services/apis/getUserBuildingsPermissionsById ';
import { putUserBuildingsPermissionsById } from '@services/apis/putUserBuildingsPermissionsById';

// GLOBAL COMPONENTS
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Button } from '@components/Buttons/Button';
import { ReturnButton } from '@components/Buttons/ReturnButton';

// GLOBAL UTILS
import { handleToastify } from '@utils/toastifyResponses';

// GLOBAL TYPES
import type { IPermission } from '@customTypes/IPermission';

// STYLES

import { useBuildingsForSelect } from '@hooks/useBuildingsForSelect';
import { InputCheckbox } from '@components/Inputs/InputCheckbox';
import * as Style from './styles';

interface IModule {
  moduleName: string;
  moduleLabel: string;
}

interface IUserPermissions {
  id: string;
  name: string;
}

interface IUserBuildingsPermissions {
  buildingId: string;
  Permission?: IPermission;
}

function UserPermissions() {
  const { userId } = useParams() as { userId: string };
  const { buildingsForSelect } = useBuildingsForSelect({ checkPerms: false });

  const [userPermissions, setUserPermissions] = useState<IUserPermissions[]>([]);
  const [userBuildingsPermissions, setUserBuildingsPermissions] = useState<
    IUserBuildingsPermissions[]
  >([]);

  const [modules, setModules] = useState<IModule[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);

  const [loading, setLoading] = useState(false);

  // #region handle api calls
  const handleGetAllPermissions = async () => {
    setLoading(true);

    try {
      const responseData = await getAllPermissions({ adminPermissions: false });

      setPermissions(responseData.permissions);
      setModules(responseData.modules);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserPermissionsById = async () => {
    setLoading(true);

    try {
      const responseData = await getUserPermissionsById(userId);

      setUserPermissions(responseData.userPermissions);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserBuildingsPermissionsById = async () => {
    setLoading(true);

    try {
      const responseData = await getUserBuildingsPermissionsById(userId);

      setUserBuildingsPermissions(responseData.userBuildingsPermissions);
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermissions = async () => {
    setLoading(true);

    try {
      await putUserPermissionsById({
        userId,
        userPermissions,
      });

      await putUserBuildingsPermissionsById({
        userId,
        userBuildingsPermissions,
      });
    } catch (error: any) {
      handleToastify(error);
    } finally {
      setLoading(false);
    }
  };
  // #endregion

  // #region handle functions
  const handleChangeModuleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (checked) {
      const perms = permissions.filter((perm) => perm.moduleName === name);
      const formattedPerms = perms.map((perm) => ({ id: perm.id, name: perm.name }));

      const uniquePerms = [
        ...userPermissions,
        ...formattedPerms.filter(
          (newPerm) => !userPermissions.some((existingPerm) => existingPerm.name === newPerm.name),
        ),
      ];

      setUserPermissions(uniquePerms);
    } else {
      setUserPermissions(userPermissions.filter((perm) => !perm.name.startsWith(name)));
    }
  };

  const handleModulesCheckboxChecked = (moduleName: string) => {
    const modulePermissions = permissions.filter((perm) => perm.moduleName === moduleName);

    if (modulePermissions.length === 0) return false;

    const checked = modulePermissions.every((perm) =>
      userPermissions.some((up) => up.name === perm.name),
    );

    return checked;
  };

  const handleBuildingsModulesCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;

    if (checked) {
      const perms = buildingsForSelect.map(
        (b) => ({ buildingId: b.id } as IUserBuildingsPermissions),
      );

      setUserBuildingsPermissions(perms);
    } else {
      setUserBuildingsPermissions([]);
    }
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (checked) {
      const perms = permissions.find((p) => p.name === name);

      if (perms) {
        const formattedPerms = { id: perms.id, name: perms.name };
        setUserPermissions([...userPermissions, formattedPerms]);
      }
    } else {
      setUserPermissions(userPermissions.filter((perm) => perm.name !== name));
    }
  };

  const handleChangeBuildingsCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    if (checked) {
      const perms = buildingsForSelect.find((b) => b.id === name);
      const formattedPerms = { buildingId: perms?.id } as IUserBuildingsPermissions;

      setUserBuildingsPermissions([...userBuildingsPermissions, formattedPerms]);
    } else {
      setUserBuildingsPermissions(
        userBuildingsPermissions.filter((perm) => perm.buildingId !== name),
      );
    }
  };

  // #endregion

  useEffect(() => {
    if (!userId) return;

    handleGetAllPermissions();
    handleGetUserPermissionsById();
    handleGetUserBuildingsPermissionsById();
  }, [userId]);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      <Style.Header>
        <div>
          <Style.HeaderTitle>Permissões do usuário</Style.HeaderTitle>
          <ReturnButton path="/account" />
        </div>

        <div>
          <Button label="Salvar" onClick={handleSavePermissions}>
            Salvar
          </Button>
        </div>
      </Style.Header>

      <Style.PermissionsContainer>
        <Style.PermissionsCardContainer>
          {modules.map((module) => (
            <Style.PermissionsCard key={module.moduleName}>
              <Style.PermissionsCardHeader>
                <Style.PermissionsCardHeaderTitle>
                  {module.moduleLabel}
                </Style.PermissionsCardHeaderTitle>

                <Style.Checkbox
                  name={module.moduleName}
                  type="checkbox"
                  checked={handleModulesCheckboxChecked(module.moduleName)}
                  onChange={handleChangeModuleCheckbox}
                />
              </Style.PermissionsCardHeader>

              {permissions
                .filter((perm) => perm.moduleName === module.moduleName)
                .map((perm) => (
                  <Style.PermissionsCardItem key={perm.name}>
                    <Style.PermissionsCardItemLabel htmlFor={perm.name}>
                      {perm.label}
                    </Style.PermissionsCardItemLabel>

                    <Style.Checkbox
                      id={perm.name}
                      name={perm.name}
                      type="checkbox"
                      checked={userPermissions.some((up) => up.name === perm.name)}
                      onChange={handleChangeCheckbox}
                    />
                  </Style.PermissionsCardItem>
                ))}
            </Style.PermissionsCard>
          ))}
        </Style.PermissionsCardContainer>

        <Style.BuildingsCardsContainer>
          <Style.BuildingsCard key="buildings-ids">
            <Style.PermissionsCardHeader>
              <Style.PermissionsCardHeaderTitle>Edificações</Style.PermissionsCardHeaderTitle>

              <Style.Checkbox
                name="buildings-ids"
                type="checkbox"
                onChange={handleBuildingsModulesCheckbox}
              />
            </Style.PermissionsCardHeader>

            <Style.BuildingsPermissionsContainer>
              {buildingsForSelect.map((building) => (
                <Style.PermissionsCardItem
                  key={building.id}
                  style={{ gap: '0.5rem', alignItems: 'center' }}
                >
                  <Style.PermissionsCardItemLabel htmlFor={building.id}>
                    {building.name}
                  </Style.PermissionsCardItemLabel>

                  <Style.Checkbox
                    id={building.id}
                    name={building.id}
                    type="checkbox"
                    checked={userBuildingsPermissions.some((up) => up.buildingId === building.id)}
                    onChange={handleChangeBuildingsCheckbox}
                    style={{ minWidth: '16px' }}
                  />
                </Style.PermissionsCardItem>
              ))}
            </Style.BuildingsPermissionsContainer>
          </Style.BuildingsCard>
        </Style.BuildingsCardsContainer>
      </Style.PermissionsContainer>
    </>
  );
}

export default UserPermissions;

import { Api } from '@services/api';

import { handleToastify } from '@utils/toastifyResponses';

import type { IPermission } from '@customTypes/IPermission';
import type { IResponse } from '@customTypes/IResponse';

interface IGetAllPermissions {
  adminPermissions: boolean;
}

interface IResponseAllPermissions extends IResponse {
  data: {
    permissions: IPermission[];
    modules: {
      moduleName: string;
      moduleLabel: string;
    }[];
  };
}

export const getAllPermissions = async ({ adminPermissions }: IGetAllPermissions) => {
  const uri = 'permissions';

  const params = {
    adminPermissions,
  };

  try {
    const response: IResponseAllPermissions = await Api.get(uri, { params });

    const permissions = response.data.permissions.filter(
      (permission) => !permission.name.includes('backoffice'),
    );

    const modules = response.data.modules.filter(
      (module) => !module.moduleName.includes('backoffice'),
    );

    return {
      permissions,
      modules,
    };
  } catch (error: any) {
    handleToastify(error.response.data.ServerMessage);

    return {
      permissions: [],
      modules: [],
    };
  }
};

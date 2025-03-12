import { useState } from 'react';

// HOOKS
import { useUsersForSelect } from '@hooks/useUsersForSelect';
import { useAuthContext } from '@contexts/Auth/UseAuthContext';

// GLOBAL COMPONENTS
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { Select } from '@components/Inputs/Select';
import { Input } from '@components/Inputs/Input';
import { Button } from '@components/Buttons/Button';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import type { IUser } from '@customTypes/IUser';

// GLOBAL STYLES
import * as Style from './styles';

interface IUserResponsible {
  user: IUser;
  buildingId?: string;
}

const UserResponsible = ({ user: initialUser, buildingId }: IUserResponsible) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialUser);
  const [editedEmail, setEditedEmail] = useState(initialUser.email);

  const { account } = useAuthContext();
  const { usersForSelect } = useUsersForSelect({ buildingId, checkPerms: true });

  const isAdmin =
    account?.User?.Permissions?.some((permission) => permission?.Permission?.name === 'admin') ||
    false;

  const handleSave = () => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      email: editedEmail,
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedUser(initialUser);
    setEditedEmail(initialUser.email);
  };

  return (
    <Style.UserResponsibleContainer>
      <Style.UserResponsibleHeader>
        <h3>Usuário Responsável</h3>
        {!isEditing && isAdmin && (
          <IconButton icon={icon.edit} size="16px" onClick={() => setIsEditing(true)} />
        )}
      </Style.UserResponsibleHeader>

      <Style.UserResponsibleContent>
        <Style.UserResponsibleImageContent>
          <Image img={selectedUser?.image || icon.personPlaceholder} size="64px" />
        </Style.UserResponsibleImageContent>

        <Style.UserResponsibleData>
          <Style.UserResponsibleDataRow>
            <p>Usuário</p>
            {isEditing ? (
              <Select
                value={selectedUser.id}
                onChange={(e) => {
                  const selected = usersForSelect?.find((u) => u.id === e.target.value);
                  if (selected) {
                    setSelectedUser(selected);
                    setEditedEmail(selected.email);
                  }
                }}
              >
                <option value="" disabled>
                  Selecione um usuário
                </option>
                {usersForSelect?.map((userOption) => (
                  <option key={userOption.id} value={userOption.id}>
                    {userOption.name}
                  </option>
                ))}
              </Select>
            ) : (
              <span>{selectedUser?.name}</span>
            )}
          </Style.UserResponsibleDataRow>

          <Style.UserResponsibleDataRow>
            <p>Email</p>
            {isEditing ? (
              <Input
                label=""
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            ) : (
              <span>{selectedUser?.email}</span>
            )}
          </Style.UserResponsibleDataRow>

          {isEditing && isAdmin && (
            <Style.ButtonGroup>
              <Button
                label="Salvar"
                onClick={handleSave}
                bgColor="primary"
                textColor="white"
                permToCheck="permission_to_save"
              />
              <Button
                label="Cancelar"
                onClick={handleCancel}
                bgColor="white"
                textColor="black"
                permToCheck="permission_to_cancel"
              />
            </Style.ButtonGroup>
          )}
        </Style.UserResponsibleData>
      </Style.UserResponsibleContent>
    </Style.UserResponsibleContainer>
  );
};

export default UserResponsible;

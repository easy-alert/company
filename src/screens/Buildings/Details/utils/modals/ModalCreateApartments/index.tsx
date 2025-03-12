/* eslint-disable react/no-array-index-key */
// REACT
import { useState } from 'react';

// COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { Input } from '@components/Inputs/Input';
import { IconButton } from '@components/Buttons/IconButton';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalCreateApartments } from './utils/types';

// FUNCTIONS

export const ModalCreateApartments = ({
  apartments,
  apartmentNumber,
  onQuery,
  handleChangeApartment,
  handleAddApartment,
  handleRemoveApartment,
  handleCreateApartment,
  handleCreateApartmentModal,
}: IModalCreateApartments) => (
  <Modal title="Adicionar apartamentos" setModal={handleCreateApartmentModal} closeOutside={false}>
    <Style.ModalContainer>
      <Input
        label="Número do apartamento:"
        name="apartmentNumber"
        value={apartmentNumber}
        onKeyDown={handleAddApartment}
        onChange={handleChangeApartment}
      />

      <Style.ModalDescription>
        <p>Para adicionar apartamentos, insira os dados acima.</p>
      </Style.ModalDescription>

      <Style.ModalApartmentsTitle>
        <p>Apartamentos adicionados</p>
      </Style.ModalApartmentsTitle>

      <Style.ApartmentList>
        {apartments
          ?.sort((a, b) => a.number.localeCompare(b.number))
          ?.map((apartment, index) => (
            <Style.ApartmentItem key={apartment.number}>
              <Style.ApartmentNumber>{apartment.number}</Style.ApartmentNumber>

              <IconButton icon={icon.x} size="16px" onClick={() => handleRemoveApartment(index)} />
            </Style.ApartmentItem>
          ))}
      </Style.ApartmentList>

      <Style.ButtonContainer>
        <Button label="Salvar" onClick={handleCreateApartment} loading={onQuery} />
      </Style.ButtonContainer>
    </Style.ModalContainer>
  </Modal>
);

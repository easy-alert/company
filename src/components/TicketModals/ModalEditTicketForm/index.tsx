import { Button } from '@components/Buttons/Button';
import { Switch } from '@components/Buttons/SwitchButton';
import { Modal } from '@components/Modal';
import { Api } from '@services/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { TicketFieldKey, useEditTicketFormConfig } from './useEditTicketFormConfig';

const FIELD_LABELS: Record<TicketFieldKey, string> = {
  residentName: 'Nome do morador',
  residentPhone: 'Telefone do morador',
  residentApartment: 'Apartamento do morador',
  residentEmail: 'E-mail do morador',
  residentCPF: 'CPF do morador',
  description: 'Descrição',
  placeId: 'Local da ocorrência',
  types: 'Tipo da assistência',
  attachments: 'Anexos',
};

export const ModalEditTicketForm = ({ setModal }: { setModal: (modal: boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { configArray, toggleHidden, toggleRequired, getPayload, setConfig } = useEditTicketFormConfig();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Api.get('/ticket-fields-config/form-config')
      .then((res) => {
        if (!mounted) return;
        setConfig(res.data);
      })
      .catch(() => {
        toast.error('Não foi possível carregar a configuração');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [setConfig]);

  return (
    <Modal title="Editar formulário" setModal={setModal}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 120px 140px',
            gap: 12,
            fontWeight: 600,
          }}
        >
          <span>Campo</span>
          <span>Ocultar</span>
          <span>Obrigatório</span>
        </div>

        {loading ? (
          <span style={{ opacity: 0.8 }}>Carregando configuração...</span>
        ) : (
        configArray.map(({ key, hidden, required }) => (
          <div
            key={key}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 140px',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span>{FIELD_LABELS[key] ?? key}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch checked={hidden} onChange={() => toggleHidden(key)} />
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: hidden ? 0.5 : 1 }}
            >
              <Switch
                checked={required}
                onChange={() => toggleRequired(key)}
                disabled={hidden}
              />
            </div>
          </div>
        ))
        )}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button
            label="Cancelar"
            bgColor="transparent"
            textColor="primary"
            onClick={() => setModal(false)}
          />
          <Button
            label="Salvar"
            bgColor="primary"
            loading={saving}
            disable={loading}
            onClick={async () => {
              try {
                setSaving(true);
                const payload = getPayload();
                await Api.put('/ticket-fields-configs/form-config', payload);
                toast.success('Configuração salva');
                setModal(false);
              } catch (err) {
                toast.error('Erro ao salvar configuração');
              } finally {
                setSaving(false);
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
};


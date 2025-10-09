import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FieldRow } from './components/FieldRow';
import { TicketFieldKey, useEditTicketFormConfig } from './hooks/useEditTicketFormConfig';
import { useTicketFormConfigApi } from './hooks/useTicketFormConfigApi';

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
  const { config, setConfig, toggleHidden, toggleRequired } = useEditTicketFormConfig();
  const { loadConfig, saveConfig } = useTicketFormConfigApi();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadConfig()
      .then((data) => {
        if (!controller.signal.aborted) setConfig(data);
      })
      .catch(() => {
        toast.error('Não foi possível carregar a configuração');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

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
          Object.entries(config).map(([key, { hidden, required }]) => (
            <FieldRow
              key={key}
              label={FIELD_LABELS[key as TicketFieldKey] ?? key}
              hidden={hidden}
              required={required}
              onToggleHidden={() => toggleHidden(key as TicketFieldKey)}
              onToggleRequired={() => toggleRequired(key as TicketFieldKey)}
            />
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
                await saveConfig(config);
                toast.success('Configuração salva com sucesso!');
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


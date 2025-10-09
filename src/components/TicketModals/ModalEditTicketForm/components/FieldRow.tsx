import { Switch } from '@components/Buttons/SwitchButton';

interface FieldRowProps {
  label: string;
  hidden: boolean;
  required: boolean;
  onToggleHidden: () => void;
  onToggleRequired: () => void;
}

export const FieldRow = ({
  label,
  hidden,
  required,
  onToggleHidden,
  onToggleRequired,
}: FieldRowProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 120px 140px',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch checked={hidden} onChange={onToggleHidden} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: hidden ? 0.5 : 1 }}>
        <Switch checked={required} onChange={onToggleRequired} disabled={hidden} />
      </div>
    </div>
  );
};

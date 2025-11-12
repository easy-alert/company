import { ITicketChecklistItem } from '@customTypes/ITicketChecklistItem';
import { patchTicketChecklistItemToggle } from '@services/apis/patchTicketChecklistItemToggle';
import { deleteTicketChecklistItem as deleteTicketChecklistItemApi } from '@services/apis/deleteTicketChecklistItem';
import { useEffect, useMemo, useState } from 'react';
import { IconButton } from '@components/Buttons/IconButton';
import { icon } from '@assets/icons';
import { moveTicketChecklistItem as moveTicketChecklistItemApi } from '@services/apis/moveTicketChecklistItem';
import { theme } from '@styles/theme';

interface ITicketChecklistItems {
  checklistItems: ITicketChecklistItem[];
  userId?: string;
  onChange?: (items: ITicketChecklistItem[]) => void;
}

export const TicketChecklistItems = ({
  checklistItems,
  userId,
  onChange,
}: ITicketChecklistItems) => {
  const [items, setItems] = useState<ITicketChecklistItem[]>(checklistItems);

  useEffect(() => {
    setItems(checklistItems);
  }, [checklistItems]);

  const completedPercent = useMemo(() => {
    const total = items.length;
    if (total === 0) return 0;
    const done = items.filter((i) => i.status === 'completed').length;
    return Math.round((done / total) * 100);
  }, [items]);

  const handleToggle = async (itemId: string) => {
    const updated = await patchTicketChecklistItemToggle({ itemId, userId });
    const next = items.map((i) => (i.id === itemId ? { ...i, ...updated } : i));
    setItems(next);
    onChange?.(next);
  };

  const handleDelete = async (itemId: string) => {
    await deleteTicketChecklistItemApi({ itemId, userId });
    const next = items.filter((i) => i.id !== itemId);
    setItems(next);
    onChange?.(next);
  };

  const handleMove = async (itemId: string, direction: 'up' | 'down') => {
    const reordered = await moveTicketChecklistItemApi({ itemId, direction });
    setItems(reordered);
    onChange?.(reordered);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontSize: 13 }}>
        <span>{completedPercent}% concluído</span>
        <div style={{ flex: 1, height: 6, background: '#eee', borderRadius: 4 }}>
          <div
            style={{
              width: `${completedPercent}%`,
              height: '100%',
              background: completedPercent === 100 ? '#2ecc71' : '#3498db',
              borderRadius: 4,
            }}
          />
        </div>
      </div>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={item.status === 'completed'}
            onChange={() => handleToggle(item.id)}
          />
          <p
            style={{
              margin: 0,
              textDecoration: item.status === 'completed' ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </p>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6, filter: 'invert(1)' }}>
              <IconButton
                title="Mover para cima"
                icon={icon.arrowUpWhite}
                size="10px"
                onClick={() => handleMove(item.id, 'up')}
              />
              <IconButton
                title="Mover para baixo"
                icon={icon.arrowDownWhite}
                size="10px"
                onClick={() => handleMove(item.id, 'down')}
              />
            </div>
            <IconButton
              title="Remover"
              icon={icon.x}
              size="18px"
              onClick={() => handleDelete(item.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};


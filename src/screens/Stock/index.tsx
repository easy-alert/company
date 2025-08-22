import { useState } from 'react';
import { Button } from '@components/Buttons/Button';

import { StockItemTypes } from './StockItemTypes';
import { StockItems } from './StockItems';
import { StockInventory } from './StockInventory';
import { StockMovements } from './StockMovements';

import * as Style from './styles';

type StockType = 'inventory' | 'items' | 'itemTypes' | 'movements';

interface ITabs {
  id: StockType;
  label: string;
}

export const Stock = () => {
  const [activeTab, setActiveTab] = useState<StockType>('inventory');

  const handleStockChange = (type: StockType) => {
    setActiveTab(type);
  };

  const tabs: ITabs[] = [
    { id: 'inventory', label: 'Estoque atual' },
    { id: 'items', label: 'Itens' },
    { id: 'itemTypes', label: 'Tipos de itens' },
    { id: 'movements', label: 'Movimentações' },
  ];

  return (
    <Style.Container>
      <Style.ButtonGroup>
        {tabs.map((tab) => (
          <Style.ButtonWrapper
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => handleStockChange(tab.id)}
          >
            <Button label={tab.label} />
          </Style.ButtonWrapper>
        ))}
      </Style.ButtonGroup>

      {activeTab === 'inventory' && <StockInventory />}
      {activeTab === 'items' && <StockItems />}
      {activeTab === 'itemTypes' && <StockItemTypes />}
      {activeTab === 'movements' && <StockMovements />}
    </Style.Container>
  );
};

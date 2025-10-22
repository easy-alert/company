export interface ITicketChecklistItem {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  position: number;
  completedAt: string;
  completedById: string;
  createdAt: string;
  updatedAt: string;
}

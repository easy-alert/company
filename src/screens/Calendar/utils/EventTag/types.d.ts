export interface IEventTag {
  label?: string;
  color?: string;
  backgroundColor?: string;
  status?: 'expired' | 'pending' | 'completed' | 'overdue' | 'occasional' | 'common';
}

import type { TPriorityName, TPriorityNameLabel } from './TPriorityName';

export interface IPriority {
  name?: TPriorityName;
  label?: TPriorityNameLabel;
  color?: string;
  backgroundColor?: string;
}

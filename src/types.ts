export type TodoItemType = {
  id: number;
  title: string;
  isCompleted: boolean;
};

export enum TodoFilterValueENUM {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

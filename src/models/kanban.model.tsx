export type StagesData = { [key: string]: IStage };
export type TicketsData = { [key: string]: ITicket };

export interface KanbanData {
  stages: StagesData;
  tickets: TicketsData;
  stageOrder: string[];
}

export interface MoveTicketData {
  ticketId: string;
  newStageId: string;
  previousTicketId: string | null;
  nextTicketId: string | null;
}
export interface MoveStageData {
  stageOrder: string[];
}

export interface ITicket {
  _id?: string;
  title?: string;
  content?: string;
  description?: string;
  status: IStage['_id'];
  assignee?: string;
  dueDate?: Date;
  createdAt?: Date;
  priority?: string;
  previousId: ITicket['_id'] | null;
  nextId: ITicket['_id'] | null;
}

export interface IStage {
  _id?: string;
  name: string;
  title?: string;
  ticketIds: string[];
  description?: string;
  order: number;
}

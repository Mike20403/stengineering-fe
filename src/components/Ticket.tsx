import { Draggable } from 'react-beautiful-dnd';
import { ITicket } from '../models/kanban.model';

export interface TicketProps {
  ticket: ITicket;
  index: number;
}

const Ticket = (props: TicketProps) => {
  const { ticket, index } = props;
  return (
    <Draggable draggableId={ticket._id} index={index}>
      {(provided) => (
        <div
          className="ticket"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: 'white',
            borderRadius: '5px',
            ...provided.draggableProps.style,
          }}
        >
          {ticket.title}
        </div>
      )}
    </Draggable>
  );
};

export default Ticket;

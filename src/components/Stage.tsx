import { Droppable, Draggable } from 'react-beautiful-dnd';
import Ticket from './Ticket';
import { IStage, ITicket } from '../models/kanban.model';

export interface StageProps {
  stage: IStage;
  tickets: ITicket[];
  index: number;
  backgroundColor: string;
  onAddTicket: (stageId: string, previousId: string | null) => void;
}
const Stage = (props: StageProps) => {
  const { stage, index, backgroundColor, onAddTicket } = props;
  const { tickets = [] } = props;

  const handleAddTicketClick = () => {
    onAddTicket(stage._id!, tickets[tickets.length - 1]?._id || null); // Trigger the callback to add a new ticktt
  };

  return (
    <Draggable draggableId={stage._id!} index={index}>
      {(provided) => (
        <div
          className="stage"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            backgroundColor: backgroundColor,
            borderRadius: '5px',
            width: '300px',
            margin: '0 8px',
            ...provided.draggableProps.style,
          }}
        >
          <div className="stageName px-2 py-1 font-semibold">
            <h3>{stage.name}</h3>
          </div>
          <Droppable droppableId={stage._id!} type="ticket">
            {(provided) => (
              <>
                <div
                  className="ticket-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ padding: '8px', minHeight: '100px' }}
                >
                  {tickets?.map((ticket: ITicket, index: number) => (
                    <Ticket key={ticket._id} ticket={ticket} index={index} />
                  ))}
                  {provided.placeholder}
                  <button
                    className="add-ticket-button text-left p-2 w-full text-black rounded active:bg-gray-200 hover:opacity-70 bg-gray-50"
                    onClick={handleAddTicketClick}
                  >
                    + Add a ticket
                  </button>
                </div>
              </>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Stage;

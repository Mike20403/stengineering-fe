import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Stage from './Stage';
import React, { useCallback } from 'react';
import { StrictModeDroppable } from './StrictModeDroppable';
import { StageColors } from '../constants/kanban.constant';
import { hashStringToNumber } from '../utils/convert.utils';
import { IStage, ITicket, KanbanData, MoveStageData, MoveTicketData, StagesData } from '../models/kanban.model';
import axiosInstance from '../utils/axios.utils';
import { debounce } from 'lodash';

export interface KanbanBoardProps {
  data: KanbanData;
  setData: React.Dispatch<React.SetStateAction<KanbanData>>;
}

// Function to get a color based on the stage index
const getStageColor = (index: string) => {
  const lightColors = Object.values(StageColors);
  const id = hashStringToNumber(index);
  return lightColors[id % lightColors.length];
};

const KanbanBoard = (props: KanbanBoardProps) => {
  const { data, setData } = props;

  // Debounce API call for moving tickets
  const debounceUpdateCall = useCallback(
    debounce(async (moveTicketData: MoveTicketData) => {
      try {
        // Call the API to persist the changes
        await axiosInstance.put(`/tickets/${moveTicketData.ticketId}/move`, moveTicketData);
        console.log('API called with data:', moveTicketData);
      } catch (error) {
        console.error('Error updating Kanban:', error);
      }
    }, 0), // 1000 ms debounce to prevent overlapping calls
    [],
  );
  const debounceUpdateStageCall = useCallback(
    debounce(async (moveStageData: MoveStageData) => {
      try {
        // Call the API to persist the changes
        await axiosInstance.put('/stages', moveStageData);
      } catch (error) {
        console.error('Error updating Kanban:', error);
      }
    }),
    [],
  );

  const onAddTicket = async (stageId: string, previousId: string | null) => {
    try {
      // Create a new ticket
      const newTicket: ITicket = {
        title: 'New Task',
        priority: 'Low',
        nextId: null,
        previousId: previousId,
        status: stageId,
      };

      const res = await axiosInstance.post('/tickets', newTicket);
      if (res && res.data) {
        const newTicket: ITicket = res.data.data;
        const newTicketId = newTicket._id;
        // Update the state
        const newStages: StagesData = { ...data.stages };
        newStages[stageId].ticketIds.push(newTicketId!);
        const kanbanData: KanbanData = {
          ...data,
          tickets: { ...data.tickets, [newTicketId!]: newTicket },
          stages: newStages,
        };

        setData(kanbanData);
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  // Handle Drag End
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // No destination (e.g., dropped outside the droppable area)
    if (!destination) return;

    // If the location did not change
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    let newData = { ...data };

    // Dragging a stage (column)
    if (type === 'stage') {
      const newStageOrder: string[] = Array.from(data.stageOrder);
      newStageOrder.splice(source.index, 1);
      newStageOrder.splice(destination.index, 0, draggableId);

      newData = {
        ...data,
        stageOrder: newStageOrder,
      } as KanbanData;

      setData(newData); // Update UI immediately

      const moveStageData: MoveStageData = {
        stageOrder: newStageOrder,
      };
      debounceUpdateStageCall(moveStageData);
      return;
    }

    // Moving a ticket
    const startStage: IStage = data.stages[source.droppableId];
    const finishStage: IStage = data.stages[destination.droppableId];

    // Moving within the same stage
    if (startStage === finishStage) {
      const newTicketIds = Array.from(startStage.ticketIds);
      newTicketIds.splice(source.index, 1);
      newTicketIds.splice(destination.index, 0, draggableId);

      const newStage = {
        ...startStage,
        ticketIds: newTicketIds,
      } as IStage;

      newData = {
        ...data,
        stages: {
          ...data.stages,
          [newStage._id!]: newStage,
        },
      } as KanbanData;

      // Construct move ticket data
      const moveTicketData: MoveTicketData = {
        ticketId: draggableId,
        newStageId: startStage._id!,
        previousTicketId: newTicketIds[destination.index - 1] || null,
        nextTicketId: newTicketIds[destination.index + 1] || null,
      };

      setData(newData); // Immediate UI update
      debounceUpdateCall(moveTicketData); // Debounce the API call
      return;
    }

    // Moving to another stage
    const startTicketIds = Array.from(startStage.ticketIds);
    startTicketIds.splice(source.index, 1);
    const newStart = {
      ...startStage,
      ticketIds: startTicketIds,
    } as IStage;

    const finishTicketIds = Array.from(finishStage.ticketIds);
    finishTicketIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishStage,
      ticketIds: finishTicketIds,
    } as IStage;

    newData = {
      ...data,
      stages: {
        ...data.stages,
        [newStart._id!]: newStart,
        [newFinish._id!]: newFinish,
      },
    } as KanbanData;

    // Construct move ticket data for moving to another stage
    const moveTicketData: MoveTicketData = {
      ticketId: draggableId,
      newStageId: finishStage._id!,
      previousTicketId: finishTicketIds[destination.index - 1] || null,
      nextTicketId: finishTicketIds[destination.index + 1] || null,
    };

    setData(newData); // Immediate UI update
    debounceUpdateCall(moveTicketData); // Debounce the API call
  };

  const onAddStage = async () => {
    const newStage: IStage = {
      title: 'New Stage',
      name: 'New Stage',
      ticketIds: [],
      order: data.stageOrder.length,
    };

    try {
      const res = await axiosInstance.post('/stages', newStage);
      if (res && res.data) {
        const newStage = res.data.data;
        const newStageId = newStage._id;
        const newStageOrder = Array.from(data.stageOrder);
        newStageOrder.push(newStageId);
        setData({
          ...data,
          stages: {
            ...data.stages,
            [newStageId]: {
              ...newStage,
              ticketIds: [],
            },
          },
          stageOrder: newStageOrder,
        });
      }
    } catch (error) {
      console.log('[Error] error: ', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="all-stages" direction="horizontal" type="stage">
        {(provided) => (
          <div
            className="kanban-board"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ display: 'flex' }}
          >
            {data.stageOrder.map((stageId: string, index: number) => {
              const stage = data.stages[stageId];
              const tickets = stage.ticketIds?.map((ticketId: string) => data.tickets[ticketId]) || [];
              const currentStageColor = getStageColor(stageId);
              return (
                <Stage
                  onAddTicket={onAddTicket}
                  key={stageId}
                  backgroundColor={currentStageColor}
                  stage={stage}
                  tickets={tickets}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <button
              className="hover:bg-gray-200 cursor-pointer flex rounded-2xl items-center w-[200px] p-2 h-[40px] bg-gray-100 border-dashed border-[1px] bg-white justify-center add-stage-placeholder text-nowrap"
              onClick={onAddStage}
            >
              <p className="text-[14px]"> + Add New Stage</p>
            </button>
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default KanbanBoard;

import { useEffect, useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import axiosInstance from '../utils/axios.utils';
import { IStage, ITicket, KanbanData, StagesData, TicketsData } from '../models/kanban.model';

export const initialData: KanbanData = {
  tickets: {
    'ticket-1': {
      _id: 'ticket-1',
      content: 'Task 1',
      title: 'Task 1',
      status: 'stage-1',
      priority: 'Urgent',
      previousId: null,
      nextId: null,
    },
    'ticket-2': {
      _id: 'ticket-2',
      content: 'Task 2',
      title: 'Task 2',
      status: 'stage-1',
      priority: 'High',
      previousId: null,
      nextId: null,
    },
    'ticket-3': {
      _id: 'ticket-3',
      content: 'Task 3',
      status: 'stage-2',
      title: 'Task 3',
      priority: 'Medium',
      previousId: null,
      nextId: null,
    },
    'ticket-4': {
      _id: 'ticket-4',
      content: 'Task 4',
      status: 'stage-3',
      title: 'Task 4',
      priority: 'Low',
      previousId: null,
      nextId: null,
    },
  },
  stages: {
    'stage-1': {
      _id: 'stage-1',
      order: 0,
      name: 'To Do',
      title: 'To Do',
      ticketIds: ['ticket-1', 'ticket-2'],
    },
    'stage-2': {
      _id: 'stage-2',
      order: 1,
      name: 'In Progress',
      title: 'In Progress',
      ticketIds: ['ticket-3'],
    },
    'stage-3': {
      _id: 'stage-3',
      order: 2,
      name: 'Done',
      title: 'Done',
      ticketIds: ['ticket-4'],
    },
  },
  // Order of the stages
  stageOrder: ['stage-1', 'stage-2', 'stage-3'],
};
export const Dashboard = () => {
  const [data, setData] = useState<KanbanData>(initialData);

  const fetchKanbanData = async () => {
    try {
      // Fetch stages
      const resStages = await axiosInstance.get('/stages');
      // Fetch tickets
      const resTickets = await axiosInstance.get('/tickets');

      if (resStages && resStages.data && resTickets && resTickets.data) {
        const stages: IStage[] = resStages.data.data;
        const tickets: ITicket[] = resTickets.data.data;

        const newStages: StagesData = {};
        const newTickets: TicketsData = {};
        const newStageOrder: string[] = [];

        // Create a new stages object by order
        stages
          .sort((a: IStage, b: IStage) => a.order - b.order)
          .forEach((stage: IStage) => {
            newStages[stage._id!] = {
              _id: stage._id,
              name: stage.name,
              title: stage.name,
              description: stage.description,
              order: stage.order,
              ticketIds: [],
            };
            newStageOrder.push(stage._id!);
          });

        // Add tickets by order to the corresponding stages by previousId, nextId

        tickets.forEach((ticket: ITicket) => {
          // Assuming each ticket has a 'stageId' to associate with the stage
          if (newStages[ticket.status!]) {
            newStages[ticket.status!].ticketIds.push(ticket._id!);
          }

          newTickets[ticket._id!] = {
            _id: ticket._id,
            content: ticket.content,
            title: ticket.title,
            priority: ticket.priority,
            previousId: ticket.previousId,
            nextId: ticket.nextId,
            status: ticket.status,
          };
        });
        // Sort the tickets by previousId, nextId
        Object.keys(newStages).forEach((stageId) => {
          const stage = newStages[stageId];
          stage.ticketIds.sort((a, b) => {
            const ticketA = newTickets[a];
            const ticketB = newTickets[b];
            if (ticketA.previousId === null) {
              return -1;
            }
            if (ticketB.previousId === null) {
              return 1;
            }
            return ticketA.previousId!.localeCompare(ticketB.previousId!);
          });
        });

        // Update the state
        setData({
          tickets: newTickets,
          stages: newStages,
          stageOrder: newStageOrder,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => { }, [data]);

  useEffect(() => {
    fetchKanbanData();
  }, []);

  return (
    <>
      <div className="bg-white w-[100vw] h-[100vh]">
        <div className="w-full h-full p-10">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="table-container mt-10">
            <KanbanBoard data={data} setData={setData} />
          </div>
        </div>
      </div>
    </>
  );
};

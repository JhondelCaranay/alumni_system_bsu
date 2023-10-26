"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModalStore";
import { apiClient, useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";
import { Events } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";

const Calendar = () => {
  const { onOpen, onClose } = useModal();

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo;
    onOpen("createEvent", { calendarApi });
  };

  const events = useQueryProcessor<Events>(`/events`, null, ["events"]);
  const currentEvents =
    typeof events.data !== "undefined" && events?.data?.length > 0
      ? events.data.map((event) => {
          return {
            id: event?.id,
            title: event?.title,
            description: event.description,
            start: new Date(event?.dateStart),
            end: new Date(event?.dateEnd),
            allDay: event?.allDay,
          };
        })
      : [];

  type EventData = {
    id: string;
    title: string;
    description: string;
    timeStart: Date;
    timeEnd: Date;
    allDay: boolean;
  };

  const createEvent = useMutateProcessor<EventData, null>(`/events`, null, "POST", ["events"]);

  const handleAddEvent = ({ event }: any) => {
    const eventData = {
      id: event.id,
      title: event.title,
      description: event._def.extendedProps.description,
      timeStart: event.start,
      timeEnd: event.end,
      allDay: event.allDay,
    } as EventData;

    createEvent.mutate(eventData, {
      onSuccess(data) {
        toast.success("Event added!");
        onClose();
      },
      onError(error, variables, context) {
        console.log("");
        toast.error("Something went wrong...");
      },
    });
  };

  const updateEvent = async (eventId: string, data: Omit<EventData, "description">) => {
    try {
      await apiClient.patch(`/events/${eventId}`, data);
    } catch (error) {
      console.error("error delete update");
      toast.error("Event did not update");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  };
  const queryClient = useQueryClient();

  const deleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/events/${eventId}`);
      toast.success("Event deleted");
    } catch (error) {
      console.error("error delete event");
      toast.error("Event did not delete");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  };

  const handleUpdateEvent = ({ event }: any) => {
    const eventData = {
      id: event.id,
      title: event.title,
      timeStart: event.start,
      timeEnd: event.end,
      allDay: event.allDay,
    };

    updateEvent(event.id, eventData);
  };

  const handleEventClick = (calendarApi: any) => {
    onOpen("viewEvent", { calendarApi });
  };

  const handleDeleteEvent = ({ event }: any) => {
    console.log("deleting event");
    deleteEvent(event.id);
  };

  return (
    <div className="w-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        dayHeaderClassNames={"text-sky-700 text-sm font-medium uppercase"}
        validRange={{
          start: new Date(),
        }}
        height={"100vh"}
        initialView="dayGridMonth"
        // longPressDelay={0}
        editable={true}
        selectable={true}
        selectMirror={true}
        droppable={true}
        dayMaxEvents={true}
        eventBackgroundColor={"rgb(0, 152, 163)"}
        eventColor={"rgb(0, 152, 163)"}
        weekends={true}
        events={currentEvents}
        // initialEvents={currentEvents} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect} // adding event
        eventClick={handleEventClick} // trigger when clicking an event
        //  eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        // you can update a remote database when these fire:
        eventAdd={handleAddEvent}
        eventChange={handleUpdateEvent}
        eventRemove={handleDeleteEvent} // triggen when you delete an event in event api
      />
    </div>
  );
};

export default Calendar;

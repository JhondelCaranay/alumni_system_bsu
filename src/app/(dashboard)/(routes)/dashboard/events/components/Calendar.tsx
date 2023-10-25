"use client";
import React from "react";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModalStore";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import toast from "react-hot-toast";

const Calendar = () => {

  const {onOpen, onClose} = useModal();

  const handleDateSelect = (selectInfo: any) => {
    const calendarApi = selectInfo
    onOpen('createEvent', {calendarApi})
  };

  type EventData = {
    id:string;
    title: string;
    description: string;
    timeStart: Date
    timeEnd: Date
    allDay: boolean
  }

  const createEvent = useMutateProcessor<EventData, null>(`/events`, null, 'POST', ['events']);

  const handleAddEvent = ({event}: any) => {

    const eventData = {
      id: event.id,
      title: event.title,
      description: event._def.extendedProps.description,
      timeStart: event.start,
      timeEnd: event.end,
      allDay: event.allDay
    } as EventData
    
    createEvent.mutate(eventData, {
      onSuccess(data) {
        toast.success('Event added!')
        onClose();
      },
      onError(error, variables, context) {
          console.log('')
          toast.error('Something went wrong...')
      },
    })

  }
  
  return (
    <div className="flex-1">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        validRange={{
          start: new Date(),
        }}
        height={"100vh"}
        initialView="dayGridMonth"
        longPressDelay={0}
        editable={true}
        selectable={true}
        selectMirror={true}
        droppable={true}
        dayMaxEvents={true}
        eventBackgroundColor={"rgb(0, 152, 163)"}
        eventColor={"rgb(0, 152, 163)"}
        weekends={true}
        // initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
         select={handleDateSelect} // adding event
        // eventClick={handleEventClick} // deleting event
        //  eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        // you can update a remote database when these fire:
         eventAdd={handleAddEvent}
        // eventChange={handleUpdateEvent}
        // eventRemove={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar;


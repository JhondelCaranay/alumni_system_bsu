"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModalStore";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Events } from "@/types/types";

const ViewCalendar = () => {
  const { onOpen, onClose } = useModal();

  const handleEventClick = (calendarApi: any) => {
    onOpen("viewOnlyEvent", { calendarApi });
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
        editable={false}
        selectable={true}
        selectMirror={true}
        droppable={true}
        dayMaxEvents={true}
        eventBackgroundColor={"rgb(0, 152, 163)"}
        eventColor={"rgb(0, 152, 163)"}
        weekends={true}
        events={currentEvents}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default ViewCalendar;

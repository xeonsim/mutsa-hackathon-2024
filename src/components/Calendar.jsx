"use client";
import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";

import { db } from "@/firebase/firebaseClient";
import { getDocs, collection } from "firebase/firestore";
export function GroupCalendar({ groupId, members }) {
  const [event, setEvent] = useState([]);
  useEffect(() => {
    members.map(async (member) => {
      const declarationData = await getDocs(
        collection(db, "declarations", groupId, member)
      );

      const events = declarationData.docs.map((e) => {
        const data = e.data();
        return {
          event_id: e.id,
          title: data.name,
          start: new Date(data.date),
          end: new Date(data.date),
          color: data.fulfilled ? "#3B82F6" : "#ef4444",
        };
      });
      setEvent([...event, ...events]);
    });
  }, []);
  return (
    <Scheduler
      view="month"
      agenda={false}
      disableViewNavigator={true}
      editable={false}
      deletable={false}
      draggable={false}
      disableViewer={true}
      // navigation={false}
      month={{
        weekStartOn: 0,
        // cellRenderer: ({ height, start, onClick, ...props }) => {
        //   // Fake some condition up
        //   return (
        //     <button
        //       style={{
        //         height: "100%",
        //         background: true ? "#eee" : "transparent",
        //         cursor: true ? "not-allowed" : "pointer",
        //       }}
        //       onClick={() => {
        //         if (true) {
        //           return alert("Opss");
        //         }
        //         onClick();
        //       }}
        //       disableRipple={true}
        //       // disabled={disabled}
        //     ></button>
        //   );
        // },
        navigation: true,
        disableGoToDay: true,
      }}
      events={event}
      onEventClick={(e) => {
        console.log(e);
      }}
    />
  );
}

import { useEffect, useState } from "react";
import './AttendeeListView.css';
import { NavLink, useParams } from 'react-router-dom';
import MeetingAttendee from "./MeetingAttendee";
import { baseUrl, fetchJson } from "../api";

export const list = (meetingId?: string) => fetchJson<MeetingAttendee[]>({ url: `${baseUrl}/meetings/${meetingId}/attendees` });

const create = (meetingId?: string) => fetchJson<MeetingAttendee>({
  url: `${baseUrl}/meetings/${meetingId}/attendees`, 
  opt: { method: 'POST' }
});

export default function AttendeeListView() {

  console.log("Attendees");

  const { meetingId } = useParams();
  const [meetingAttendees, setMeetingAttendees] = useState<MeetingAttendee[]>([]);

  useEffect(() => {
    list(meetingId).then(setMeetingAttendees);
  }, [meetingId]);

  return (
    <>
      <h2> Attendees <span className="badge bg-secondary"> {meetingAttendees?.length || 0} </span>
        <button className="btn" onClick={() => create(meetingId).then(a => list(meetingId)).then(setMeetingAttendees)}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </h2>
      <ul className='nav flex-column'>
        {meetingAttendees?.map((ma: MeetingAttendee) => (
          <li className="nav-item" key={ma.attendee.attendeeId}>
            <NavLink className='nav-link' to={ma.attendee.attendeeId}>{ma.attendee.attendeeId}</NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

import { useEffect, useState } from 'react';
import './MeetingListView.scss';
import { NavLink, Outlet } from 'react-router-dom';
import Meeting from './Meeting';
import { MeetingDetailRoute } from './MeetingDetailView';
import { baseUrl, fetchJson } from '../api';

export const list = () => fetchJson<Meeting[]>({
  url: `${baseUrl}/meetings`
}, []);

export const create = () => fetchJson<Meeting>({
  url: `${baseUrl}/meetings`, 
  opt: { method: 'POST' }
});

export const MeetingListRoute = {
  path: 'meetings',
  element: <MeetingListView />,
  children: [
    MeetingDetailRoute
  ],
}

export function MeetingListView() {

  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    list().then(setMeetings);
  }, []);

  return (
    <div className="MeetingListView">
      <h2> Meetings <span className="badge bg-secondary"> {meetings?.length || 0} </span>
        <button className='btn' onClick={() => create().then(list).then(setMeetings)}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </h2>
      <ul className='nav flex-column'>
        {meetings?.map((meeting: Meeting) => (
          <li className="nav-item" key={meeting.meetingId}>
            <NavLink className='nav-link' to={meeting.meetingId}>{meeting.meetingId}</NavLink>
          </li>
        ))} 
      </ul>
      <div className='outlet'>
        <Outlet />
      </div>
    </div>
  );
}

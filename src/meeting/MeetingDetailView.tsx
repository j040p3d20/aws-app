import './MeetingDetailView.css';
import AttendeeListView from '../attendee/AttendeeListView';
import { Outlet } from 'react-router-dom';
import { AttendeeDetailRoute } from '../attendee/AttendeeDetailView';

export const MeetingDetailRoute = {
    path: ':meetingId',
    element: <MeetingDetailView />,
    children: [
        AttendeeDetailRoute
    ] 
}

export function MeetingDetailView() {
    return <>
        <AttendeeListView />
        <Outlet />
    </>
}

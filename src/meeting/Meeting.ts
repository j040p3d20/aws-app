import MediaPlacement from "./MediaPlacement";

export default class Meeting {
    meetingId: string;
    meetingArn: string;
    externalMeetingId: string;
    mediaRegion: string;
    mediaPlacement: MediaPlacement;
}

import './AttendeeDetailView.scss';
import { useParams } from "react-router-dom";
import MeetingAttendee from "./MeetingAttendee";
import { useEffect, useRef, useState } from "react";
import { ConsoleLogger, DefaultDeviceController, DefaultMeetingSession, LogLevel, MeetingSession, MeetingSessionConfiguration } from 'amazon-chime-sdk-js';
import MediaCapturePipeline from './MediaCapturePipeline';
import { baseUrl, fetchJson } from '../api';

export const get = (meetingId?: string, attendeeId?:string) => fetchJson<MeetingAttendee[]>({
    url: `${baseUrl}/meetings/${meetingId}/attendees`
}).then(attendees => attendees?.find(a => a.attendee.attendeeId == attendeeId));

export const createMediaCapturePipeline = (meetingId?: string) => fetchJson<MediaCapturePipeline>({
    url: `${baseUrl}/meetings/${meetingId}/mediaCapturePipelines`,
    opt: { method: 'POST' }
});

export const deleteMediaCapturePipeline = (meetingId?: string, mediaPipelineId?: string) => fetchJson<MediaCapturePipeline>({
    url: `${baseUrl}/meetings/${meetingId}/mediaCapturePipelines/${mediaPipelineId}`,
    opt: { method: 'DELETE' }
});

export function AttendeeDetailView() {

    const {meetingId, attendeeId} = useParams();
    const [meetingAttendee, setMeetingAttendee] = useState<MeetingAttendee>();

    const [meetingSession, setMeetingSession] = useState<MeetingSession>();
    const [mediaCapturePipeline, setMediaCapturePipeline] = useState<MediaCapturePipeline>();
    
    const videoElement = useRef<HTMLVideoElement>(null);
    
    const stopMediaCapturePipeline = async () => mediaCapturePipeline && deleteMediaCapturePipeline(meetingId, mediaCapturePipeline?.mediaPipelineId).then(setMediaCapturePipeline) 
    const startMediaCapturePipeline = async () => createMediaCapturePipeline(meetingId).then(setMediaCapturePipeline);
    const toggleRecording = async () => await mediaCapturePipeline ? stopMediaCapturePipeline() : startMediaCapturePipeline();
    
    const toggleStreaming = async () => await meetingSession ? stopStreaming() : startStreaming();

    const stopStreaming = async () => {
        meetingSession?.audioVideo.stopContentShare();
        meetingSession?.audioVideo.stop();
        stopMediaCapturePipeline();
        setMeetingSession(null as any);
    }

    const startStreaming = async () => {

        if (!meetingAttendee) {
            console.warn("missing meetingAttendee");
            return;
        }

        const logger = new ConsoleLogger('MyLogger', LogLevel.DEBUG);
        const deviceController = new DefaultDeviceController(logger);
        const configuration = new MeetingSessionConfiguration(meetingAttendee.meeting, meetingAttendee.attendee);
        const meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
        const observer = {
            audioVideoDidStart: () => {
                console.log('observer > audioVideoDidStart');
                // meetingSession.audioVideo.startLocalVideoTile();
            },
            audioVideoDidStartConnecting(reconnecting: any) {
                console.log('observer > audioVideoDidStartConnecting', reconnecting);
                
            },
            audioVideoDidStop(sessionStatus: any) {
                console.log('observer > audioVideoDidStop', sessionStatus);
                
            },
            videoTileDidUpdate: (tileState: any) => {
                console.log('observer > videoTileDidUpdate', tileState);
                videoElement.current && meetingSession.audioVideo.bindVideoElement(tileState.tileId, videoElement.current);
            },
            videoAvailabilityDidChange(availability: any) {
                console.log('observer > videoAvailabilityDidChange', availability);
                
            }
        }
        meetingSession.audioVideo.addObserver(observer);
        
        // const camera = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const screen = await navigator.mediaDevices.getDisplayMedia({video: true});

        meetingSession.audioVideo.startContentShare(screen);
        meetingSession.audioVideo.start();

        setMeetingSession(meetingSession);
    }

    // load meeting attendee
    useEffect(() => {
        get(meetingId, attendeeId).then(setMeetingAttendee);
    }, [attendeeId]);

    return <div className="AttendeeDetailView">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{meetingAttendee?.attendee.attendeeId}</h5>

                <button className='btn btn-light' onClick={toggleStreaming}>
                <i className={`bi ${ meetingSession ? 'bi-camera-video-off' : 'bi-camera-video' }`}></i>
                </button>
                
                <button className='btn btn-light' onClick={toggleRecording} disabled={!meetingSession}>
                    <i className={`bi ${ mediaCapturePipeline ? 'bi-record-fill recording' : 'bi-record' }`}></i>
                </button>

            </div>
            <div className="card-body">
                <video ref={videoElement}></video>
            </div>
        </div>
        {/* <pre>{JSON.stringify(meetingAttendee, null,2)}</pre> */}
    </div>
}

export const AttendeeDetailRoute = {
    path: ':attendeeId',
    element: <AttendeeDetailView />
};

import { useEffect, useState } from 'react';
import './MediaPipelineListView.css';
import MediaPipeline from './MediaPipeline';
import { baseUrl, fetchJson } from '../api';

export const list = () => fetchJson<MediaPipeline[]>({ url: `${baseUrl}/mediaPipelines` }, []);

export const deletePipeline = (mediaPipelineId:string) => fetchJson<void>({
  url: `${baseUrl}/mediaPipelines/${mediaPipelineId}`,
  opt: { method: 'DELETE' }
});

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function MediaPipelineListView() {

  const [mediaPipelines, setMediaPipelines] = useState<MediaPipeline[]>([]);

  useEffect(() => {
    list().then(setMediaPipelines);
  }, []);

  return (
    <>
      <h1>
        Media Pipelines
      <button type="button" className="btn btn-lg" onClick={() => list().then(setMediaPipelines)}>
        <i className="bi bi-arrow-clockwise"> </i>
      </button>
      </h1>
      <ul>{mediaPipelines.map(mediaPipeline =>
        <li key={mediaPipeline.id}>
          {JSON.stringify(mediaPipeline)}
          <i 
            className="btn bi bi-trash"
            onClick={
              () => deletePipeline(mediaPipeline.id)
                    .then(() => delay(500)).then(() => list().then(setMediaPipelines))
                    .then(() => delay(500)).then(() => list().then(setMediaPipelines))
            }> </i>
          
        </li>
      )}</ul>
    </>
  );
}

export const MediaPipelineListRoute = {
  path: 'mediaPipelines',
  element: <MediaPipelineListView />,
}


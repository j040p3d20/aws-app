import { useEffect, useState } from 'react';
import './QueueListView.css';
import { baseUrl, fetchJson } from '../api';

export const list = () => fetchJson<string[]>({ url: `${baseUrl}/queues` }, []);

export function QueueListView() {

  const [queues, setQueues] = useState<string[]>([]);

  useEffect(() => {
    list().then(setQueues);
  }, []);

  return (
    <>
      <h1>Queues</h1>
      <ul>{queues.map(q =>
        <li key={q}>{q}</li>
      )}</ul>
    </>
  );
}

export const QueueListRoute = {
  path: 'queues',
  element: <QueueListView />,
}


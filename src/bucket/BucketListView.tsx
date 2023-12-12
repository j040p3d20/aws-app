import { useEffect, useState } from 'react';
import './BucketListView.css';
import Bucket from './Bucket';
import { baseUrl, fetchJson } from '../api';

export const list = () => fetchJson<Bucket[]>({ url: `${baseUrl}/buckets` }, []);

export function BucketListView() {

  const [buckets, setBuckets] = useState<Bucket[]>([]);

  useEffect(() => {
    list().then(setBuckets);
  }, []);

  return (
    <>
      <h1>Buckets</h1>
      <ul>{buckets.map(bucket =>
        <li key={bucket.name}>{bucket.name}</li>
      )}</ul>
    </>
  );
}

export const BucketListRoute = {
  path: 'buckets',
  element: <BucketListView />,
}


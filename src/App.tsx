import './App.scss';
import { NavLink, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <NavLink className='navbar-brand' to="/">AWS Chime</NavLink>
        <ul className='navbar-nav'>
          <li className="nav-item">
            <NavLink className='nav-link' to="/buckets">buckets</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className='nav-link' to="/queues">queues</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className='nav-link' to="/mediaPipelines">pipelines</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className='nav-link' to="/meetings">meetings</NavLink>
          </li>
        </ul>
      </nav>
      <div className='container-fluid'>
        <Outlet />
      </div>
    </>
  );
}

export default App;

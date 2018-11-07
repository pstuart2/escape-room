import React from 'react';
import {Link} from "react-router-dom";

export const App = () => (
  <div>
    <h1>Welcome to Escape Room</h1>
    <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
    </ul>
  </div>
);

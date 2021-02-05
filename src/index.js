import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import MiniDrawer from './components/MiniDrawer'

ReactDOM.render(
  <React.StrictMode>
    <MiniDrawer />
  </React.StrictMode>,
  document.getElementById('root')
);
import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import routes from './routes';
import history from './routes/history';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ConnectedRouter history={history}>
          <Switch>{routes.map((route) => route)}</Switch>
        </ConnectedRouter>
        <ToastContainer
          autoClose={8000}
          closeButton={false}
          pauseOnHover
          position="bottom-right"
        />
      </div>
    );
  }
}

export default App;

import Header from '@/containers/Header';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.css';
import routes from './routes';
import history from './routes/history';
import ErrorBoundary from './utils/errorBoundary';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { authenticated } = this.props;
    return (
      <div>
        <ConnectedRouter history={history}>
          <ErrorBoundary>
            {authenticated && <Header />}
            <Switch>{routes.map((route) => route)}</Switch>
          </ErrorBoundary>
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

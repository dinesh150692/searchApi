import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '../src/redux/index';
import ReactDOM from 'react-dom';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const store = configureStore({});

class App extends React.Component {
    render() {
      return ( 
        <Provider store={store}>
            <Root/>
        </Provider>
      );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

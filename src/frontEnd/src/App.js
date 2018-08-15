import React from 'react';
import {applyMiddleware, createStore} from 'redux'
import {createLogger} from 'redux-logger'
import {Provider} from 'react-redux'

import {BrowserRouter as Router} from 'react-router-dom'
import RootReducers from './Reducers'
import thunkMiddleware from 'redux-thunk'

import MainPage from './Framework/index'
import './App.css'


const loggerMiddleware = createLogger()



const store =process.env.NODE_ENV === 'production'? createStore(RootReducers, applyMiddleware(thunkMiddleware)):
    createStore(RootReducers, applyMiddleware(thunkMiddleware, loggerMiddleware))


class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {/*<SlideEntries docName="cvpcb"/>*/}
                <Router>
                    <MainPage/>
                </Router>
            </Provider>
        );
    }
}

export default App;

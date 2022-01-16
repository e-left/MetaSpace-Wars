import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Context } from './Context';
import { App } from './App';

ReactDOM.render(
    <StrictMode>
        <Context>
            <App />
        </Context>
    </StrictMode>,
    document.getElementById('app')
);

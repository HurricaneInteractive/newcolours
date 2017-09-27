import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import App from './App';

class AppRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={App}/>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<AppRouter />, document.getElementById('app'));
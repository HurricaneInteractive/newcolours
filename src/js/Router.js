import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link,
    HashRouter
} from 'react-router-dom';

import App from './App';
import Login from './Login';

class AppRouter extends React.Component {
    render() {
        return (
            <HashRouter>
                <div>
                    <Route exact path="/" component={App} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        )
    }
}

ReactDOM.render(<AppRouter />, document.getElementById('app'));
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter, Redirect } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';
const history = createHistory();

import App from './App';
import Login from './Login';
import AddPalette from './AddPalette';

import firebase from './firebase';
import { Loading } from './Ui';

class AppRouter extends React.Component {

    constructor() {
        super();
        this.state = {
            'anonymous_user': null
        };

        this.loginAdminUser = this.loginAdminUser.bind(this);
    }

    componentWillMount() {
        const _this = this;

        if (firebase.auth().currentUser == null) {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                .then(function() {
                    firebase.auth().signInAnonymously().catch(function(error) {
                        let errorMessage = error.message;
                        console.log(error);
                    });
                })
                .catch(function(error) {
                    let errorMessage = error.message;
                    console.log(error);
                });
            // Testing only, this can be removed for production
            // Serves no purpose
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    _this.setState({
                        'anonymous_user': user
                    });
                }
            });
        }
    }

    loginAdminUser(email, password) {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .catch(function(error) {
                        console.log(error);
                    });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        
        if (firebase.auth().currentUser == null) {
            return (
                <Loading />
            )
        }

        return (
            <HashRouter>
                <div>
                    <Route exact path="/" render={() => ( 
                        <App />
                    )} />
                    <Route path="/login" render={() => ( 
                        firebase.auth().currentUser.isAnonymous === false ? (
                             <Redirect to="/new" />
                        ) : (
                            <Login loginUser={this.loginAdminUser} />
                        )
                    )} />
                    <Route path="/new" render={() => (
                        firebase.auth().currentUser.isAnonymous === false ? (
                            <AddPalette />
                        ) : (
                            <Redirect to="/" />
                        )
                    )} />
                </div>
            </HashRouter>
        )
    }
}

ReactDOM.render(<AppRouter />, document.getElementById('app'));
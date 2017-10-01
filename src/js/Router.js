import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter, Redirect, hashHistory } from 'react-router-dom';

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
        this.createNewPalette = this.createNewPalette.bind(this);
    }

    componentWillMount() {
        const _this = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                _this.setState({
                    'anonymous_user': user
                });
            }
            else {
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
            }
        });
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

    createNewPalette(name, palette) {
        let newKey = firebase.database().ref().child('colours').push().key;
        let newPalette = {
            hex_group: palette,
            name: name,
            votes: 0,
            id: newKey
        }
        var updates = {};
        updates['/colours/' + newKey] = newPalette;

        firebase.database().ref().update(updates).then(function() {
            history.push('#/new');
        });
    }

    render() {
        
        if (firebase.auth().currentUser == null) {
            return (
                <Loading />
            )
        }

        return (
            <HashRouter history={hashHistory}>
                <div>
                    <Route exact path="/" render={() => ( 
                        <App />
                    )} />
                    <Route path="/login" render={() => ( 
                        firebase.auth().currentUser.isAnonymous === false ? (
                             <Redirect to="/new" />
                        ) : (
                            <Login loginUser={ this.loginAdminUser } />
                        )
                    )} />
                    <Route path="/new" render={() => (
                        firebase.auth().currentUser.isAnonymous === false ? (
                            <AddPalette createNew={ this.createNewPalette } />
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
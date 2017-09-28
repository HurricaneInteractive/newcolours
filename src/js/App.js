import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import firebase from './firebase';
import { Loading } from './Ui';

const url = require('../dist/css/style.css');

class App extends Component {

    constructor() {
        super();
        this.state = {
            'colours': null,
            'anonymous_user': null
        }

        this.createColourPalette = this.createColourPalette.bind(this);
        this.upvote = this.upvote.bind(this);
    }

    componentWillMount() {
        const database = firebase.database();
        const ref = database.ref('colours');
        const _this = this;

        ref.on('value', (snap) => {
            this.setState({
                colours: snap.val()
            })
        });
        // if (this.state.anonymous_user == null) {
        //     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        //         .then(function() {
        //             firebase.auth().signInAnonymously().catch(function(error) {
        //                 let errorMessage = error.message;
        //                 console.log(error);
        //             });
        //         })
        //         .catch(function(error) {
        //             let errorMessage = error.message;
        //             console.log(error);
        //         });
        //     firebase.auth().onAuthStateChanged(function(user) {
        //         if (user) {
        //             _this.setState({
        //                 'anonymous_user': user
        //             });
        //         }
        //     });
        // }
    }

    getInclusiveRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    upvote(e, index) {
        e.preventDefault();
        const database = firebase.database();
        const paletteRef = database.ref('colours/' + index);
        const _this = this;
        
        paletteRef.once('value').then(function(snap) {
            let val = snap.val();
            
            let newVote = val.votes + 1;
            let newVotedUsers = null;
            // let uid = _this.props.anonymous_user.uid;
            let uid = firebase.auth().currentUser.uid;

            if (val.hasOwnProperty('users_voted')) {
                let usersVoted = val.users_voted;
                newVotedUsers = usersVoted;
                newVotedUsers.push(uid);
            }
            else {
                newVotedUsers = [uid];
            }

            paletteRef.update({
                'votes': newVote,
                'users_voted': newVotedUsers
            });
        });

    }

    toggleHexCode(e) {
        let target = e.target;
        let parent = target.parentElement;
        let hexcodes = parent.getElementsByClassName('hex');
        for (let i = 0; i < hexcodes.length; i++) {
            hexcodes[i].classList.remove('active');
        }
        target.classList.add('active');
    }

    createColourPalette(colours) {
        return colours.map((colour, index) => {
            var hex = colour.hex_group;
            var current_anonymous_has_voted = false;

            if (colour.hasOwnProperty('users_voted')) {
                let users_voted = colour.users_voted;
                let uid = firebase.auth().currentUser.uid;
                if (users_voted.indexOf(uid) != -1) {
                    current_anonymous_has_voted = true;
                }
            }

            return (
                <li key={index}>
                    <div className="hex-group">
                        {
                            hex.map((code, index) => {
                                let min = Math.ceil(this.getInclusiveRandomNumber(23, 30));
                                let max = Math.floor(this.getInclusiveRandomNumber(55, 65));
                                let height = this.getInclusiveRandomNumber(min, max);
                                height = height + 'px';

                                return (
                                    <div key={index} className="hex" data-hex={code} style={{ 'backgroundColor': code, 'height': height}} onClick={(e) => {this.toggleHexCode(e)}}>
                                        <span>{code}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <h2>{colour.name}</h2>
                    <a onClick={(e) => { this.upvote(e, index) }} className={`votes ${ current_anonymous_has_voted ? 'voted' : '' }`}><span className="oi oi-heart"></span>{colour.votes}</a>
                </li>
            )
        });
    }

    render() {
        if (this.state.colours == null) {
            return(
                <Loading />
            )
        }
        return(
            <div className="app-container">
                <ul className="colours">
                    { this.createColourPalette(this.state.colours) }
                </ul>
            </div>
        )
    }
}

//ReactDOM.render(<App />, document.getElementById('app'));
export default App;
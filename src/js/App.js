import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import firebase from './firebase';
import { Loading } from './Ui';

const url = require('../dist/main.bundle.css');

const database = firebase.database;
const colourRef = database().ref('colours');

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
        // const ref = database().ref('colours');
        const _this = this;

        colourRef.once('value').then(function(snap){
            _this.setState({
                colours: snap.val()
            });
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

    componentWillUnmount() {
        firebase.database().ref().off();
    }

    getInclusiveRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    upvote(e, index) {
        e.preventDefault();
        // const database = firebase.database();
        const paletteRef = database().ref().child('colours/' + index);
        const _this = this;
        let uid = firebase.auth().currentUser.uid;
        
        paletteRef.once('value').then(function(snap) {
            let val = snap.val();
            const realID = val.id;
            
            let newVote = val.votes + 1;
            let newVotedUsers = null;

            if (val.hasOwnProperty('users_voted')) {
                let usersVoted = val.users_voted;
                newVotedUsers = usersVoted;
                newVotedUsers.push(uid);
            }
            else {
                newVotedUsers = [uid];
            }

            // paletteRef.update({
            //     'votes': newVote,
            //     'users_voted': newVotedUsers
            // });

            let allColours = _this.state.colours;
            allColours[realID].votes = newVote;
            allColours[realID].users_voted = newVotedUsers;
    
            _this.setState({
                colours: allColours
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
        // console.log(colours);
        
        let allColours = Object.keys(colours).map((key, index) => {
            var hex = colours[key].hex_group;
            var current_anonymous_has_voted = false;

            if (colours[key].hasOwnProperty('users_voted')) {
                let users_voted = colours[key].users_voted;
                let uid = firebase.auth().currentUser.uid;
                if (users_voted.indexOf(uid) != -1) {
                    current_anonymous_has_voted = true;
                }
            }

            return (
                <li key={colours[key].id}>
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
                    <h2>{colours[key].name}</h2>
                    <a onClick={(e) => { this.upvote(e, colours[key].id) }} className={`votes ${ current_anonymous_has_voted ? 'voted' : '' }`}><span className="oi oi-heart"></span>{colours[key].votes}</a>
                </li>
            )
        });

        return allColours;
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
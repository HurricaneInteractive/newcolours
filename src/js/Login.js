import React from 'react';
import firebase from 'firebase';

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        }
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onLogin(e) {
        e.preventDefault();
        document.getElementById('submit-btn').value = 'Processing...';
        this.props.loginUser(this.state.email, this.state.password);
    }

    render() {
        return (
            <div id="login">
                <div className="login-modal">
                    <h2>Login</h2>
                    <form onSubmit={ this.onLogin.bind(this) }>
                        <input name="email" type="text" value={this.state.email} placeholder="Email" onChange={(e) => {this.onInputChange(e)}} />
                        <input name="password" type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onInputChange(e)}} />
                        <input type="submit" value="Submit" id="submit-btn" />
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
import React from 'react';

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

    render() {
        return (
            <div id="login">
                <div className="login-modal">
                    <h2>Login</h2>
                    <form>
                        <input name="email" type="text" value={this.state.email} placeholder="Email" onChange={(e) => {this.onInputChange(e)}} />
                        <input name="password" type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onInputChange(e)}} />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
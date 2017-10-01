import React from 'react';
import firebase from './firebase';

class AddPalette extends React.Component {
    
    constructor() {
        super();
        this.state = {
            name: '',
            hex1: '',
            hex2: '',
            hex3: '',
            hex4: ''
        };

        this.addNew = this.addNew.bind(this);
    }

    onInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    generateHexInputs(hexs) {
        return hexs.map((name, index) => {
            return (
                <div className="hex-preview-wrapper" key={index}>
                    <div className="hex-preview" style={{ 'backgroundColor': this.state[name] }}/>
                    <input name={name} placeholder="#000" onChange={(e) => { this.onInputChange(e) }} value={this.state[name]} />
                </div>
            )
        });
    }

    addNew(e) {
        e.preventDefault();
        document.getElementById('submit-btn').value = 'Processing...';
        let hex_group = [this.state.hex1, this.state.hex2, this.state.hex3, this.state.hex4];
        this.props.createNew(this.state.name, hex_group);
    }

    render() {
        let names = ['hex1', 'hex2', 'hex3', 'hex4'];
        return(
            <div id="add-new" class="app-container">
                <div class="new-modal">
                    <h2>Add new</h2>
                    <form onSubmit={(e) => { this.addNew(e) }} >
                        <input name="name" placeholder="Palette Name" value={this.state.name} onChange={(e) => { this.onInputChange(e) }} />
                        { this.generateHexInputs(names) }
                        <input type="submit" value="Create" id="submit-btn" />
                    </form>
                </div>
            </div>
        );
    }
}

export default AddPalette;
import React from 'react';
import firebase from './firebase';

class AddPalette extends React.Component {
    constructor() {
        super();
    }

    render() {
        return(
            <div id="add-new" class="app-container">
                <div class="new-modal">
                    <h2>Add new</h2>
                    <form>
                        <input name="name" placeholder="Palette Name" />
                        <input name="hex1" placeholder="hex code" />
                        <input name="hex2" placeholder="hex code" />
                        <input name="hex3" placeholder="hex code" />
                        <input name="hex4" placeholder="hex code" />
                        <input type="submit" value="Create" id="submit-btn" />
                    </form>
                </div>
            </div>
        );
    }
}

export default AddPalette;
import React, {useState} from 'react';

const Home = () => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {

        console.log('handleChange', e.target.value);
        setInputValue(e.target.value);

        fetch(`http://localhost:42500/names?letter=${e.target.value}`)
            .then(res => res.json())
            .then(data => {
                console.log('data', data);
                let result = document.getElementById('result');

                if (data.length === 0) {
                    console.log('no data');

                }
                else if (e.target.value === '') {
                    console.log('no data');
                    result.innerHTML = '';
                }
                else {

                    // update div result with the list of names that start with the letter the user typed in submenu
                    result.innerHTML = '';
                    // loop through the list of names and display them in submenu
                    data.forEach(name => {
                        result.innerHTML += `<li>${name.name}</li>`;

                    });
                }


            })
            .catch(error => {

            })

    };

    const handleClick = () => {
        // get value from input field with id="input"
        const input = document.querySelector('input');
        console.log(input.value);

        fetch(`http://localhost:42500/update?name=${input.value}`)
            .then(response => response.json())
            .then(data => {
                console.log('data', data);
                const result = document.querySelector('#result');
                result.innerHTML = data;
            })
            .catch(error => {
                console.log('error', error);
            });

        // wait 1 second and clear the input field
        setTimeout(() => {
            input.value = '';
        }, 1000);


    };

    const subMenuSelect = (e) => {
        // get the text of the selected item in submenu
        const text = e.target.innerText;
        setInputValue(text);
    }

    return (
        <div className = "KB_TOOL">
            <div id="result" onClick={subMenuSelect}></div>
            <input id="entry" type="text" value={inputValue} onChange={handleChange} autoComplete="off"/>
            <button id="submit" onClick={handleClick}>Submit</button>
        </div>
    );
}

export default Home;
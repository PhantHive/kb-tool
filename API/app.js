require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 2500;
const nameDb = 'data/names.csv';
const fs = require("fs");
const path = require("path");
// set request mode to no cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});


app.disable('x-powered-by');


app.get('/names', (req, res) => {

    const data = fs.readFileSync(path.resolve(__dirname, nameDb), 'utf8');
    console.log('data', data);

    // take off first row that contains the column names
    const rows = data.split('\r\n').slice(1);
    console.log('rows', rows);

    // create an array of objects with the column names as keys
    const names = rows.map(row => {
        const columns = row.split(',');
        return {
            name: columns[0],
            trust: columns[1]
        }
    });


    // filter the list of names that start with the letter the user typed
    const filteredNames = names.filter(name => name.name.startsWith(req.query.letter) && name.name !== '');
    console.log('filteredNames', filteredNames);

    // sort the list of names by trust level
    const sortedNames = filteredNames.sort((a, b) => b.trust - a.trust);
    console.log('sortedNames', sortedNames);

    // return the list of names that start with the letter the user typed
    res.send(sortedNames);

    res.end();


});


app.get('/update', (req, res) => {

    const data = fs.readFileSync(path.resolve(__dirname, nameDb), 'utf8');
    console.log('data', data);

    // get list of names from the CSV file in first column
    let rows = data.split('\r\n');
    // take off first row that contains the header
    rows = rows.slice(1);
    // create an array of objects with the column names as keys
    const names = rows.map(row => {
        const columns = row.split(',');
        return {
            name: columns[0],
            trust: columns[1]
        }
    });


    // check if the name already exists in the CSV file first column
    let nameExists = names.filter(name => name.name === req.query.name);
    console.log('nameExists', nameExists);

    // if the name already exists in the CSV file
    if (nameExists.length > 0) {
        // update the trust level of the name
        console.log('update the trust level of the name');

        // get the index of the name in the array
        const index = names.indexOf(nameExists[0]);
        console.log('index', index);
        console.log(nameExists[0]);

        // update the trust level of the name using formula trust level = Pk previous  + (1 - Pk previous) * Pk new

        // get the trust level of the name in second column
        const trustLevel = parseFloat(names[index].trust.split('\\')[0]);
        console.log('trustLevel', trustLevel);

        // update the trust level of the name
        names[index].trust = `${trustLevel + (1 - trustLevel) * 0.9}\r\n`;
        console.log('names[index].trust', names[index].trust);

        // remove empty rows
        const filteredNames = names.filter(name => name.name !== '' && name.trust !== undefined);
        console.log('Updated Version: ', filteredNames);

        // update the csv file
        fs.writeFileSync(path.resolve(__dirname, nameDb), 'name,trust\r\n' + filteredNames.map(name => name.name + ',' + name.trust).join('\r\n'), 'utf8');

        // wait 0.5 second to make sure the file is updated
        setTimeout(() => {
            res.send('Updated');
        }, 500);



    }
    // if the name does not exist in the CSV file
    else {

        if (data.length === 0) {
            // header : name, trust level
            const header = 'name,trust level\r\n';
            fs.appendFileSync(path.resolve(__dirname, nameDb), header);

        }

        // insert the new name in the CSV file with trust level 1 in a new row
        let newData = `${req.query.name},0.5\r\n`;

        // write the updated array to the CSV file
        fs.appendFileSync(path.resolve(__dirname, nameDb), newData);

        // wait 0.5 second to make sure the file is updated
        setTimeout(() => {
            res.send('Inserted');
            // close the connection
            res.end();
        }, 0.5);


    }
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


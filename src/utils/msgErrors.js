'use strict';

function returnErrorMessage(error) {
    let thereIsError = error.hasOwnProperty('original');

    if (!thereIsError) {
        return { error: error };
    }

    let propertyCode = error.original.error;
    let propertyTable = error.original.table;

    if (propertyTable) {
        let length = propertyTable.length;
        let ext = propertyTable.substring(length - 3, length);

        if (ext === 'ies') {
            propertyTable = propertyTable.substring(0, length - 3) + 'y';
        } else {
            propertyTable = propertyTable.substring(0, length - 1);
        }
    }

    const objErrors = {
        '22P02': { error: 'The ID must have a integer data type' },
        '23505': { error: `The ${propertyTable} is already in the database` },
    };

    return objErrors[propertyCode] || { error: error };
}

module.exports = returnErrorMessage;
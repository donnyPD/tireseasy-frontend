export const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
}

export const getVisualDate = (date) => {
    if (date === '') {
        return date;
    }

    const el = date.split('-');

    return el[1] + '/' + el[2] + '/' + el[0];
}

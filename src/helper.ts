export const getTotalFlightTime = (startDate: string, endDate: string, totalValue: boolean): any => {
    let diffTime = Math.abs(new Date(endDate).valueOf() - new Date(startDate).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    [days, hours, minutes] = [Math.floor(days), Math.floor(hours), Math.floor(minutes)]

    if (!totalValue) {
        return days + ' days ' + hours + 'h ' + minutes + 'm ';
    } else {
        return days*24*60 + hours*60 + minutes;
    }
};

export const parseDate = (date: string) => {
    return date.split('.')[0].replace('T', ' ').replace('Z', '');
};

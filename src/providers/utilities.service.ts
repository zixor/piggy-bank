
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class UtilitiesService {

    constructor() {

    }

    getAppColors() {
        return {
            "primary": "#488aff",
            "secondary": "#32db64",
            "danger": "#f53d3d",
            "light": "#f4f4f4",
            "dark": "#222",
            "cash": "#07DF4F",
            "header": "#6c699c",
            "add-item": "#5ec3ab",
            "warm-1": "#00c4cc",
            "warm-2": "#fe491a",
            "warm-3": "#f7b733",
            "warm-4": "#f0a97e",
            "warm-5": "#078b93",
            "warm-6": "#a33acb",
            "warm-7": "#9099a2",
            "warm-8": "#3cc37e",
            "warm-9": "#eac892",
            "warm-10": "#ddb03a",
            "warm-11": "#e44e40",
            "warm-12": "#eb6c80",
            "warm-13": "#018d96",
            "warm-14": "#8d8d8d",
            "warm-15": "#f3decd",
            "warm-16": "#91628e",
            "warm-17": "#4484ce",
            "warm-18": "#e9d542",
            "warm-19": "#01524b",
            "warm-20": "#01524b",
            "warm-21": "#04514a",
            "warm-22": "#a4a4b0"
        };
    }

    getInitialRangeOfDates() {
        let arrDates = [];
        let date = new Date();

        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDayCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        let initialDate = moment(firstDay).utcOffset(0);
        initialDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

        let finalDate = moment(lastDayCurrentMonth).utcOffset(0);
        finalDate.set({ hour: 23, minute: 59, second: 59, millisecond: 0 })

        arrDates.push(initialDate.toISOString());
        arrDates.push(finalDate.toISOString());

        console.log(arrDates);

        return arrDates;
    }

}
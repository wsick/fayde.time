module Fayde.Time {
    export enum DatePickerFormat {
        Long,
        Short,
    }
    Library.addEnum(DatePickerFormat, "DatePickerFormat");

    export enum TimeDisplayMode {
        Regular,
        Military
    }
    Library.addEnum(TimeDisplayMode, "TimeDisplayMode");
}
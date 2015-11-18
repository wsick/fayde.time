declare module Fayde.Time {
    var version: string;
}
declare module Fayde.Time {
    var Library: nullstone.ILibrary;
}
declare module Fayde.Time {
    import Control = Fayde.Controls.Control;
    class DatePicker extends Control {
        static SelectedMonthProperty: DependencyProperty;
        static SelectedDayProperty: DependencyProperty;
        static SelectedYearProperty: DependencyProperty;
        static SelectedDateProperty: DependencyProperty;
        SelectedMonth: number;
        SelectedDay: number;
        SelectedYear: number;
        SelectedDate: DateTime;
        private OnSelectedMonthChanged(args);
        private OnSelectedDayChanged(args);
        private OnSelectedYearChanged(args);
        private OnSelectedDateChanged(args);
        private _MonthTextBox;
        private _DayTextBox;
        private _YearTextBox;
        private _MonthGesture;
        private _DayGesture;
        private _YearGesture;
        private _SelectionHandler;
        constructor();
        OnApplyTemplate(): void;
        private CoerceMonth(month);
        private CoerceDay(day);
        private CoerceYear(year);
        private CoerceDate();
        private _UpdateText();
    }
}
declare module Fayde.Time {
    enum DatePickerFormat {
        Long = 0,
        Short = 1,
    }
    enum TimeDisplayMode {
        Regular = 0,
        Military = 1,
    }
}
declare module Fayde.Time {
    import Control = Fayde.Controls.Control;
    class TimePicker extends Control {
        static SelectedHourProperty: DependencyProperty;
        static SelectedMinuteProperty: DependencyProperty;
        static SelectedSecondProperty: DependencyProperty;
        static SelectedTimeProperty: DependencyProperty;
        static IsSecondsShownProperty: DependencyProperty;
        static DisplayModeProperty: DependencyProperty;
        SelectedHour: number;
        SelectedMinute: number;
        SelectedSecond: number;
        SelectedTime: TimeSpan;
        IsSecondsShown: boolean;
        DisplayMode: TimeDisplayMode;
        private OnSelectedHourChanged(args);
        private OnSelectedMinuteChanged(args);
        private OnSelectedSecondChanged(args);
        private OnSelectedTimeChanged(args);
        private OnDisplayModeChanged(args);
        private _HourTextBox;
        private _MinuteTextBox;
        private _SecondTextBox;
        private _SecondSeparator;
        private _SuffixTextBlock;
        private _HourGesture;
        private _MinuteGesture;
        private _SecondGesture;
        private _SuffixGesture;
        private _SelectionHandler;
        constructor();
        OnApplyTemplate(): void;
        private _GetHourInput();
        private CoerceHour(hour);
        private CoerceMinute(minute);
        private CoerceSecond(second);
        private CoerceTime();
        private ToggleAmPm();
        private _UpdateText();
    }
}
declare module Fayde.Time.Internal {
    class EventGesture<T extends UIElement> {
        Target: UIElement;
        private _Callback;
        Attach(event: nullstone.Event<nullstone.IEventArgs>, callback: (t: T, e: nullstone.IEventArgs) => void): void;
        Detach(): void;
        private _OnEvent(sender, e);
    }
}
declare module Fayde.Time.Internal {
    import TextBox = Fayde.Controls.TextBox;
    class SelectionHandler {
        private _ActiveBox;
        ActiveBox: TextBox;
        private _IsMouseDown;
        private _TextBoxes;
        constructor(textBoxes: TextBox[]);
        Dispose(): void;
        private _GotFocus(sender, e);
        private _MouseDown(sender, e);
        private _MouseUp(sender, e);
        private _LostFocus(sender, e);
    }
}

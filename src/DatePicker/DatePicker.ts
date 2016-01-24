/// <reference path="DatePickerTextBox" />
/// <reference path="../Calendar/DateTimeHelper" />
/// <reference path="../Calendar/Calendar" />
/// <reference path="../Calendar/CalendarSelectionChangedEventArgs" />
/// <reference path="Dictionary"/>
module Fayde.Time {
    import Control = Fayde.Controls.Control;
    import TextBox = Fayde.Controls.TextBox;
    import TemplateParts = Fayde.Controls.TemplateParts;
    import TemplateVisualStates = Fayde.Controls.TemplateVisualStates;
    import ObservableCollection = Fayde.Collections.ObservableCollection;

    export class DatePicker extends Control {
        
        //CONSTANTS
        public static get ElementTextBox():string {return "PART_TextBox";}
        
        static IsTodayHighlightedProperty = DependencyProperty.Register("IsTodayHighlighted", () => Boolean, DatePicker);
        static SelectedDateFormatProperty = DependencyProperty.Register("SelectedDateFormat", () => DatePickerFormat, DatePicker, DatePickerFormat.Long, (d, args) => (<DatePicker>d).OnSelectedDateFormatChanged(args));
        static SelectedDateProperty = DependencyProperty.Register("SelectedDate", () => Number, DatePicker, NaN, (d, args) => (<DatePicker>d).OnSelectedDateChanged(args));
        static DisplayDateStartProperty = DependencyProperty.RegisterFull("DisplayDateStart", () => DateTime, DatePicker, NaN, 
        (d, args) => (<DatePicker>d).OnDisplayDateStartChanged(args),
        (d, dprop,val) => (<DatePicker>d).CoerceDisplayDateStart(d,val),undefined);
        static TextProperty = DependencyProperty.RegisterFull("Text", () => String, DatePicker, "", 
        (d, args) => (<DatePicker>d).OnTextChanged(args),
        (d, dprop,val) => (<DatePicker>d).OnCoerceText(d,val),undefined);
        static DisplayDateProperty = DependencyProperty.RegisterFull("DisplayDate", () => DateTime, DatePicker, "", 
        undefined,
        (d, dprop,val) => (<DatePicker>d).CoerceDisplayDate(d,val),undefined);
        IsTodayHighlighted: boolean;
        SelectedDateFormat: DatePickerFormat;
        SelectedDate: DateTime;
        DisplayDateStart: DateTime;
        Text: string;
        DisplayDate: DateTime;
        
        SelectedDateChangedEvent = new RoutedEvent<CalendarSelectionChangedEventArgs>();
        
        private OnTextChanged(args: IDependencyPropertyChangedEventArgs) {
            if (!this.IsHandlerSuspended(DatePicker.TextProperty))
            {
                var newValue: string = <string>args.NewValue;

                if (newValue != null)
                {
                    if (this._textBox != null)
                    {
                        this._textBox.Text = newValue;
                    }
                    else
                    {
                        this._defaultText = newValue;
                    }

                    this.SetSelectedDate();
                }
                else
                {
                    this.SetValueNoCallback(DatePicker.SelectedDateProperty, null);
                }
            }
        }
        
        private OnCoerceText(dObject: DependencyObject,baseValue: any): any
        {
            if (this._shouldCoerceText)
            {
                this._shouldCoerceText = false;
                return this._coercedTextValue;
            }

            return baseValue;
        }
        
        private CoerceDisplayDate(dObject: DependencyObject,value: any): any
        {
            // We set _calendar.DisplayDate in order to get _calendar to compute the coerced value
            this._calendar.DisplayDate = <DateTime>value;
            return this._calendar.DisplayDate;
        }
        
        private OnDisplayDateStartChanged(args: IDependencyPropertyChangedEventArgs): void
        {
            //TODO
            //this.CoerceValue(this.DisplayDateEndProperty);
            //this.CoerceValue(this.DisplayDateProperty);
        }

        private CoerceDisplayDateStart(d: DependencyObject,value: any): any
        {
            // We set _calendar.DisplayDateStart in order to get _calendar to compute the coerced value
            this._calendar.DisplayDateStart = <DateTime>value;
            return this._calendar.DisplayDateStart;
        }
        
        private OnSelectedDateFormatChanged(args: IDependencyPropertyChangedEventArgs) {
            if (this._textBox != null)
            {
                // Update DatePickerTextBox.Text
                if (!this._textBox.Text)
                {
                    this.SetWaterMarkText();
                }
                else
                {
                    var date = this.ParseText(this._textBox.Text);

                    if (date != null)
                    {
                        //TODO this.SetTextInternal(this.DateTimeToString((DateTime)date));
                    }
                }
            }
        }
        private OnSelectedDateChangedSelection(args: CalendarSelectionChangedEventArgs):void{
            this.SelectedDateChangedEvent.raise(this,args);
        }
        private OnSelectedDateChanged(args: IDependencyPropertyChangedEventArgs) {
            
            var addedItems = new Array<DateTime>();
            var removedItems = new Array<DateTime>();
            var addedDate:DateTime;
            var removedDate: DateTime;

            //TODO 
            //this.CoerceValue(DisplayDateStartProperty);
            //this.CoerceValue(DisplayDateEndProperty);
            //this.CoerceValue(DisplayDateProperty);

            addedDate = <DateTime>args.NewValue;
            removedDate = <DateTime>args.OldValue;

            if (this.SelectedDate)
            {
                var day: DateTime = this.SelectedDate;
                this.SetTextInternal(this.DateTimeToString(day));

                // When DatePickerDisplayDateFlag is TRUE, the SelectedDate change is coming from the Calendar UI itself,
                // so, we shouldn't change the DisplayDate since it will automatically be changed by the Calendar
                if ((day.Month != this.DisplayDate.Month || day.Year != this.DisplayDate.Year) && !this._calendar.DatePickerDisplayDateFlag)
                {
                    this.DisplayDate = day;
                }

                this._calendar.DatePickerDisplayDateFlag = false;
            }
            else
            {
                this.SetWaterMarkText();
            }

            if (addedDate)
            {
                addedItems.push(addedDate);
            }

            if (removedDate)
            {
                removedItems.push(removedDate);
            }

            this.OnSelectedDateChangedSelection(new CalendarSelectionChangedEventArgs(undefined, removedItems, addedItems));
            /* TODO
            var peer = <DatePickerAutomationPeer>UIElementAutomationPeer.FromElement(this);
            // Raise the propetyChangeEvent for Value if Automation Peer exist
            if (peer != null)
            {
                var addedDateString = addedDate ? this.DateTimeToString(addedDate) : "";
                var removedDateString = removedDate ? this.DateTimeToString(removedDate) : "";
                peer.RaiseValuePropertyChangedEvent(removedDateString, addedDateString);
            */
        }
        
        
        private _calendar: Calendar;
        private _defaultText: string;
        private _textBox: DatePickerTextBox;
        //private _isHandlerSuspended: IDictionary<DependencyProperty, bool>;
        private _isHandlerSuspended: Dictionary;
        private _shouldCoerceText: boolean;
        private _coercedTextValue: string;
        
        /*
        static SelectedMonthProperty = DependencyProperty.Register("SelectedMonth", () => Number, DatePicker, NaN, (d, args) => (<DatePicker>d).OnSelectedMonthChanged(args));
        
        static SelectedYearProperty = DependencyProperty.Register("SelectedYear", () => Number, DatePicker, NaN, (d, args) => (<DatePicker>d).OnSelectedYearChanged(args));
        static SelectedDateProperty = DependencyProperty.Register("SelectedDate", () => DateTime, DatePicker, undefined, (d, args) => (<DatePicker>d).OnSelectedDateChanged(args));
        SelectedMonth: number;
        
        SelectedYear: number;
        SelectedDate: DateTime;

        private OnSelectedMonthChanged(args: IDependencyPropertyChangedEventArgs) {
            this.CoerceMonth(args.NewValue);
            this.CoerceDate();
        }
        private OnSelectedDayChanged(args: IDependencyPropertyChangedEventArgs) {
            this.CoerceDay(args.NewValue);
            this.CoerceDate();
        }
        private OnSelectedYearChanged(args: IDependencyPropertyChangedEventArgs) {
            this.CoerceYear(args.NewValue);
            this.CoerceDate();
        }
        private OnSelectedDateChanged(args: IDependencyPropertyChangedEventArgs) {
            var dt = <DateTime>args.NewValue;
            if (dt instanceof DateTime) {
                this.CoerceMonth(dt.Month);
                this.CoerceDay(dt.Day);
                this.CoerceYear(dt.Year);
            } else {
                this.CoerceMonth(NaN);
                this.CoerceDay(NaN);
                this.CoerceYear(NaN);
            }
        }

        private _MonthTextBox: TextBox = null;
        private _DayTextBox: TextBox = null;
        private _YearTextBox: TextBox = null;

        private _MonthGesture = new Internal.EventGesture<TextBox>();
        private _DayGesture = new Internal.EventGesture<TextBox>();
        private _YearGesture = new Internal.EventGesture<TextBox>();

        private _SelectionHandler: Internal.SelectionHandler = null;
        */
        constructor() {
            super();
            this.DefaultStyleKey = DatePicker;
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            this._textBox = <DatePickerTextBox>this.GetTemplateChild(DatePicker.ElementTextBox);
            /*
            this._MonthGesture.Detach();
            this._MonthTextBox = <TextBox>this.GetTemplateChild("MonthTextBox", TextBox);
            if (this._MonthTextBox)
                this._MonthGesture.Attach(this._MonthTextBox.LostFocus, (tb) => this.CoerceMonth(tb.Text));

            this._DayGesture.Detach();
            this._DayTextBox = <TextBox>this.GetTemplateChild("DayTextBox", TextBox);
            if (this._DayTextBox)
                this._DayGesture.Attach(this._DayTextBox.LostFocus, (tb) => this.CoerceDay(tb.Text));

            this._YearGesture.Detach();
            this._YearTextBox = <TextBox>this.GetTemplateChild("YearTextBox", TextBox);
            if (this._YearTextBox)
                this._YearGesture.Attach(this._YearTextBox.LostFocus, (tb) => this.CoerceDay(tb.Text));

            if (this._SelectionHandler)
                this._SelectionHandler.Dispose();
            this._SelectionHandler = new Internal.SelectionHandler([this._MonthTextBox, this._DayTextBox, this._YearTextBox]);

            this._UpdateText();*/
        }
        /*
        private CoerceMonth(month: any) {
            month = Math.max(1, Math.min(12, month));
            if (!isNaN(month) || !isNaN(this.SelectedMonth))
                this.SetCurrentValue(DatePicker.SelectedMonthProperty, month);
            this._UpdateText();
        }
        private CoerceDay(day: any) {
            day = Math.max(1, Math.min(31, parseFloat(day)));
            if (!isNaN(day) || !isNaN(this.SelectedDay))
                this.SetCurrentValue(DatePicker.SelectedDayProperty, day);
            this._UpdateText();
        }
        private CoerceYear(year: any) {
            var maxYear = DateTime.MaxValue.Year - 1;
            year = Math.min(maxYear, Math.max(0, year));
            if (!isNaN(year) || !isNaN(this.SelectedYear))
                this.SetCurrentValue(DatePicker.SelectedYearProperty, year);
            this._UpdateText();
        }
        private CoerceDate() {
            var m = this.SelectedMonth;
            var d = this.SelectedDay;
            var y = this.SelectedYear;
            if (isNaN(m) || isNaN(d) || isNaN(y))
                return;
            var dte = new DateTime(y, m, d);
            if (DateTime.Compare(dte, this.SelectedDate) === 0)
                return;
            this.SetCurrentValue(DatePicker.SelectedDateProperty, dte);
        }

        private _UpdateText() {
            if (this._MonthTextBox)
                this._MonthTextBox.Text = formatNumber(this.SelectedMonth, 2, "MM");
            if (this._DayTextBox)
                this._DayTextBox.Text = formatNumber(this.SelectedDay, 2, "DD");
            if (this._YearTextBox)
                this._YearTextBox.Text = formatNumber(this.SelectedYear, 4, "YYYY");
        }*/
        
        private SetWaterMarkText(): void
        {
            if (this._textBox != null)
            {
                var dtfi = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this));
                this.SetTextInternal("");
                this._defaultText = "";

                switch (this.SelectedDateFormat)
                {
                    case DatePickerFormat.Long:
                        {
                            //TODO this._textBox.Watermark = string.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.LongDatePattern.ToString());
                            this._textBox.Watermark = "yyyy/MM/dd"
                            break;
                        }

                    case DatePickerFormat.Short:
                        {
                            //TODO this._textBox.Watermark = string.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.ShortDatePattern.ToString());
                            this._textBox.Watermark = "yy/MM/dd"
                            break;
                        }
                }
            }
        }
        
        private  SetTextInternal(value: string): void
        {
            if (this.GetBindingExpression(DatePicker.TextProperty) != null)
            {
                this.Text = value;
            }
            else
            {
                this._shouldCoerceText = true;
                this._coercedTextValue = value;
                //TODO this.CoerceValue(DatePicker.TextProperty);
            }
        }
        
        private ParseText(text: string): DateTime
        {
            var newSelectedDate: DateTime;

            // TryParse is not used in order to be able to pass the exception to the TextParseError event
            try
            {
                //TODO newSelectedDate = DateTime.Parse(text, DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)));
                newSelectedDate = new DateTime(Date.parse(text))
                if (Calendar.IsValidDateSelection(this._calendar, newSelectedDate))
                {
                    return newSelectedDate;
                }
                else
                {
                    /*
                    var dateValidationError = new DatePickerDateValidationErrorEventArgs(new ArgumentOutOfRangeException("text", SR.Get(SRID.Calendar_OnSelectedDateChanged_InvalidValue)), text);
                    OnDateValidationError(dateValidationError);

                    if (dateValidationError.ThrowException)
                    {
                        throw dateValidationError.Exception;
                    }*/
                }
            }
            catch (ex)
            {
                /*
                DatePickerDateValidationErrorEventArgs textParseError = new DatePickerDateValidationErrorEventArgs(ex, text);
                OnDateValidationError(textParseError);

                if (textParseError.ThrowException && textParseError.Exception != null)
                {
                    throw textParseError.Exception;
                }
                */
            }

            return null;
        }
        
        private DateTimeToString(d: DateTime): string
        {
            var dtfi = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this));

            switch (this.SelectedDateFormat)
            {
                case DatePickerFormat.Short:
                    {
                        //TODO return string.format(CultureInfo.CurrentCulture, d.toString(dtfi.ShortDatePattern, dtfi));
                        return d.toString();
                    }

                case DatePickerFormat.Long:
                    {
                        //TODO return string.format(CultureInfo.CurrentCulture, d.toString(dtfi.LongDatePattern, dtfi));
                        return d.toString()
                    }
            }      

            return null;
        }
        
        private SetValueNoCallback(property: DependencyProperty,value: any): void
        {
            this.SetIsHandlerSuspended(property, true);
            try
            {
                this.SetValue(property, value);
            }
            finally
            {
                this.SetIsHandlerSuspended(property, false);
            }
        }

        private IsHandlerSuspended(property: DependencyProperty): boolean
        {
            return this._isHandlerSuspended != null && this._isHandlerSuspended.containsKey(property.Name);
        }

        private SetIsHandlerSuspended(property: DependencyProperty,value: boolean): void
        {
            if (value)
            {
                if (this._isHandlerSuspended == null)
                {
                    this._isHandlerSuspended = new Dictionary([]);
                }

                this._isHandlerSuspended[property.Name] = true;
            }
            else
            {
                if (this._isHandlerSuspended != null)
                {
                    this._isHandlerSuspended.remove(property.Name);
                }
            }
        }
        
        private SetSelectedDate(): void
        {
            if (this._textBox != null)
            {
                if (this._textBox.Text)
                {
                    var s = this._textBox.Text;

                    if (this.SelectedDate != null)
                    {
                        // If the string value of the SelectedDate and the TextBox string value are equal,
                        // we do not parse the string again
                        // if we do an extra parse, we lose data in M/d/yy format
                        // ex: SelectedDate = DateTime(1008,12,19) but when "12/19/08" is parsed it is interpreted as DateTime(2008,12,19)
                        var selectedDate = this.DateTimeToString(this.SelectedDate);

                        if (selectedDate == s)
                        {
                            return;
                        }
                    }

                    var d = this.SetTextBoxValue(s);
                    if (!(this.SelectedDate == d))
                    {
                        this.SelectedDate = d;
                        this.DisplayDate = d;
                    }
                }
                else
                {
                    if (this.SelectedDate != null)
                    {
                        this.SelectedDate = null;
                    }
                }
            }
            else
            {
                var d = this.SetTextBoxValue(this._defaultText);
                if (!(this.SelectedDate == d))
                {
                    this.SelectedDate = d;
                }
            }
        }
        
        private SetTextBoxValue(s: string): DateTime
        {
            if (!s)
            {
                this.SetValue(DatePicker.TextProperty, s);
                return this.SelectedDate;
            }
            else
            {
                var d = this.ParseText(s);

                if (d != null)
                {
                    this.SetValue(DatePicker.TextProperty, this.DateTimeToString(d));
                    return d;
                }
                else
                {
                    // If parse error:
                    // TextBox should have the latest valid selecteddate value:
                    if (this.SelectedDate != null)
                    {
                        var newtext = this.DateTimeToString(this.SelectedDate);
                        this.SetValue(DatePicker.TextProperty, newtext);
                        return this.SelectedDate;
                    }
                    else
                    {
                        this.SetWaterMarkText();
                        return null;
                    }
                }
            }
        }
        
    }
    TemplateParts(DatePicker,
        { Name: "MonthTextBox", Type: TextBox },
        { Name: "DayTextBox", Type: TextBox },
        { Name: "YearTextBox", Type: TextBox });
    TemplateVisualStates(DatePicker,
        { GroupName: "CommonStates", Name: "Normal" },
        { GroupName: "CommonStates", Name: "Disabled" },
        { GroupName: "ValidationStates", Name: "Valid" },
        { GroupName: "ValidationStates", Name: "InvalidFocused" },
        { GroupName: "ValidationStates", Name: "InvalidUnfocused" });
    //[StyleTypedProperty(Property = "CalendarStyle", StyleTargetType = typeof (Calendar))]

    function formatNumber(n: number, digits: number, fallback: string) {
        if (isNaN(n))
            return fallback;
        return Localization.Format("{0:d" + digits + "}", n);
    }
}
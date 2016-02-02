/// <reference path="DatePickerTextBox" />
/// <reference path="../Calendar/DateTimeHelper" />
/// <reference path="../Calendar/Calendar" />
/// <reference path="../Calendar/CalendarSelectionChangedEventArgs" />
/// <reference path="Dictionary"/>
/// <reference path="../Enums" />
module Fayde.Time {
    import Control = Fayde.Controls.Control;
    import TextBox = Fayde.Controls.TextBox;
    import TemplateParts = Fayde.Controls.TemplateParts;
    import TemplateVisualStates = Fayde.Controls.TemplateVisualStates;
    import ObservableCollection = Fayde.Collections.ObservableCollection;
    import Button = Fayde.Controls.Button;
    import Overlay = Fayde.Controls.Primitives.Overlay;
    import DatePickerFormat = Fayde.Time.DatePickerFormat;

    export class DatePicker extends Control {
        
        //CONSTANTS
        public static get ElementRoot():string {return "PART_Root";}
        public static get ElementTextBox():string {return "PART_TextBox";}
        public static get ElementButton():string {return "PART_Button";}
        public static get ElementPopup():string {return "PART_Popup";}
        
        static IsTodayHighlightedProperty = DependencyProperty.Register("IsTodayHighlighted", () => Boolean, DatePicker);
        static SelectedDateFormatProperty = DependencyProperty.Register("SelectedDateFormat", () => DatePickerFormat, DatePicker, DatePickerFormat.Long, (d, args) => (<DatePicker>d).OnSelectedDateFormatChanged(args));
        static SelectedDateProperty = DependencyProperty.Register("SelectedDate", () => Number, DatePicker, null, (d, args) => (<DatePicker>d).OnSelectedDateChanged(args));
        static DisplayDateStartProperty = DependencyProperty.RegisterFull("DisplayDateStart", () => DateTime, DatePicker, NaN, 
        (d, args) => (<DatePicker>d).OnDisplayDateStartChanged(args),
        (d, dprop,val) => (<DatePicker>d).CoerceDisplayDateStart(d,val),undefined);
        static TextProperty = DependencyProperty.RegisterFull("Text", () => String, DatePicker, "", 
        (d, args) => (<DatePicker>d).OnTextChanged(args),
        (d, dprop,val) => (<DatePicker>d).OnCoerceText(d,val),undefined);
        static DisplayDateProperty = DependencyProperty.RegisterFull("DisplayDate", () => DateTime, DatePicker, "", 
        undefined,
        (d, dprop,val) => (<DatePicker>d).CoerceDisplayDate(d,val),undefined);
        static IsDropDownOpenProperty = DependencyProperty.RegisterFull("IsDropDownOpen", () => Boolean, DatePicker, false, 
        (d, args) => (<DatePicker>d).OnIsDropDownOpenChanged(args),
        (d, dprop,val) => (<DatePicker>d).OnCoerceIsDropDownOpen(d,val),undefined);
        static FirstDayOfWeekProperty = DependencyProperty.Register("FirstDayOfWeek", () => DayOfWeek, DatePicker,
        DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek, 
        (d, args) => (<DatePicker>d).OnFirstDayOfWeekChanged(args));
        IsTodayHighlighted: boolean;
        SelectedDateFormat: DatePickerFormat;
        SelectedDate: DateTime;
        DisplayDateStart: DateTime;
        Text: string;
        DisplayDate: DateTime;
        IsDropDownOpen: boolean;
        FirstDayOfWeek: DayOfWeek;
                
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
            
            var addedItems = new ObservableCollection<DateTime>();
            var removedItems = new ObservableCollection<DateTime>();
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
                addedItems.Add(addedDate);
            }

            if (removedDate)
            {
                removedItems.Add(removedDate);
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
        
        private OnCoerceIsDropDownOpen(d: DependencyObject,baseValue: any): any
        {
            if (!this.IsEnabled)
            {
                return false;
            }

            return baseValue;
        }

        /// <summary>
        /// IsDropDownOpenProperty property changed handler.
        /// </summary>
        /// <param name="d">DatePicker that changed its IsDropDownOpen.</param>
        /// <param name="e">DependencyPropertyChangedEventArgs.</param>
        private  OnIsDropDownOpenChanged(e: DependencyPropertyChangedEventArgs): void
        {

            var newValue = <boolean>e.NewValue;
            if (this._popUp != null && this._popUp.IsOpen != newValue)
            {
                this._popUp.IsOpen = newValue;
                if (newValue)
                {
                    this._originalSelectedDate = this.SelectedDate;
                    // When the popup is opened set focus to the DisplayDate button. 
                    // Do this asynchronously because the IsDropDownOpen could 
                    // have been set even before the template for the DatePicker is 
                    // applied. And this would mean that the visuals wouldn't be available yet.
                     this._calendar.Focus();
                    // TODO
                    /*
                    this.Dispatcher.BeginInvoke(DispatcherPriority.Input, (Action)delegate()
                    {
                        
                        // setting the focus to the calendar will focus the correct date.
                        this._calendar.Focus();
                    });*/

                }
            }
        }
        
        private  OnFirstDayOfWeekChanged(e: DependencyPropertyChangedEventArgs): void
        {
            this._calendar.UpdateCellItems();
        }
        
        
        private _calendar: Calendar;
        private _defaultText: string;
        private _textBox: DatePickerTextBox;
        private _popUp: Overlay;
        private _disablePopupReopen: boolean;
        private _dropDownButton: Button;
        private _isHandlerSuspended: Dictionary;
        private _shouldCoerceText: boolean;
        private _coercedTextValue: string;
        private _originalSelectedDate: DateTime;
        
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
            this.InitializeCalendar();
            this._defaultText = "";

            // Binding to FirstDayOfWeek and DisplayDate wont work
            this.FirstDayOfWeek = DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek;
            this.DisplayDate = DateTime.Today;
        }

        OnApplyTemplate() {
            super.OnApplyTemplate();
            
            this._popUp = <Overlay>this.GetTemplateChild(DatePicker.ElementPopup);

            if (this._popUp != null)
            {
                //this._popUp.AddHandler(PreviewMouseLeftButtonDownEvent, new MouseButtonEventHandler(PopUp_PreviewMouseLeftButtonDown));
                this._popUp.Opened.on(this.PopUp_Opened,this);
                this._popUp.Closed.on(this.PopUp_Closed,this);
                this._popUp.Visual = this._calendar;

                if (this.IsDropDownOpen)
                {
                    this._popUp.IsOpen = true;
                }
            }

            this._dropDownButton = <Button>this.GetTemplateChild(DatePicker.ElementButton);
            if (this._dropDownButton != null)
            {
                this._dropDownButton.Click.on(this.DropDownButton_Click,this);
                //TODO this._dropDownButton.AddHandler(MouseLeaveEvent, new MouseEventHandler(DropDownButton_MouseLeave), true);

            }

            this._textBox = <DatePickerTextBox>this.GetTemplateChild(DatePicker.ElementTextBox);

            this.UpdateDisabledVisual();
            if (this.SelectedDate === null)
            {
                this.SetWaterMarkText();
            }

            if (this._textBox != null)
            {
                //TODO this._textBox.AddHandler(TextBox.KeyDownEvent, new KeyEventHandler(TextBox_KeyDown), true);
                //TODO this._textBox.AddHandler(TextBox.TextChangedEvent, new TextChangedEventHandler(TextBox_TextChanged), true);
                //TODO this._textBox.AddHandler(TextBox.LostFocusEvent, new RoutedEventHandler(TextBox_LostFocus), true);
                this._textBox.TextChanged.on(this.TextBox_TextChanged,this);


                if (this.SelectedDate == null)
                {
                    if (!this._defaultText)
                    {
                        this._textBox.Text = this._defaultText;
                        this.SetSelectedDate();
                    }
                }
                else
                {
                    this._textBox.Text = this.DateTimeToString(this.SelectedDate);
                }
            }
            
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
        
        private TextBox_TextChanged(sender:any,e: RoutedEventArgs): void
        {
            this.SetValueNoCallback(DatePicker.TextProperty, this._textBox.Text);
        }
        
        PopUp_Opened(e:RoutedEventArgs) :void {
            if (!this.IsDropDownOpen)
            {
                this.IsDropDownOpen = true;
            }

            if (this._calendar != null)
            {
                this._calendar.DisplayMode = CalendarMode.Month;
                //TODO this._calendar.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
            }

            this.OnCalendarOpened(new RoutedEventArgs());
        }
        
        PopUp_Closed(e:RoutedEventArgs) :void {
            if (!this.IsDropDownOpen)
            {
                this.IsDropDownOpen = false;
            }

            //TODO
            /*
            if (this._calendar.IsKeyboardFocusWithin)
            {
                this.MoveFocus(new TraversalRequest(FocusNavigationDirection.First));
            }*/

            this.OnCalendarClosed(new RoutedEventArgs());
        }
        
        private SetWaterMarkText(): void
        {
            if (this._textBox != null)
            {
                var dtfi = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this));
                this.SetTextInternal("");
                this._defaultText = "";

                if(this.SelectedDateFormat == DatePickerFormat.Long)
                {
                    //TODO this._textBox.Watermark = string.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.LongDatePattern.ToString());
                    this._textBox.Watermark = dtfi.LongDatePattern.toString();
                }
                else
                {
                    //TODO this._textBox.Watermark = string.Format(CultureInfo.CurrentCulture, SR.Get(SRID.DatePicker_WatermarkText), dtfi.ShortDatePattern.ToString());
                    this._textBox.Watermark = dtfi.ShortDatePattern.toString()
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
                this.SetValue(DatePicker.TextProperty,value);
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
            
            var format = this.SelectedDateFormat+"";

            if(format== DatePickerFormat[DatePickerFormat.Short])
            {
                return d.toString(dtfi.ShortDatePattern);
            }
            else if(format == DatePickerFormat[DatePickerFormat.Long])
            {
                return d.toString(dtfi.LongDatePattern)
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
        
        private  UpdateDisabledVisual(): void
        {
            if (!this.IsEnabled)
            {
                //TODO VisualStates.GoToState(this, true, VisualStates.StateDisabled, VisualStates.StateNormal);
            }
            else
            {
                //TODO VisualStates.GoToState(this, true, VisualStates.StateNormal);
            }
        }
        
        private DropDownButton_Click(sender: any,e: RoutedEventArgs): void
        {
            this.TogglePopUp();
        }
        
        private DropDownButton_MouseLeave(sender: any,e: Input.MouseEventArgs): void
        {
            this._disablePopupReopen = false;
        }

        private TogglePopUp(): void
        {
            if (this.IsDropDownOpen)
            {
                this.IsDropDownOpen = false;
            }
            else
            {
                if (this._disablePopupReopen)
                {
                    this._disablePopupReopen = false;
                }
                else
                {
                    this.SetSelectedDate();
                    this.IsDropDownOpen = true;
                }
            }
        }
        
        OnCalendarClosed(e: RoutedEventArgs): void
        {
            /*
            RoutedEventHandler handler = this.CalendarClosed;
            if (null != handler)
            {
                handler(this, e);
            }*/
        }

        OnCalendarOpened(e: RoutedEventArgs): void
        {/*
            RoutedEventHandler handler = this.CalendarOpened;
            if (null != handler)
            {
                handler(this, e);
            }*/
        }
        
        private InitializeCalendar()
        {
            this._calendar = new Calendar();
            //this._calendar.DayButtonMouseUp += new MouseButtonEventHandler(Calendar_DayButtonMouseUp);
            //this._calendar.DisplayDateChanged += new EventHandler<CalendarDateChangedEventArgs>(Calendar_DisplayDateChanged);
            this._calendar.SelectedDateChanged.on(this.Calendar_SelectedDatesChanged,this);
            //this._calendar.DayOrMonthPreviewKeyDown += new RoutedEventHandler(CalendarDayOrMonthButton_PreviewKeyDown);
            //this._calendar.HorizontalAlignment = HorizontalAlignment.Left;
            //this._calendar.VerticalAlignment = VerticalAlignment.Top;

            this._calendar.SelectionMode = CalendarSelectionMode.SingleDate;
            //this._calendar.SetBinding(Calendar.ForegroundProperty, GetDatePickerBinding(DatePicker.ForegroundProperty));            
            //this._calendar.SetBinding(Calendar.StyleProperty, GetDatePickerBinding(DatePicker.CalendarStyleProperty));
            //this._calendar.SetBinding(Calendar.IsTodayHighlightedProperty, GetDatePickerBinding(DatePicker.IsTodayHighlightedProperty));
            //this._calendar.SetBinding(Calendar.FirstDayOfWeekProperty, GetDatePickerBinding(DatePicker.FirstDayOfWeekProperty));
        }
        
        private Calendar_SelectedDatesChanged(sender: any,e: CalendarSelectionChangedEventArgs): void
        {
            if (e.AddedItems.Count > 0 && this.SelectedDate && DateTime.Compare(e.AddedItems.GetValueAt(0), this.SelectedDate) != 0)
            {
                this.SelectedDate = e.AddedItems.GetValueAt(0);
            }
            else
            {
                if (e.AddedItems.Count == 0)
                {
                    this.SelectedDate = null;
                    return;
                }

                if (!this.SelectedDate)
                {
                    if (e.AddedItems.Count > 0)
                    {
                        this.SelectedDate = e.AddedItems.GetValueAt(0);
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
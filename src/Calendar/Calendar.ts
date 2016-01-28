/// <reference path="CalendarMode" />
/// <reference path="CalendarItem" />
/// <reference path="CalendarSelectionMode" />
/// <reference path="DateTimeHelper" />
/// <reference path="CalendarBlackoutDatesCollection" />
/// <reference path="SelectedDatesCollection" />
module Fayde.Time {
    import Control = Fayde.Controls.Control;
    import CalendarMode = Time.CalendarMode;
    import CalendarItem = Time.CalendarItem;
    import CalendarSelectionMode = Time.CalendarSelectionMode;
    import CalendarBlackoutDatesCollection = Time.CalendarBlackoutDatesCollection;
    import SelectedDatesCollection = Time.SelectedDatesCollection;
    
	export class Calendar extends Control	{
        //CONSTANTS
        public static get ElementRoot():string {return "PART_Root";}
        public static get ElementMonth(): string { return "PART_CalendarItem";}
        
        static CalendarItemStyleProperty = DependencyProperty.Register("CalendarItemStyle", () => Style, Calendar);
        public CalendarItemStyle: Style;
        
        static DisplayDateProperty = DependencyProperty.Register("DisplayDate", () => DateTime, Calendar, NaN, (d, args) => (<Calendar>d).OnDisplayDateChanged(args));
        public DisplayDate: DateTime;
        private OnDisplayDateChanged(args: IDependencyPropertyChangedEventArgs) {
            this.DisplayDateInternal = DateTimeHelper.DiscardDayTime(args.NewValue);
            this.UpdateCellItems();
        }
        
        static DisplayDateEndProperty = DependencyProperty.Register("DisplayDateEnd", () => DateTime, Calendar, NaN, (d, args) => (<Calendar>d).OnDisplayDateEndChanged(args));
        public DisplayDateEnd: DateTime;
        private OnDisplayDateEndChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateCellItems();
        }
        
        static DisplayDateStartProperty = DependencyProperty.Register("DisplayDateStart", () => DateTime, Calendar, NaN, (d, args) => (<Calendar>d).OnDisplayDateStartChanged(args));
        public DisplayDateStart: DateTime;
        private OnDisplayDateStartChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateCellItems();
        }
        
        static DisplayModeProperty = DependencyProperty.Register("DisplayMode", () => CalendarMode, Calendar, CalendarMode.Month, (d, args) => (<Calendar>d).OnDisplayModePropertyChanged(args));
        public DisplayMode: CalendarMode;
        private OnDisplayModePropertyChanged(e: IDependencyPropertyChangedEventArgs) {
            var mode = e.NewValue;
            var oldMode = e.OldValue;
            var monthControl = this.MonthControl;

            switch (mode)
            {
                case CalendarMode.Month:
                    {
                        if (oldMode == CalendarMode.Year || oldMode == CalendarMode.Decade)
                        {
                            // Cancel highlight when switching to month display mode
                            this.HoverStart = this.HoverEnd = null;
                            this.CurrentDate = this.DisplayDate;
                        }

                        this.UpdateCellItems();
                        break;
                    }

                case CalendarMode.Year:
                case CalendarMode.Decade:
                    {
                        if (oldMode == CalendarMode.Month)
                        {
                            this.DisplayDate = this.CurrentDate;
                        }

                        this.UpdateCellItems();
                        break;
                    }

                default:
                    break;
            }
        }
        
        static FirstDayOfWeekProperty = DependencyProperty.Register("FirstDayOfWeek", () => DayOfWeek, Calendar, DateTimeHelper.GetCurrentDateFormat().FirstDayOfWeek, (d, args) => (<Calendar>d).OnFirstDayOfWeekChanged(args));
        public FirstDayOfWeek: DayOfWeek;
        private OnFirstDayOfWeekChanged(args: IDependencyPropertyChangedEventArgs) {
            this.UpdateCellItems();
        }
        
        static IsTodayHighlightedProperty = DependencyProperty.Register("IsTodayHighlighted", () => Boolean, Calendar, true, (d, args) => (<Calendar>d).OnIsTodayHighlightedChanged(args));
        public IsTodayHighlighted: Boolean;
        private OnIsTodayHighlightedChanged(args: IDependencyPropertyChangedEventArgs) {
            var i = DateTimeHelper.CompareYearMonth(this.DisplayDateInternal, DateTime.Today);

            if (i > -2 && i < 2)
            {
                this.UpdateCellItems();
            }
        }
        
        static SelectedDateProperty = DependencyProperty.Register("SelectedDate", () => NaN, Calendar, true, (d, args) => (<Calendar>d).OnSelectedDateChanged(args));
        public SelectedDate: DateTime;
        private OnSelectedDateChanged(e: IDependencyPropertyChangedEventArgs) {
            
            if (this.SelectionMode != CalendarSelectionMode.None || e.NewValue == null)
            {
                var addedDate = e.NewValue;

                if (Calendar.IsValidDateSelection(this, addedDate))
                {
                    if (!addedDate.HasValue)
                    {
                        this.SelectedDates.ClearInternal(true /*fireChangeNotification*/);
                    }
                    else
                    {
                        if (addedDate.HasValue && !(this.SelectedDates.Count > 0 && this.SelectedDates[0] == addedDate.Value))
                        {
                            this.SelectedDates.ClearInternal(false);
                            this.SelectedDates.Add(addedDate.Value);
                        }
                    }

                    // We update the current date for only the Single mode.For the other modes it automatically gets updated
                    if (this.SelectionMode == CalendarSelectionMode.SingleDate)
                    {
                        if (addedDate.HasValue)
                        {
                            this.CurrentDate = addedDate.Value;
                        }

                        this.UpdateCellItems();
                    }
                }
                else
                {
                    throw new ArgumentOutOfRangeException("d");
                }
            }
            else
            {
                throw new InvalidOperationException("");
            }
            
        }
        
        static SelectionModeProperty = DependencyProperty.Register("SelectionMode", () => CalendarSelectionMode, Calendar, CalendarSelectionMode.SingleDate, (d, args) => (<Calendar>d).OnSelectionModeChanged(args));
        public SelectionMode: CalendarSelectionMode;
        private OnSelectionModeChanged(args: IDependencyPropertyChangedEventArgs) {
            
        }
        
        public HoverStart: DateTime;
        public HoverEnd: DateTime;
        
        public BlackoutDates: CalendarBlackoutDatesCollection<any>;
        public SelectedDates: SelectedDatesCollection<any>;
        public DisplayDateInternal: DateTime;

        private _currentDate: DateTime;
        
        private _monthControl: CalendarItem;
        public get MonthControl(): CalendarItem{
            return this._monthControl;
        }
        
        public get DisplayDateStartInternal(): DateTime{
            if(!this.DisplayDateStart){
                return new DateTime(1980,1,1);
            }else{
                return this.DisplayDateStart;
            }
            
         };
         
         public get DisplayDateEndInternal(): DateTime{
            if(!this.DisplayDateEnd){
                return DateTime.MaxValue;
            }else{
                return this.DisplayDateEnd;
            }
            
         };
        
        //CurrentDate
        private get CurrentDate() : DateTime {
            if(this._currentDate==null){
                return this.DisplayDateEndInternal;
            }else{
                return this._currentDate;
            }
            
        }
        private set CurrentDate(value: DateTime) { this._currentDate = value;}
        
        constructor() {
            super();
            this.DefaultStyleKey = Calendar;
            //TODO
            this.BlackoutDates = new CalendarBlackoutDatesCollection<CalendarDateRange>();
            this.SelectedDates = new SelectedDatesCollection<DateTime>();
        }
        
        OnApplyTemplate() {
            
            if (this._monthControl)
            {
                this._monthControl.Owner = null;
            }

            super.OnApplyTemplate();
            this._monthControl = <CalendarItem>this.GetTemplateChild(Calendar.ElementMonth, CalendarItem);

            if (this._monthControl != null)
            {
                this._monthControl.Owner = this;
            }

            this.CurrentDate = this.DisplayDate;
            this.UpdateCellItems();
            
        }
        
        public UpdateCellItems(){
            var monthControl = this.MonthControl;
            if (monthControl != null)
            {
                switch (this.DisplayMode)
                {
                    case CalendarMode.Month:
                    {
                        monthControl.UpdateMonthMode();
                        break;
                    }

                    case CalendarMode.Year:
                    {
                        //monthControl.UpdateYearMode();
                        break;
                    }

                    case CalendarMode.Decade:
                    {
                        //monthControl.UpdateDecadeMode();
                        break;
                    }

                    default: 
                        break;
                }
            }
        }
        
        public static IsValidDateSelection(cal:Calendar,value: any ): boolean
        {
            return (value == null) || (!cal.BlackoutDates.Contains(value));
        }
        
        //INTERNALS
        DatePickerDisplayDateFlag: boolean;
        
	}
}
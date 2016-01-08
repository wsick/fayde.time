/// <reference path="CalendarMode" />
module Fayde.Time {
    import Control = Fayde.Controls.Control;
    import CalendarMode = Time.CalendarMode;
    import CalendarBlackoutDatesCollection = Time.CalendarBlackoutDatesCollection;
    import SelectedDatesCollection = Time.SelectedDatesCollection;
    
	export class Calendar extends Control	{
        //CONSTANTS
        public static get ElementRoot():string {return "PART_Root";}
        public static get ElementMonth(): string { return "PART_CalendarItem";}
        
		public IsTodayHighlighted: Boolean;
        public DisplayMode: CalendarMode = CalendarMode.Month;
        public DisplayDate: DateTime;
        public HoverStart: DateTime;
        public HoverEnd: DateTime;
        public FirstDayOfWeek: DayOfWeek;
        public DisplayDateStartInternal: DateTime;
        public DisplayDateEndInternal: DateTime;
        public BlackoutDates: CalendarBlackoutDatesCollection<CalendarDateRange>;
        public SelectedDates: SelectedDatesCollection<DateTime>;
        public DisplayDateInternal: DateTime;

        private _currentDate: DateTime;
        
        private _monthControl: CalendarItem;
        public get MonthControl(): CalendarItem{
            return this._monthControl;
        }
        
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
        }
        
        OnApplyTemplate() {
            
            if (this._monthControl)
            {
                this._monthControl.Owner = null;
            }

            super.OnApplyTemplate();
            this._monthControl = <CalendarItem>this.GetTemplateChild(Calendar.ElementMonth);

            if (this._monthControl != null)
            {
                this._monthControl.Owner = this;
            }

            this.CurrentDate = this.DisplayDate;
            this.UpdateCellItems();
            
        }
        
        private UpdateCellItems(){
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
        
        
	}
}
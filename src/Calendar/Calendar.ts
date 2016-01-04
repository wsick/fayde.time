module Fayde.Time {
    import Control = Fayde.Controls.Control;
    import CalendarMode = Time.CalendarMode;
    import CalendarBlackoutDatesCollection = Time.CalendarBlackoutDatesCollection;
    import SelectedDatesCollection = Time.SelectedDatesCollection;
    
	export class Calendar extends Control	{
		public IsTodayHighlighted: Boolean;
        public DisplayMode: CalendarMode;
        public DisplayDate: DateTime;
        public HoverStart: DateTime;
        public HoverEnd: DateTime;
        public FirstDayOfWeek: DayOfWeek;
        public DisplayDateStartInternal: DateTime;
        public DisplayDateEndInternal: DateTime;
        public BlackoutDates: CalendarBlackoutDatesCollection<CalendarDateRange>;
        public SelectedDates: SelectedDatesCollection<DateTime>;
        public DisplayDateInternal: DateTime;
        
        constructor() {
            super();
            this.DefaultStyleKey = Calendar;
        }
        
	}
}
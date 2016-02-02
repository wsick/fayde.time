module Fayde.Time{
    import Calendar = Time.Calendar;
    import ObservableCollection =  Fayde.Collections.ObservableCollection;
    import CalendarDateRange = Time.CalendarDateRange;
    import DateTimeHelper = Time.DateTimeHelper;
    
    export class CalendarBlackoutDatesCollection<CalendarDateRange> extends ObservableCollection<any>{
        
        private _addedItems: ObservableCollection<DateTime>;
        private _removedItems:  ObservableCollection<DateTime> ;
        //private Thread _dispatcherThread;
        private _isAddingRange: boolean;
        private _owner: Calendar;
        private _maximumDate: DateTime;
        private _minimumDate: DateTime;
        
		constructor() {
            super();
        }
        
        GetNonBlackoutDate(requestedDate: any,dayInterval: number): DateTime
        {
            var currentDate = requestedDate;
            var range = null;

            if (requestedDate == null)
            {
                return null;
            }

            if ((range = this.GetContainingDateRange(currentDate)) == null)
            {
                return requestedDate;
            }

            do
            {
                if (dayInterval > 0)
                {
                    // Moving Forwards.
                    // The DateRanges require start <= end
                    currentDate = DateTimeHelper.AddDays(range.End, dayInterval);

                }
                else
                {
                    //Moving backwards.
                    currentDate = DateTimeHelper.AddDays(range.Start, dayInterval);
                }

            } while (currentDate != null && ((range = this.GetContainingDateRange(currentDate)) != null));



            return currentDate;
        }
        
        private GetContainingDateRange(date: any): CalendarDateRange
        {
            if (date == null)
                return null;

            for (var i = 0; i < this.Count; i++)
            {
                if (DateTimeHelper.InRange(date, this[i].Start,this[i].End))
                {
                    return this[i];
                }
            }
            return null;
        }

	}
}
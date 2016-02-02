/// reference path="CalendarSelectionChangedEventArgs" />
/// reference path="Calendar" /> 
module Fayde.Time{
    import Calendar = Time.Calendar;
    import ObservableCollection =  Fayde.Collections.ObservableCollection;
    //import CalendarSelectionChangedEventArgs = Fayde.Time.CalendarSelectionChangedEventArgs;
    
    export class SelectedDatesCollection<object> extends ObservableCollection<any>{
        
        private _addedItems: ObservableCollection<DateTime>;
        private _removedItems:  ObservableCollection<DateTime> ;
        //private Thread _dispatcherThread;
        private _isAddingRange: boolean =false;
        private _owner: Calendar;
        private _maximumDate: DateTime;
        private _minimumDate: DateTime;
        
		constructor(calendar: Calendar) {
            super();
            this._owner = calendar;
            this._addedItems = new ObservableCollection<DateTime>();
            this._removedItems = new ObservableCollection<DateTime>();
        }
        
        get MinimumDate(): DateTime
        {
            if (this.Count < 1)
                {
                    return null;
                }

                if (!this._minimumDate)
                {
                    var result = this[0];
                    for(var i = 0;i < this.Count;i++)
                    {
                        var selectedDate = this[i];
                        if (DateTime.Compare(selectedDate, result) < 0)
                        {
                            result = selectedDate;
                        }
                    }
                    this._maximumDate = result;
                }

                return this._minimumDate;
        }

        get MaximumDate(): DateTime
        {
            if (this.Count < 1)
                {
                    return null;
                }

                if (!this._maximumDate)
                {
                    var result = this[0];
                    for(var i = 0;i < this.Count;i++)
                    {
                        var selectedDate = this[i];
                        if (DateTime.Compare(selectedDate, result) > 0)
                        {
                            result = selectedDate;
                        }
                    }

                    this._maximumDate = result;
                }

                return this._maximumDate;
        }
        
        public ClearInternal(fireChangeNotification: boolean): void
        {
            if (this.Count > 0)
            {
                for(var i = 0;i < this.Count;i++)
                {
                    var item = this.GetValueAt(i);
                    
                    this._removedItems.Add(item);
                    
                }

                //TODO THIS SHOULD BE
                //base.ClearItems();
                this.Clear();
                this.ClearMinMax();

                if (fireChangeNotification)
                {
                    if (this._owner.SelectedDate != null)
                    {
                        this._owner.SelectedDate = null;
                    }

                    if (this._removedItems.Count > 0)
                    {
                        //TODO var addedItems = new Collection<DateTime>();
                        //TODO RaiseSelectionChanged(_removedItems, addedItems);
                        this._removedItems.Clear();
                    }

                    this._owner.UpdateCellItems();
                }
            }
        }
        
        private ClearMinMax(): void
        {
            this._maximumDate = null;
            this._minimumDate = null;
        }
        
        public Toggle(date: DateTime):void
        {
            if (Calendar.IsValidDateSelection(this._owner, date))
            {
                switch (this._owner.SelectionMode)
                {
                    case CalendarSelectionMode.SingleDate:
                    {
                        if (!this._owner.SelectedDate || DateTimeHelper.CompareDays(this._owner.SelectedDate, date) != 0)
                        {
                            this._owner.SelectedDate = date;
                        }
                        else 
                        {
                            this._owner.SelectedDate = null;
                        }

                        break;
                    }

                    case CalendarSelectionMode.MultipleRange:
                    {
                        if (!this.Remove(date))
                        {
                            this.Add(date);
                        }

                        break;
                    }

                    default: 
                    {
                        break;
                    }
                }
            }
        }
        
        public AddRangeInternal(start: DateTime,end: DateTime): void
        {
            this.BeginAddRange();

            // In Mouse Selection we allow the user to be able to add multiple ranges in one action in MultipleRange Mode
            // In SingleRange Mode, we only add the first selected range
            var lastAddedDate = start;
            var dates = SelectedDatesCollection.GetDaysInRange(start, end);
            for(var i = 0;i <dates.Count;i++)
            {
                var current = dates.GetValueAt(i);
                
                if (this.IsValidDateSelection(this._owner, current))
                {
                    this.Add(current);
                    lastAddedDate = current;
                }
                else
                {
                    if (this._owner.SelectionMode == CalendarSelectionMode.SingleRange)
                    {
                        this._owner.CurrentDate = lastAddedDate;
                        break;
                    }
                }
                
            }

            this.EndAddRange();
        }
        
        private IsValidDateSelection(cal:Calendar,value: any ): boolean
        {
            return (value == null) || (!cal.BlackoutDates.Contains(value));
        }
        
        private static GetDirection(start: DateTime,end: DateTime): number
        {
            return (DateTime.Compare(end, start) >= 0) ? 1 : -1;
        }
        
        private static GetDaysInRange(start: DateTime, end: DateTime):ObservableCollection<DateTime>
        {
            var result = new ObservableCollection<DateTime>();
            
            // increment parameter specifies if the Days were selected in Descending order or Ascending order
            // based on this value, we add the days in the range either in Ascending order or in Descending order
            var increment = this.GetDirection(start, end);

            var rangeStart = start;

            do
            {
                //yield return rangeStart.Value;
                result.Add(rangeStart);
                rangeStart = DateTimeHelper.AddDays(rangeStart, increment);
            }
            while (rangeStart && DateTime.Compare(end, rangeStart) != -increment);
            
            return result;
        }
        
        private BeginAddRange(): void
        {
            this._isAddingRange = true;
        }

        private EndAddRange(): void
        {
            this._isAddingRange = false;
            this.RaiseSelectionChanged(this._removedItems, this._addedItems);
            this._removedItems.Clear();
            this._addedItems.Clear();
            this._owner.UpdateCellItems();
        }
        
        public InsertItem(index: number,item: DateTime): void
        {

            if (!this.Contains(item))
            {
                var addedItems = new ObservableCollection<DateTime>();

                var isCleared = this.CheckSelectionMode();

                if (this.IsValidDateSelection(this._owner, item))
                {
                    // If the Collection is cleared since it is SingleRange and it had another range
                    // set the index to 0
                    if (isCleared)
                    {
                        index = 0;
                        isCleared = false;
                    }
                    ////INSERT AGAIN
                    
                    this.Add(item);
                    //////////////
                    //base.InsertItem(item);
                    this.UpdateMinMax(item);

                    // The event fires after SelectedDate changes
                    if (index == 0 && !(this._owner.SelectedDate && DateTime.Compare(this._owner.SelectedDate, item) == 0))
                    {
                        this._owner.SelectedDate = item;
                    }

                    if (!this._isAddingRange)
                    {
                        addedItems.Add(item);

                        this.RaiseSelectionChanged(this._removedItems, addedItems);
                        this._removedItems.Clear();
                        var monthDifference = DateTimeHelper.CompareYearMonth(item, this._owner.DisplayDateInternal);

                        if (monthDifference < 2 && monthDifference > -2)
                        {
                            this._owner.UpdateCellItems();
                        }
                    }
                    else
                    {
                        this._addedItems.Add(item);
                    }
                }
                else
                {
                    throw new Exception("");
                }
            }
        }
        
        private UpdateMinMax(date: DateTime): void
        {
            if ((!this._maximumDate) || (date > this._maximumDate))
            {
                this._maximumDate = date;
            }

            if ((!this._minimumDate) || (date < this._minimumDate))
            {
                this._minimumDate = date;
            }
        }
        
        private CheckSelectionMode(): boolean
        {
            if (this._owner.SelectionMode == CalendarSelectionMode.None)
            {
                throw new Exception("");
            }

            if (this._owner.SelectionMode == CalendarSelectionMode.SingleDate && this.Count > 0)
            {
                throw new Exception("");
            }

            // if user tries to add an item into the SelectedDates in SingleRange mode, we throw away the old range and replace it with the new one
            // in order to provide the removed items without an additional event, we are calling ClearInternal
            if (this._owner.SelectionMode == CalendarSelectionMode.SingleRange && !this._isAddingRange && this.Count > 0)
            {
                this.ClearInternal(false);
                return true;
            }
            else
            {
                return false;
            }
        }
        
        private RaiseSelectionChanged(removedItems: ObservableCollection<DateTime>,addedItems: ObservableCollection<DateTime>):void
        {
            var args = new CalendarSelectionChangedEventArgs(this,removedItems, addedItems);
            this._owner.OnSelectedDatesCollectionChanged(args);
        }

	}
}
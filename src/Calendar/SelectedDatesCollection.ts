module Fayde.Time{
    import Calendar = Time.Calendar;
    import ObservableCollection =  Fayde.Collections.ObservableCollection;
    
    export class SelectedDatesCollection<DateTime> extends ObservableCollection<any>{
        
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

	}
}
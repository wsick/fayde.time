module Fayde.Time {
    import ObservableCollection = Fayde.Collections.ObservableCollection;
	export class CalendarSelectionChangedEventArgs extends Fayde.Controls.Primitives.SelectionChangedEventArgs {
        get AddedItems(): ObservableCollection<DateTime>{
            var result = new ObservableCollection<DateTime>();
            if(this.NewValues)
            {
                for(var i = 0;i<this.NewValues.length;i++)
                {
                    result.Add(this.NewValues[i]);
                }
            }
            return result;
        }
        get RemovedItems(): ObservableCollection<DateTime>{
            var result = new ObservableCollection<DateTime>();
            if(this.OldValues)
            {
                for(var i = 0;i<this.OldValues.length;i++)
                {
                    result.Add(this.OldValues[i]);
                }
            }
            return result;
        }
        constructor(id: any,removedItems: ObservableCollection<DateTime>, addedItems: ObservableCollection<DateTime>){
            
            super(removedItems.ToArray(),addedItems.ToArray());

            //Object.defineProperty(this, "OldValues", { value: removedItems.slice(0), writable: false });
            //Object.defineProperty(this, "NewValues", { value: addedItems.slice(0), writable: false });
        }
    }
}
module Fayde.Time {
	export class CalendarSelectionChangedEventArgs extends Fayde.Controls.Primitives.SelectionChangedEventArgs {
        get AddedItems(): any[]{return this.NewValues;}
        get RemovedItems(): any[]{return this.OldValues;}
        constructor(id: any,removedItems: any[], addedItems: any[]) {
            super(removedItems,addedItems);
            //Object.defineProperty(this, "OldValues", { value: removedItems.slice(0), writable: false });
            //Object.defineProperty(this, "NewValues", { value: addedItems.slice(0), writable: false });
        }
    }
}
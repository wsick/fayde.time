module Fayde.Time {
	export class CalendarButton extends Controls.Button	{
		
		static HasSelectedDaysProperty = DependencyProperty.Register("HasSelectedDays", () => Boolean, CalendarButton, false, (d, args) => (<CalendarButton>d).OnVisualStatePropertyChanged(d,args));
		static IsInactiveProperty = DependencyProperty.Register("IsInactive", () => Boolean, CalendarButton, false, (d, args) => (<CalendarButton>d).OnVisualStatePropertyChanged(d,args));
		HasSelectedDays: boolean;
		IsInactive: boolean;
		
		Owner: Calendar;
		
		private _shouldCoerceContent: boolean;
		private _coercedContent: any;
		
		constructor() {
            super();
            this.DefaultStyleKey = CalendarButton;
            this.Loaded.on(this.OnLoaded,this);
        }
        
        OnLoaded(sender:CalendarButton,e:RoutedEventArgs) :void {
            this.UpdateVisualState();
        }
		
		OnApplyTemplate() {
            super.OnApplyTemplate();
            this.UpdateVisualState();
    	}

		
		private OnVisualStatePropertyChanged(obj: any,e: IDependencyPropertyChangedEventArgs) {
			
			var button = <CalendarButton>obj;
            if (button != null && !e.OldValue ===e.NewValue)
            {
                button.UpdateVisualState(true);
            }

        }
        
        GoToStates (gotoFunc: (state: string) => boolean) { 
             super.GoToStates(gotoFunc); 
             this.GoToStateSelection(gotoFunc); 
             this.GoToStateActive(gotoFunc);
             this.GotoStateFocus(gotoFunc);
        } 
         
        GoToStateSelection (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.HasSelectedDays)
                return gotoFunc("Selected");

             return gotoFunc("Unselected");
        }
         
        GoToStateActive (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.IsInactive)
                return gotoFunc("Inactive");

             return gotoFunc("Active");
        }
        
        GotoStateFocus (gotoFunc: (state: string) => boolean): boolean { 
             //TODO if(this.IsKeyboadFocused)
             if(this.IsFocused)
                return gotoFunc("ButtonFocused");

             return gotoFunc("ButtonUnfocused");
        }

		
	}
}
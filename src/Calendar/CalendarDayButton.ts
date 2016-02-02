module Fayde.Time {
	
	export class CalendarDayButton extends Controls.Button	{
		static IsInactiveProperty = DependencyProperty.Register("IsInactive", () => Boolean, CalendarDayButton, false, (d, args) => (<CalendarDayButton>d).OnVisualStatePropertyChanged(d,args));
		static IsTodayProperty = DependencyProperty.Register("IsToday", () => Boolean, CalendarDayButton, false, (d, args) => (<CalendarDayButton>d).OnVisualStatePropertyChanged(d,args));
        static IsSelectedProperty = DependencyProperty.Register("IsSelected", () => Boolean, CalendarDayButton, false, (d, args) => (<CalendarDayButton>d).OnVisualStatePropertyChanged(d,args));
        static IsBlackedOutProperty = DependencyProperty.Register("IsBlackedOut", () => Boolean, CalendarDayButton, false, (d, args) => (<CalendarDayButton>d).OnVisualStatePropertyChanged(d,args));
		static IsHighlightedProperty = DependencyProperty.Register("IsHighlighted", () => Boolean, CalendarDayButton, false, (d, args) => (<CalendarDayButton>d).OnVisualStatePropertyChanged(d,args));
        public IsInactive: Boolean;
        public IsToday: Boolean;
		public IsSelected: Boolean;
        public IsBlackedOut: Boolean;
        public IsHighlighted: Boolean;
		public Owner: Calendar;
		
		// START CONSTANTS
		///Default content for the CalendarDayButton
		private get DEFAULTCONTENT(): number{
			return 1;
		}
		
		//Identifies the Today state.
		private get StateToday(): string{
			return "Today";
		}
		
		//Identifies the RegularDay state.
		private get StateRegularDay(): string{
			return "RegularDay";
		}
		
		//Identifies the GroupDay state.
		private get GroupDay(): string{
			return "DayStates";
		}
		
		//Identifies the RegularDay state.
		private get StateBlackoutDay(): string{
			return "BlackoutDay";
		}
		
		//Identifies the RegularDay state.
		private get StateNormalDay(): string{
			return "NormalDay";
		}
		
		//Identifies the RegularDay state.
		private get GroupBlackout(): string{
			return "BlackoutDayStates";
		}
		// END CONSTANTS
		
		// DATA START
		private _shouldCoerceContent: boolean;
		private _coercedContent: any;
		// DATA ENDS
		
		constructor() {
            super();
            this.DefaultStyleKey = CalendarDayButton;
            this.MouseEnter.on(this.OnMouseEnter,this);
            this.MouseLeave.on(this.OnMouseLeave,this);
        }
        
        private isMouseOver: boolean;
        OnMouseEnter(e:Input.MouseEventArgs) :void {
            this.isMouseOver = true;
            this.UpdateVisualState();
        }
        OnMouseLeave(e:Input.MouseEventArgs) :void {
            this.isMouseOver = false;
            this.UpdateVisualState();
        }
		
		//TODO PENDING AUTOMATATION PEER
		
		
		//PRIVATE METHODS START
		
		private OnVisualStatePropertyChanged(sender: any,args: IDependencyPropertyChangedEventArgs) {
            var dayButton = <CalendarDayButton>sender;
            if (dayButton)
            {
                dayButton.UpdateVisualState(true);
            }
        }
		
		private static OnCoerceContent(sender: DependencyObject,baseValue: any): any
        {
            var button = <CalendarDayButton>sender;
            if (button._shouldCoerceContent)
            {
                button._shouldCoerceContent = false;
                return button._coercedContent;
            }

            return baseValue;
        }
		
		//PRIVATE METHODS END
		
		SetContentInternal(value: string): void
        {
			this.Content = value;
			//TODO SHOULD BE LIKE THIS
			/*
            if (BindingOperations.GetBindingExpressionBase(this, ContentControl.ContentProperty) != null)
            {
                Content = value;
            }
            else
            {
                this._shouldCoerceContent = true;
                this._coercedContent = value;
                this.CoerceValue(ContentControl.ContentProperty);
            }
			*/
        }
		
		 GoToStates (gotoFunc: (state: string) => boolean) { 
             super.GoToStates(gotoFunc); 
             this.GoToStateSelection(gotoFunc); 
             this.GoToStateDay(gotoFunc);
             this.GoToStateActive(gotoFunc);
             this.GoToStateBlackoutDay(gotoFunc);
         } 
 
         GoToStateCommon (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.isMouseOver)
             {
                 return gotoFunc("MouseOver"); 
             }
             
             
             if (!this.IsEnabled) 
                 return gotoFunc("Disabled"); 

             return gotoFunc("Normal"); 
         } 
 
 
         GoToStateSelection (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.IsSelected || this.IsHighlighted)
                return gotoFunc("Selected");

             return gotoFunc("Unselected");
         } 
 
 
         GoToStateDay (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.IsToday && this.Owner != null && this.Owner.IsTodayHighlighted)
                 return gotoFunc("Today");
                 
             return gotoFunc("RegularDay");
             
         } 
         
         GoToStateActive (gotoFunc: (state: string) => boolean): boolean { 
             
             if(!this.IsInactive)
                return gotoFunc("Inactive");

             return gotoFunc("Active");           
         } 
         
         GoToStateBlackoutDay (gotoFunc: (state: string) => boolean): boolean { 
             
             if(this.IsBlackedOut)
                return gotoFunc("BlackoutDay");

             return gotoFunc("NormalDay");           
         } 

		
	}
	Fayde.Controls.TemplateVisualStates(CalendarDayButton,
    { GroupName: "CommonStates", Name: "Normal" },
    { GroupName: "CommonStates", Name: "MouseOver" },
    { GroupName: "CommonStates", Name: "Pressed" },
    { GroupName: "CommonStates", Name: "Disabled" },
	{ GroupName: "SelectionStates", Name: "Unselected" },
    { GroupName: "SelectionStates", Name: "Selected" },
    { GroupName: "FocusStates", Name: "Unfocused" },
    { GroupName: "FocusStates", Name: "Focused" },
    { GroupName: "ActiveStates", Name: "Inactive" },
    { GroupName: "ActiveStates", Name: "Active" },
    { GroupName: "DayStates", Name: "RegularDay" },
    { GroupName: "DayStates", Name: "Today" },
	{ GroupName: "BlackoutDayStates", Name: "NormalDay" },
    { GroupName: "BlackoutDayStates", Name: "BlackoutDay" });
}
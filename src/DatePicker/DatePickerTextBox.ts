module Fayde.Time {
    import ContentControl = Fayde.Controls.ContentControl;
    import Control = Fayde.Controls.Control;
    export class DatePickerTextBox extends Controls.TextBox {
        // CONSTANTS
        public static get ElementContentName():string {return "PART_Watermark";}
        
        // DATA
        private elementContent: ContentControl;
        private isHovered: boolean;
        
        static WatermarkProperty = DependencyProperty.Register("Watermark", () => Object, DatePickerTextBox, undefined, (d, args) => (<DatePickerTextBox>d).OnWatermarkPropertyChanged(args));
        Watermark: any;
        
        private OnWatermarkPropertyChanged(args: IDependencyPropertyChangedEventArgs) {
            this.OnWatermarkChanged();
            this.UpdateVisualState();
        }
        
        constructor() {
            super();
            this.DefaultStyleKey = DatePickerTextBox;
            this.Loaded.on(this.OnLoaded,this);
            this.GotFocus.on(this.OnGotFocus,this);
            this.LostFocus.on(this.OnLostFocus,this);
            this.MouseEnter.on(this.OnMouseEnter,this);
            this.MouseLeave.on(this.OnMouseLeave,this);
            this.TextChanged.on(this.OnTextChanged,this);
        }
        
        OnLoaded(sender:DatePickerTextBox,e:RoutedEventArgs) :void {
            this.UpdateVisualState();
        }
        
        OnGotFocus(e:RoutedEventArgs) :void {
            if (this.IsEnabled){
                if (this.Text)
                {
                    this.Select(0, this.Text.length);
                }

                this.UpdateVisualState();
            }
        }
        
        OnLostFocus(e:RoutedEventArgs) :void {
            this.UpdateVisualState();
        }
        
        OnMouseEnter(e:RoutedEventArgs) :void {
            
            this.isHovered = true;
            if (!this.IsFocused){
                this.UpdateVisualState();
            }
        }
        
        OnMouseLeave(e:RoutedEventArgs) :void {
            this.isHovered = false;
            if (!this.IsFocused){
                this.UpdateVisualState();
            }
        }
        
        OnTextChanged(e:RoutedEventArgs) :void {
            this.UpdateVisualState();
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            this.elementContent = <ContentControl>this.GetTemplateChild(DatePickerTextBox.ElementContentName);
            this.OnWatermarkChanged();
            this.UpdateVisualState();
        }
        
        GoToStates (gotoFunc: (state: string) => boolean) { 
             super.GoToStates(gotoFunc);
             this.GoToStateFocused(gotoFunc);
             this.GoToStateFocused(gotoFunc);
        }
        
        GoToStateCommon (gotoFunc: (state: string) => boolean): boolean { 
             
             if (!this.IsEnabled) {
                 return gotoFunc("Disabled"); 
             }
             else if(this.isHovered){
                 return gotoFunc("MouseOver"); 
             }
             else{
                 return gotoFunc("Normal"); 
             }
                 
        }
        
        GoToStateFocused (gotoFunc: (state: string) => boolean): boolean { 
             if(this.IsFocused && this.IsEnabled){
                 return gotoFunc("Focused"); 
             }else {
                 return gotoFunc("UnFocused"); 
             }
                 
        }
        
        GoToStateWatermarked (gotoFunc: (state: string) => boolean): boolean { 
             if (this.Watermark != null && !this.Text){
                return gotoFunc("Watermarked"); 
             }else {
                return gotoFunc("Unwatermarked"); 
            }                 
        } 
        
        private OnWatermarkChanged(): void {
            if (this.elementContent != null)
            {
                var watermarkControl = <Control>this.Watermark;
                if (watermarkControl != null)
                {
                    watermarkControl.IsTabStop = false;
                    watermarkControl.IsHitTestVisible = false;
                }
            }
        }
        
    }
    Fayde.Controls.TemplateVisualStates(DatePickerTextBox,
    { GroupName: "CommonStates", Name: "Normal" },
    { GroupName: "CommonStates", Name: "MouseOver" },
    { GroupName: "CommonStates", Name: "Disabled" },
	{ GroupName: "SelectionStates", Name: "Unselected" },
    { GroupName: "SelectionStates", Name: "Selected" },
    { GroupName: "FocusStates", Name: "Unfocused" },
    { GroupName: "FocusStates", Name: "Focused" },
	{ GroupName: "WatermarkStates", Name: "Unwatermarked" },
    { GroupName: "WatermarkStates", Name: "Watermarked" });
}
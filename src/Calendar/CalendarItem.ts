/// <reference path="DateTimeHelper" />
module Fayde.Time {
	
	import Control = Fayde.Controls.Control;
	import GregorianCalendar = Fayde.Localization.GregorianCalendar;
	import Grid = Fayde.Controls.Grid;
	import Button = Fayde.Controls.Button;
	import DataTemplate = Fayde.DataTemplate;
	import FrameworkElement = Fayde.FrameworkElement;
    import TemplateParts = Controls.TemplateParts;
    import TemplateVisualStates = Controls.TemplateVisualStates;
    import DateTimeHelper = Time.DateTimeHelper;
    import Calendar = Time.Calendar;
    import CalendarButton = Time.CalendarButton;
    import CalendarDayButton = Time.CalendarDayButton;
    import CalendarMode = Time.CalendarMode;
    import CultureInfo = Fayde.Localization.CultureInfo;
	
	export class CalendarItem extends Control {
		//CONSTANTS
        public static get ElementRoot():string {return "PART_Root";}
        public static get ElementHeaderButton(): string { return "PART_HeaderButton";}
        public static get ElementPreviousButton(): string {return "PART_PreviousButton";}
        public static get ElementNextButton():string { return "PART_NextButton";}
        public static get ElementDayTitleTemplate(): string { return "DayTitleTemplate";}
        public static get ElementMonthView(): string { return "PART_MonthView";}
        public static get ElementYearView(): string { return "PART_YearView";}
        public static get ElementDisabledVisual(): string { return "PART_DisabledVisual";}
		
		private get COLS() : number { return 7;}
		private get ROWS() : number { return 7;}
		private get YEAR_COLS() : number { return 4;}
		private get YEAR_ROWS() : number { return 3;}
		private get NUMBER_OF_DAYS_IN_WEEK() : number { return 7;}
		
		private _calendar : GregorianCalendar = new GregorianCalendar();
		private _dayTitleTemplate : DataTemplate;
        private _disabledVisual : FrameworkElement;
        private _headerButton : Button;
        private _monthView : Grid;
        private _nextButton : Button;
        private _previousButton : Button;
        private _yearView : Grid;
        private _isMonthPressed : boolean;
        private _isDayPressed : boolean;
        
        private get DisplayMode(): CalendarMode 
        {
            return (this.Owner != null) ? this.Owner.DisplayMode : CalendarMode.Month;
        }
        
        private get HeaderButton(): Button
        {
            return this._headerButton;
        }

        private get NextButton(): Button
        {
            return this._nextButton;
        }

        private get PreviousButton(): Button
        {
            return this._previousButton;
        }

        private get DisplayDate(): DateTime
        {
            return (this.Owner != null) ? this.Owner.DisplayDate : DateTime.Today;
        }
		
		constructor() {
            super();
            this.DefaultStyleKey = CalendarItem;
        }
        
        OnApplyTemplate() {
            super.OnApplyTemplate();
            //TODO
            /*
            if (this._previousButton != null)
            {
                this._previousButton.Click -= new RoutedEventHandler(PreviousButton_Click);
            }

            if (this._nextButton != null)
            {
                this._nextButton.Click -= new RoutedEventHandler(NextButton_Click);
            }

            if (this._headerButton != null)
            {
                this._headerButton.Click -= new RoutedEventHandler(HeaderButton_Click);
            }
            */

            this._monthView = <Grid>this.GetTemplateChild(CalendarItem.ElementMonthView);
            this._yearView = <Grid>this.GetTemplateChild(CalendarItem.ElementYearView);
            this._previousButton = <Button>this.GetTemplateChild(CalendarItem.ElementPreviousButton);
            this._nextButton = <Button>this.GetTemplateChild(CalendarItem.ElementNextButton);
            this._headerButton = <Button>this.GetTemplateChild(CalendarItem.ElementHeaderButton);
            this._disabledVisual = <FrameworkElement>this.GetTemplateChild(CalendarItem.ElementDisabledVisual);

            //TODO
            
            /*
            // WPF Compat: Unlike SL, WPF is not able to get elements in template resources with GetTemplateChild()
            this._dayTitleTemplate = null;
            if (this.Template != null && Template.Resources.Contains(ElementDayTitleTemplate))
            {
                this._dayTitleTemplate = Template.Resources[ElementDayTitleTemplate] as DataTemplate;
            }
            
            if (this._previousButton != null)
            {
                // If the user does not provide a Content value in template, we provide a helper text that can be used in Accessibility
                // this text is not shown on the UI, just used for Accessibility purposes
                if (this._previousButton.Content == null)
                {
                    this._previousButton.Content = SR.Get(SRID.Calendar_PreviousButtonName);
                }

                this._previousButton.Click += new RoutedEventHandler(PreviousButton_Click);
            }

            if (this._nextButton != null)
            {
                // If the user does not provide a Content value in template, we provide a helper text that can be used in Accessibility
                // this text is not shown on the UI, just used for Accessibility purposes
                if (this._nextButton.Content == null)
                {
                    this._nextButton.Content = SR.Get(SRID.Calendar_NextButtonName);
                }

                this._nextButton.Click += new RoutedEventHandler(NextButton_Click);
            }

            if (this._headerButton != null)
            {
                this._headerButton.Click += new RoutedEventHandler(HeaderButton_Click);
            }
            */
            this.PopulateGrids();

            if (this.Owner != null)
            {
                //TODO
                /*
                switch (this.Owner.DisplayMode)
                {
                    case CalendarMode.Year: 
                        this.UpdateYearMode(); 
                        break;
                    case CalendarMode.Decade: 
                        this.UpdateDecadeMode(); 
                        break;
                    case CalendarMode.Month: 
                        this.UpdateMonthMode(); 
                        break;

                    default: 
                        break;
                }
                */
            }
            else
            {
                this.UpdateMonthMode();
            }

        }
        
        Owner: Calendar;
        
        //PRIVATE METHODS
        private GetDecadeForDecadeMode(selectedYear:DateTime):number{
            var decade = DateTimeHelper.DecadeOfDate(selectedYear);

            // Adjust the decade value if the mouse move selection is on,
            // such that if first or last year among the children are selected
            // then return the current selected decade as is.
            if (this._isMonthPressed && this._yearView != null)
            {
                var yearViewChildren = this._yearView.Children;
                var count = yearViewChildren.Count;

                if (count > 0)
                {
                    var child = <CalendarButton>yearViewChildren[0];
                    if (child && <DateTime>child.DataContext && (<DateTime>child.DataContext).Year == selectedYear.Year)
                    {
                        return (decade + 10);
                    }
                }

                if (count > 1)
                {
                    var child = <CalendarButton>yearViewChildren[count - 1];
                    if (child && <DateTime>child.DataContext && (<DateTime>child.DataContext).Year == selectedYear.Year)
                    {
                        return (decade - 10);
                    }
                }
            }
            return decade;
        }
        
        private PopulateGrids(): void
        {
            if (this._monthView != null)
            {
                if (this._dayTitleTemplate != null)
                {
                    for (var i = 0; i < this.COLS; i++)
                    {
                        //TODO UNCOMMENT THIS
                        /*
                        var titleCell = <FrameworkElement>this._dayTitleTemplate.LoadContent();
                        titleCell.SetValue(Grid.RowProperty, 0);
                        titleCell.SetValue(Grid.ColumnProperty, i);
                        this._monthView.Children.Add(titleCell);
                        */
                    }
                }

                for (var i = 0; i < this.ROWS; i++)
                {
                    for (var j = 0; j < this.COLS; j++)
                    {
                        var dayCell = new CalendarDayButton();

                        dayCell.Owner = this.Owner;
                        dayCell.SetValue(Grid.RowProperty, i);
                        dayCell.SetValue(Grid.ColumnProperty, j);
                        //TODO ALL THESE LINES
                        //dayCell.SetBinding(CalendarDayButton.StyleProperty, this.GetOwnerBinding("CalendarDayButtonStyle"));
                        //dayCell.AddHandler(CalendarDayButton.MouseLeftButtonDownEvent, new MouseButtonEventHandler(Cell_MouseLeftButtonDown), true);
                        //dayCell.AddHandler(CalendarDayButton.MouseLeftButtonUpEvent, new MouseButtonEventHandler(Cell_MouseLeftButtonUp), true);
                        //dayCell.AddHandler(CalendarDayButton.MouseEnterEvent, new MouseEventHandler(Cell_MouseEnter), true);
                        //dayCell.Click += new RoutedEventHandler(Cell_Clicked);
                        //dayCell.AddHandler(PreviewKeyDownEvent, new RoutedEventHandler(CellOrMonth_PreviewKeyDown), true);

                        this._monthView.Children.Add(dayCell);
                    }
                }
            }

            if (this._yearView != null)
            {
                var monthCell: CalendarButton;
                var count: number = 0;
                for (var i = 0; i < this.YEAR_ROWS; i++)
                {
                    for (var j = 0; j < this.YEAR_COLS; j++)
                    {
                        monthCell = new CalendarButton();

                        monthCell.Owner = this.Owner;
                        monthCell.SetValue(Grid.RowProperty, i);
                        monthCell.SetValue(Grid.ColumnProperty, j);
                        //TODO ALL THESE LINES
                        //monthCell.SetBinding(CalendarButton.StyleProperty, GetOwnerBinding("CalendarButtonStyle"));
                        //monthCell.AddHandler(CalendarButton.MouseLeftButtonDownEvent, new MouseButtonEventHandler(Month_MouseLeftButtonDown), true);
                        //monthCell.AddHandler(CalendarButton.MouseLeftButtonUpEvent, new MouseButtonEventHandler(Month_MouseLeftButtonUp), true);
                        //monthCell.AddHandler(CalendarButton.MouseEnterEvent, new MouseEventHandler(Month_MouseEnter), true);
                        //monthCell.AddHandler(UIElement.PreviewKeyDownEvent, new RoutedEventHandler(CellOrMonth_PreviewKeyDown), true);
                        //monthCell.Click += new RoutedEventHandler(Month_Clicked);
                        this._yearView.Children.Add(monthCell);
                        count++;
                    }
                }
            }
        }
        /*
        private GetOwnerBinding(propertyName: string): BindingBase
        {
            Binding result = new Binding(propertyName);
            result.Source = this.Owner;
            return result;
        }
        */
		
        
        //INTERNAL METHODS
        public UpdateMonthMode(): void
        {
            this.SetMonthModeHeaderButton();
            this.SetMonthModePreviousButton();
            this.SetMonthModeNextButton();

            if (this._monthView != null)
            {
                this.SetMonthModeDayTitles();
                this.SetMonthModeCalendarDayButtons();
                this.AddMonthModeHighlight();
            }
        }
        
        private SetMonthModeHeaderButton(): void
        {
            if (this._headerButton != null)
            {
                this._headerButton.Content = DateTimeHelper.ToYearMonthPatternString(this.DisplayDate, DateTimeHelper.GetCulture(this));

                if (this.Owner != null)
                {                    
                    this._headerButton.IsEnabled = true;
                }
            }
        }
        
        private SetMonthModeDayTitles(): void
        {
            if (this._monthView != null)
            {
                var shortestDayNames = DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)).ShortestDayNames;

                for (var childIndex = 0; childIndex < this.COLS; childIndex++)
                {
                    var daytitle = this._monthView.Children[childIndex] as FrameworkElement;
                    
                    if (daytitle != null && shortestDayNames != null && shortestDayNames.length > 0)
                    {
                        if (this.Owner != null)
                        {
                            daytitle.DataContext = shortestDayNames[(childIndex + <number>this.Owner.FirstDayOfWeek) % shortestDayNames.length];
                        }
                        else
                        {
                            daytitle.DataContext = shortestDayNames[(childIndex + <number>DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)).FirstDayOfWeek) % shortestDayNames.length];
                        }
                    }
                }
            }
        }
        
        private GetNumberOfDisplayedDaysFromPreviousMonth(firstOfMonth: DateTime): number
        {
            var day = this._calendar.GetDayOfWeek(firstOfMonth);
            var i;

            if (this.Owner != null)
            {
                i = ((day - this.Owner.FirstDayOfWeek + this.NUMBER_OF_DAYS_IN_WEEK) % this.NUMBER_OF_DAYS_IN_WEEK);
            }
            else
            {
                i = ((day - DateTimeHelper.GetDateFormat(DateTimeHelper.GetCulture(this)).FirstDayOfWeek + this.NUMBER_OF_DAYS_IN_WEEK) % this.NUMBER_OF_DAYS_IN_WEEK);
            }

            if (i == 0)
            {
                return this.NUMBER_OF_DAYS_IN_WEEK;
            }
            else
            {
                return i;
            }
        }

        private SetMonthModeCalendarDayButtons(): void
        {
            var firstDayOfMonth = DateTimeHelper.DiscardDayTime(this.DisplayDate);
            var lastMonthToDisplay = this.GetNumberOfDisplayedDaysFromPreviousMonth(firstDayOfMonth);

            var isMinMonth = DateTimeHelper.CompareYearMonth(firstDayOfMonth, DateTime.MinValue) <= 0;
            var isMaxMonth = DateTimeHelper.CompareYearMonth(firstDayOfMonth, DateTime.MaxValue) >= 0;
            var daysInMonth = this._calendar.GetDaysInMonth(firstDayOfMonth.Year, firstDayOfMonth.Month,0);
            var culture = <CultureInfo>DateTimeHelper.GetCulture(this);

            var count = this.ROWS * this.COLS;
            for (var childIndex = this.COLS; childIndex < count; childIndex++)
            {
                var childButton = <CalendarDayButton>this._monthView.Children.GetValueAt(childIndex);
                var dayOffset = childIndex - lastMonthToDisplay - this.COLS;
                if ((!isMinMonth || (dayOffset >= 0)) && (!isMaxMonth || (dayOffset < daysInMonth)))
                {
                    var dateToAdd = firstDayOfMonth.AddDays(dayOffset);
                    this.SetMonthModeDayButtonState(childButton, dateToAdd);
                    childButton.DataContext = dateToAdd;
                    childButton.SetContentInternal(DateTimeHelper.ToDayString(dateToAdd, culture));
                }
                else
                {
                    this.SetMonthModeDayButtonState(childButton, null);
                    childButton.DataContext = null;
                    childButton.SetContentInternal(DateTimeHelper.ToDayString(null, culture));
                }
            }
        }
        
        private SetMonthModeDayButtonState(childButton: CalendarDayButton,dateToAdd: DateTime): void
        {
            if (this.Owner != null)
            {
                if (dateToAdd)
                {
                    childButton.Visibility = Visibility.Visible;

                    // If the day is outside the DisplayDateStart/End boundary, do not show it
                    if (DateTimeHelper.CompareDays(dateToAdd, this.Owner.DisplayDateStartInternal) < 0 || DateTimeHelper.CompareDays(dateToAdd, this.Owner.DisplayDateEndInternal) > 0)
                    {
                        childButton.IsEnabled = false;
                        childButton.Visibility = Visibility.Collapsed;
                    }
                    else
                    {
                        childButton.IsEnabled = true;

                        // SET IF THE DAY IS SELECTABLE OR NOT
                        childButton.SetValue(
                            CalendarDayButton.IsBlackedOutProperty, 
                            this.Owner.BlackoutDates.Contains(dateToAdd));

                        // SET IF THE DAY IS ACTIVE OR NOT: set if the day is a trailing day or not
                        childButton.SetValue(
                            CalendarDayButton.IsInactiveProperty, 
                            DateTimeHelper.CompareYearMonth(dateToAdd, this.Owner.DisplayDateInternal) != 0);

                        // SET IF THE DAY IS TODAY OR NOT
                        if (DateTimeHelper.CompareDays(dateToAdd, DateTime.Today) == 0)
                        {
                            childButton.SetValue(CalendarDayButton.IsTodayProperty, true);
                            
                            // Calendar.IsTodayHighlighted affects the final visual state for Today buttons 
                            // but childButton property change callbacks are no called in response to 
                            // Calendar.IsTodayHighlighted changing so we must explicitly update the visual state
                            childButton.UpdateVisualState(true);
                        }
                        else
                        {
                            childButton.SetValue(CalendarDayButton.IsTodayProperty, false);
                        }

                        // SET IF THE DAY IS SELECTED OR NOT
                        // Since we should be comparing the Date values not DateTime values, we can't use this.Owner.SelectedDates.Contains(dateToAdd) directly
                        var isSelected = false;
                        for(var i;i < this.Owner.SelectedDates.Count; i++)
                        {
                            var item = <DateTime>this.Owner.SelectedDates[i];
                            isSelected = (DateTimeHelper.CompareDays(dateToAdd, item) == 0);  
                        }
                        /*
                        foreach (DateTime item in this.Owner.SelectedDates)
                        {
                             isSelected |= (DateTimeHelper.CompareDays(dateToAdd.Value, item) == 0);       
                        }
                        */
                        childButton.SetValue(CalendarDayButton.IsSelectedProperty, isSelected);
                    }
                }
                else
                {
                    childButton.Visibility = Visibility.Collapsed;
                    childButton.IsEnabled = false;
                    childButton.SetValue(CalendarDayButton.IsBlackedOutProperty, false);
                    childButton.SetValue(CalendarDayButton.IsInactiveProperty, true);
                    childButton.SetValue(CalendarDayButton.IsTodayProperty, false);
                    childButton.SetValue(CalendarDayButton.IsSelectedProperty, false);
                }
            }
        }
        
        private AddMonthModeHighlight(): void
        {
            var owner = this.Owner;
            if (owner == null)
            {
                return;
            }

            if (owner.HoverStart && owner.HoverEnd)
            {
                var hStart = owner.HoverEnd;
                var hEnd = owner.HoverEnd;

                var daysToHighlight = DateTimeHelper.CompareDays(owner.HoverEnd, owner.HoverStart);
                if (daysToHighlight < 0)
                {
                    hEnd = this.Owner.HoverStart;
                }
                else
                {
                    hStart = this.Owner.HoverStart;
                }

                var count = this.ROWS * this.COLS;

                for (var childIndex = this.COLS; childIndex < count; childIndex++)
                {
                    var childButton = <CalendarDayButton>this._monthView.Children[childIndex];
                    if (<DateTime>childButton.DataContext)
                    {
                        var date = <DateTime>childButton.DataContext;
                        childButton.SetValue(
                            CalendarDayButton.IsHighlightedProperty,
                            (daysToHighlight != 0) && DateTimeHelper.InRange(date, hStart, hEnd));
                    }
                    else
                    {
                        childButton.SetValue(CalendarDayButton.IsHighlightedProperty, false);
                    }
                }
            }
            else
            {
                var count = this.ROWS * this.COLS;

                for (var childIndex = this.COLS; childIndex < count; childIndex++)
                {
                    var childButton = <CalendarDayButton>this._monthView.Children[childIndex];
                    childButton.SetValue(CalendarDayButton.IsHighlightedProperty, false);
                }
            }
        }
        
        private SetMonthModeNextButton(): void
        {
            if (this.Owner != null && this._nextButton != null)
            {
                var firstDayOfMonth = <DateTime>DateTimeHelper.DiscardDayTime(this.DisplayDate);

                // DisplayDate is equal to DateTime.MaxValue
                if (DateTimeHelper.CompareYearMonth(firstDayOfMonth, DateTime.MaxValue) == 0)
                {
                    this._nextButton.IsEnabled = false;
                }
                else
                {
                    // Since we are sure DisplayDate is not equal to DateTime.MaxValue, 
                    // it is safe to use AddMonths  
                    var firstDayOfNextMonth = this._calendar.AddMonths(firstDayOfMonth, 1);
                    this._nextButton.IsEnabled = (DateTimeHelper.CompareDays(this.Owner.DisplayDateEndInternal, firstDayOfNextMonth) > -1);
                }
            }
        }

        private SetMonthModePreviousButton(): void
        {
            if (this.Owner != null && this._previousButton != null)
            {
                var firstDayOfMonth = <DateTime>DateTimeHelper.DiscardDayTime(this.DisplayDate);
                this._previousButton.IsEnabled = (DateTimeHelper.CompareDays(this.Owner.DisplayDateStartInternal, firstDayOfMonth) < 0);
            }
        }
        
	}
    TemplateParts(CalendarItem,
        { Name: CalendarItem.ElementRoot, Type: FrameworkElement },
        { Name: CalendarItem.ElementHeaderButton, Type: Button },
        { Name: CalendarItem.ElementPreviousButton, Type: Button },
        { Name: CalendarItem.ElementNextButton, Type: Button },
        { Name: CalendarItem.ElementDayTitleTemplate, Type: DataTemplate },
        { Name: CalendarItem.ElementMonthView, Type: Button },
        { Name: CalendarItem.ElementYearView, Type: Grid },
        { Name: CalendarItem.ElementDisabledVisual, Type: Grid });
    TemplateVisualStates(CalendarItem,
        { GroupName: "CommonStates", Name: "Normal" },
        { GroupName: "CommonStates", Name: "Disabled" });
    
}
module Fayde.Time {
    import GregorianCalendar = Fayde.Localization.GregorianCalendar;
    import CultureInfo = Fayde.Localization.CultureInfo;
    import DateTimeFormatInfo = Fayde.Localization.DateTimeFormatInfo;
    import Calendar = Fayde.Localization.Calendar;
    
    export class DateTimeHelper{
        
        static Current = new DateTimeHelper();
		
		private cal: GregorianCalendar;
		
		public static AddDays(time: DateTime,days: number): DateTime {
			try {
				return time.AddDays(days);
			} catch (error) {
				
			}
		}
		
		public static AddMonths(time: DateTime,months: number): DateTime {
            try
            {
                return time.AddMonths(months);
            }
            catch (error)
            {
                return null;
            }
        }
		
		public static AddYears(time: DateTime,years: number): DateTime {
            try
            {
                return time.AddYears(years);
            }
            catch (error)
            {
                return null;
            }
        }
		
		public static SetYear(date: DateTime,year: number): DateTime {
            return this.AddYears(date, year - date.Year);                        
        }
		
		public static SetYearMonth(date: DateTime,yearMonth: DateTime): DateTime {
            var target = this.SetYear(date, yearMonth.Year);
            if (target)
            {
                target = this.AddMonths(target, yearMonth.Month - date.Month);
            }

            return target;
        }
		
		public static CompareDays(dt1: DateTime,dt2: DateTime): number {
            return DateTime.Compare(this.DiscardTime(dt1), this.DiscardTime(dt2));
        }
		
		public static CompareYearMonth(dt1: DateTime,dt2: DateTime): number {
            return ((dt1.Year - dt2.Year) * 12) + (dt1.Month - dt2.Month);
        }

        public static DecadeOfDate(date: DateTime): number {
            return date.Year - (date.Year % 10);
        }

        public static DiscardDayTime(d: DateTime): DateTime {
            return new DateTime(d.Year, d.Month, 1, 0, 0, 0);
        }

        public static DiscardTime(d: DateTime): DateTime {
            if (d == null)
            {
                return null;
            }

            return d.Date;
        }

        public static EndOfDecade(date: DateTime): number {
            return this.DecadeOfDate(date) + 9;
        }

        public static GetCurrentDateFormat(): DateTimeFormatInfo {
            return this.GetDateFormat(CultureInfo.Current);
        }

        static GetCulture(element: FrameworkElement): CultureInfo
        {
            var culture;
            //TODO CHECK THIS
            /*
            if (DependencyPropertyHelper.GetValueSource(element, FrameworkElement.LanguageProperty).BaseValueSource != BaseValueSource.Default)
            {
                culture = this.GetCultureInfo(element);
            }
            else
            {
                culture = CultureInfo.Current;
            }
            */
            culture = CultureInfo.Current;
            return culture;
        }

        // ------------------------------------------------------------------
        // Retrieve CultureInfo property from specified element.
        // ------------------------------------------------------------------
		static GetCultureInfo(element: DependencyObject): CultureInfo
        {
            var language = element.GetValue(FrameworkElement.LanguageProperty);
            try
            {
                //TODO return language.GetSpecificCulture();
                return new CultureInfo();
            }
            catch (InvalidOperationException)
            {
                // We default to en-US if no part of the language tag is recognized.
                //TODO return CultureInfo.ReadOnly(new CultureInfo("en-us", false));
                return new CultureInfo();
            }
        }

		static GetDateFormat(culture: CultureInfo): DateTimeFormatInfo
        {
            if (culture.Calendar instanceof GregorianCalendar)
            {
                return culture.DateTimeFormat;
            }
            else
            {
                //TODO var foundCal = <Calendar>culture.getDefaultCalendar();
                var foundCal = new GregorianCalendar();
                //TODO
                var dtfi = null;

                /*
                foreach (System.Globalization.Calendar cal in culture.OptionalCalendars)
                {
                    if (cal is GregorianCalendar)
                    {
                        // Return the first Gregorian calendar with CalendarType == Localized
                        // Otherwise return the first Gregorian calendar
                        
                        if (!foundCal)
                        {
                            foundCal = cal as GregorianCalendar;
                        }
                        
                        if (((GregorianCalendar)cal).CalendarType == GregorianCalendarTypes.Localized)
                        {
                            foundCal = cal as GregorianCalendar;
                            break;
                        }
                    }
                }
                */

                if (!foundCal)
                {
                    // if there are no GregorianCalendars in the OptionalCalendars list, use the invariant dtfi
                    //TODO dtfi = (<CultureInfo>CultureInfo.InvariantCulture).DateTimeFormat;
                    dtfi = CultureInfo.Current.DateTimeFormat;
                    //TODO
                    dtfi.Calendar = new GregorianCalendar();
                }
                else
                {
                    dtfi = culture.DateTimeFormat;
                    dtfi.Calendar = foundCal; 
                }

                return dtfi;
            }
        }
        /*
        // returns if the date is included in the range
        public static InRange(date: DateTime,range: CalendarDateRange): boolean
        {
            return this.InRange(date, range.Start, range.End);
        }
        */
        // returns if the date is included in the range
        public static InRange(date: DateTime,start: DateTime,end: DateTime):boolean
        {
            
            if (this.CompareDays(date, start) > -1 && this.CompareDays(date, end) < 1)
            {
                return true;
            }

            return false;
        }

        public static ToDayString(date: DateTime,culture: CultureInfo): string
        {
            var result = "";
            var format = this.GetDateFormat(culture);

            if (date && format != null)
            {
                //TODO result = date.Day.toString(format);
                result = date.Day.toString();
            }

            return result;
        }

        public static ToDecadeRangeString(decade: number,culture: CultureInfo): string
        {
            var result = "";
            var format = <DateTimeFormatInfo>culture.DateTimeFormat;

            if (format)
            {
                var decadeEnd = decade + 9;
                //TODO result = decade.toString(format) + "-" + decadeEnd.toString(format);
                result = decade.toString() + "-" + decadeEnd.toString();
            }

            return result;
        }

        public static ToYearMonthPatternString(date: DateTime,culture: CultureInfo): string
        {
            var result = "";
            var format = this.GetDateFormat(culture);

            if (date && format != null)
            {
                //TODO result = date.toString(format.YearMonthPattern, format);
                result = date.toString();
            }

            return result;
        }

        public static ToYearString(date: DateTime,culture: CultureInfo): string
        {
            var result = "";
            var format = this.GetDateFormat(culture);

            if (date && format)
            {
                //TODO result = date.Year.toString(format);
                result = date.Year.toString();
            }

            return result;
        }

        public static ToAbbreviatedMonthString(date: DateTime,culture: CultureInfo): string
        {
            var result = "";
            var format = this.GetDateFormat(culture);

            if (date && format != null)
            {
                var monthNames = format.AbbreviatedMonthNames;
                if (monthNames != null && monthNames.length > 0)
                {
                    result = monthNames[(date.Month - 1) % monthNames.length];
                }
            }

            return result;
        }

        public static ToLongDateString(date: DateTime,culture: CultureInfo): string
        {
            var result = "";
            var format = this.GetDateFormat(culture);

            if (date && format != null)
            {
                //TODO result = date.Date.toString(format.LongDatePattern, format);
                result = date.Date.toString();
            }

            return result;
        }


		
	}
}
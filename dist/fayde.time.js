var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        Time.version = '0.1.0';
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        Time.Library = Fayde.TypeManager.resolveLibrary("lib://fayde.time");
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        var Control = Fayde.Controls.Control;
        var TextBox = Fayde.Controls.TextBox;
        var TemplateParts = Fayde.Controls.TemplateParts;
        var TemplateVisualStates = Fayde.Controls.TemplateVisualStates;
        var DatePicker = (function (_super) {
            __extends(DatePicker, _super);
            function DatePicker() {
                _super.call(this);
                this._MonthTextBox = null;
                this._DayTextBox = null;
                this._YearTextBox = null;
                this._MonthGesture = new Time.Internal.EventGesture();
                this._DayGesture = new Time.Internal.EventGesture();
                this._YearGesture = new Time.Internal.EventGesture();
                this._SelectionHandler = null;
                this.DefaultStyleKey = DatePicker;
            }
            DatePicker.prototype.OnSelectedMonthChanged = function (args) {
                this.CoerceMonth(args.NewValue);
                this.CoerceDate();
            };
            DatePicker.prototype.OnSelectedDayChanged = function (args) {
                this.CoerceDay(args.NewValue);
                this.CoerceDate();
            };
            DatePicker.prototype.OnSelectedYearChanged = function (args) {
                this.CoerceYear(args.NewValue);
                this.CoerceDate();
            };
            DatePicker.prototype.OnSelectedDateChanged = function (args) {
                var dt = args.NewValue;
                if (dt instanceof DateTime) {
                    this.CoerceMonth(dt.Month);
                    this.CoerceDay(dt.Day);
                    this.CoerceYear(dt.Year);
                }
                else {
                    this.CoerceMonth(NaN);
                    this.CoerceDay(NaN);
                    this.CoerceYear(NaN);
                }
            };
            DatePicker.prototype.OnApplyTemplate = function () {
                var _this = this;
                _super.prototype.OnApplyTemplate.call(this);
                this._MonthGesture.Detach();
                this._MonthTextBox = this.GetTemplateChild("MonthTextBox", TextBox);
                if (this._MonthTextBox)
                    this._MonthGesture.Attach(this._MonthTextBox.LostFocus, function (tb) { return _this.CoerceMonth(tb.Text); });
                this._DayGesture.Detach();
                this._DayTextBox = this.GetTemplateChild("DayTextBox", TextBox);
                if (this._DayTextBox)
                    this._DayGesture.Attach(this._DayTextBox.LostFocus, function (tb) { return _this.CoerceDay(tb.Text); });
                this._YearGesture.Detach();
                this._YearTextBox = this.GetTemplateChild("YearTextBox", TextBox);
                if (this._YearTextBox)
                    this._YearGesture.Attach(this._YearTextBox.LostFocus, function (tb) { return _this.CoerceDay(tb.Text); });
                if (this._SelectionHandler)
                    this._SelectionHandler.Dispose();
                this._SelectionHandler = new Time.Internal.SelectionHandler([this._MonthTextBox, this._DayTextBox, this._YearTextBox]);
                this._UpdateText();
            };
            DatePicker.prototype.CoerceMonth = function (month) {
                month = Math.max(1, Math.min(12, month));
                if (!isNaN(month) || !isNaN(this.SelectedMonth))
                    this.SetCurrentValue(DatePicker.SelectedMonthProperty, month);
                this._UpdateText();
            };
            DatePicker.prototype.CoerceDay = function (day) {
                day = Math.max(1, Math.min(31, parseFloat(day)));
                if (!isNaN(day) || !isNaN(this.SelectedDay))
                    this.SetCurrentValue(DatePicker.SelectedDayProperty, day);
                this._UpdateText();
            };
            DatePicker.prototype.CoerceYear = function (year) {
                var maxYear = DateTime.MaxValue.Year - 1;
                year = Math.min(maxYear, Math.max(0, year));
                if (!isNaN(year) || !isNaN(this.SelectedYear))
                    this.SetCurrentValue(DatePicker.SelectedYearProperty, year);
                this._UpdateText();
            };
            DatePicker.prototype.CoerceDate = function () {
                var m = this.SelectedMonth;
                var d = this.SelectedDay;
                var y = this.SelectedYear;
                if (isNaN(m) || isNaN(d) || isNaN(y))
                    return;
                var dte = new DateTime(y, m, d);
                if (DateTime.Compare(dte, this.SelectedDate) === 0)
                    return;
                this.SetCurrentValue(DatePicker.SelectedDateProperty, dte);
            };
            DatePicker.prototype._UpdateText = function () {
                if (this._MonthTextBox)
                    this._MonthTextBox.Text = formatNumber(this.SelectedMonth, 2, "MM");
                if (this._DayTextBox)
                    this._DayTextBox.Text = formatNumber(this.SelectedDay, 2, "DD");
                if (this._YearTextBox)
                    this._YearTextBox.Text = formatNumber(this.SelectedYear, 4, "YYYY");
            };
            DatePicker.SelectedMonthProperty = DependencyProperty.Register("SelectedMonth", function () { return Number; }, DatePicker, NaN, function (d, args) { return d.OnSelectedMonthChanged(args); });
            DatePicker.SelectedDayProperty = DependencyProperty.Register("SelectedDay", function () { return Number; }, DatePicker, NaN, function (d, args) { return d.OnSelectedDayChanged(args); });
            DatePicker.SelectedYearProperty = DependencyProperty.Register("SelectedYear", function () { return Number; }, DatePicker, NaN, function (d, args) { return d.OnSelectedYearChanged(args); });
            DatePicker.SelectedDateProperty = DependencyProperty.Register("SelectedDate", function () { return DateTime; }, DatePicker, undefined, function (d, args) { return d.OnSelectedDateChanged(args); });
            return DatePicker;
        })(Control);
        Time.DatePicker = DatePicker;
        TemplateParts(DatePicker, { Name: "MonthTextBox", Type: TextBox }, { Name: "DayTextBox", Type: TextBox }, { Name: "YearTextBox", Type: TextBox });
        TemplateVisualStates(DatePicker, { GroupName: "CommonStates", Name: "Normal" }, { GroupName: "CommonStates", Name: "Disabled" }, { GroupName: "ValidationStates", Name: "Valid" }, { GroupName: "ValidationStates", Name: "InvalidFocused" }, { GroupName: "ValidationStates", Name: "InvalidUnfocused" });
        function formatNumber(n, digits, fallback) {
            if (isNaN(n))
                return fallback;
            return Fayde.Localization.Format("{0:d" + digits + "}", n);
        }
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        (function (DatePickerFormat) {
            DatePickerFormat[DatePickerFormat["Long"] = 0] = "Long";
            DatePickerFormat[DatePickerFormat["Short"] = 1] = "Short";
        })(Time.DatePickerFormat || (Time.DatePickerFormat = {}));
        var DatePickerFormat = Time.DatePickerFormat;
        Time.Library.addEnum(DatePickerFormat, "DatePickerFormat");
        (function (TimeDisplayMode) {
            TimeDisplayMode[TimeDisplayMode["Regular"] = 0] = "Regular";
            TimeDisplayMode[TimeDisplayMode["Military"] = 1] = "Military";
        })(Time.TimeDisplayMode || (Time.TimeDisplayMode = {}));
        var TimeDisplayMode = Time.TimeDisplayMode;
        Time.Library.addEnum(TimeDisplayMode, "TimeDisplayMode");
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        var Control = Fayde.Controls.Control;
        var TextBlock = Fayde.Controls.TextBlock;
        var TextBox = Fayde.Controls.TextBox;
        var TemplateParts = Fayde.Controls.TemplateParts;
        var TemplateVisualStates = Fayde.Controls.TemplateVisualStates;
        var TimePicker = (function (_super) {
            __extends(TimePicker, _super);
            function TimePicker() {
                _super.call(this);
                this._HourTextBox = null;
                this._MinuteTextBox = null;
                this._SecondTextBox = null;
                this._SecondSeparator = null;
                this._SuffixTextBlock = null;
                this._HourGesture = new Time.Internal.EventGesture();
                this._MinuteGesture = new Time.Internal.EventGesture();
                this._SecondGesture = new Time.Internal.EventGesture();
                this._SuffixGesture = new Time.Internal.EventGesture();
                this._SelectionHandler = null;
                this.DefaultStyleKey = TimePicker;
                this.CoerceTime();
            }
            TimePicker.prototype.OnSelectedHourChanged = function (args) {
                this.CoerceHour(args.NewValue);
                this.CoerceTime();
            };
            TimePicker.prototype.OnSelectedMinuteChanged = function (args) {
                this.CoerceMinute(args.NewValue);
                this.CoerceTime();
            };
            TimePicker.prototype.OnSelectedSecondChanged = function (args) {
                this.CoerceSecond(args.NewValue);
                this.CoerceTime();
            };
            TimePicker.prototype.OnSelectedTimeChanged = function (args) {
                var ts = args.NewValue;
                if (ts instanceof TimeSpan) {
                    this.CoerceHour(ts.Hours);
                    this.CoerceMinute(ts.Minutes);
                    this.CoerceSecond(ts.Seconds);
                }
                else {
                    this.CoerceHour(NaN);
                    this.CoerceMinute(NaN);
                    this.CoerceSecond(NaN);
                }
            };
            TimePicker.prototype.OnDisplayModeChanged = function (args) {
                this._UpdateText();
            };
            TimePicker.prototype.OnApplyTemplate = function () {
                var _this = this;
                _super.prototype.OnApplyTemplate.call(this);
                this._HourGesture.Detach();
                this._HourTextBox = this.GetTemplateChild("HourTextBox", TextBox);
                if (this._HourTextBox)
                    this._HourGesture.Attach(this._HourTextBox.LostFocus, function (tb) { return _this.CoerceHour(_this._GetHourInput()); });
                this._MinuteGesture.Detach();
                this._MinuteTextBox = this.GetTemplateChild("MinuteTextBox", TextBox);
                if (this._MinuteTextBox)
                    this._MinuteGesture.Attach(this._MinuteTextBox.LostFocus, function (tb) { return _this.CoerceMinute(tb.Text); });
                this._SecondGesture.Detach();
                this._SecondTextBox = this.GetTemplateChild("SecondTextBox", TextBox);
                if (this._SecondTextBox)
                    this._SecondGesture.Attach(this._SecondTextBox.LostFocus, function (tb) { return _this.CoerceSecond(tb.Text); });
                this._SecondSeparator = this.GetTemplateChild("SecondSeparator", Fayde.FrameworkElement);
                this._SuffixGesture.Detach();
                this._SuffixTextBlock = this.GetTemplateChild("SuffixTextBlock", TextBlock);
                if (this._SuffixTextBlock)
                    this._SuffixGesture.Attach(this._SuffixTextBlock.MouseLeftButtonUp, function (tb) { return _this.ToggleAmPm(); });
                if (this._SelectionHandler)
                    this._SelectionHandler.Dispose();
                this._SelectionHandler = new Time.Internal.SelectionHandler([this._HourTextBox, this._MinuteTextBox, this._SecondTextBox]);
                this._UpdateText();
            };
            TimePicker.prototype._GetHourInput = function () {
                var text = this._HourTextBox.Text;
                if (this.DisplayMode === Time.TimeDisplayMode.Military)
                    return text;
                var h = parseFloat(text);
                var isa = !!this._SuffixTextBlock && this._SuffixTextBlock.Text === "AM";
                if (isa && h === 12)
                    return "00";
                if (!isa && h < 12)
                    return (h + 12).toString();
                return text;
            };
            TimePicker.prototype.CoerceHour = function (hour) {
                hour = Math.max(0, Math.min(23, hour));
                hour = hour || 0;
                this.SetCurrentValue(TimePicker.SelectedHourProperty, hour);
                this._UpdateText();
            };
            TimePicker.prototype.CoerceMinute = function (minute) {
                minute = Math.max(0, Math.min(59, minute));
                minute = minute || 0;
                this.SetCurrentValue(TimePicker.SelectedMinuteProperty, minute);
                this._UpdateText();
            };
            TimePicker.prototype.CoerceSecond = function (second) {
                second = Math.max(0, Math.min(59, second));
                second = second || 0;
                this.SetCurrentValue(TimePicker.SelectedSecondProperty, second);
                this._UpdateText();
            };
            TimePicker.prototype.CoerceTime = function () {
                var ts = new TimeSpan(this.SelectedHour, this.SelectedMinute, this.SelectedSecond);
                var old = this.SelectedTime;
                if (!!old && ts.CompareTo(old) === 0)
                    return;
                this.SetCurrentValue(TimePicker.SelectedTimeProperty, ts);
            };
            TimePicker.prototype.ToggleAmPm = function () {
                var hour = this.SelectedHour;
                if (hour >= 12)
                    hour -= 12;
                else
                    hour += 12;
                this.CoerceHour(hour);
            };
            TimePicker.prototype._UpdateText = function () {
                var isMilitary = this.DisplayMode === Time.TimeDisplayMode.Military;
                var h = this.SelectedHour;
                var m = this.SelectedMinute;
                var s = this.SelectedSecond;
                var isSecondShown = this.IsSecondsShown;
                var hd = h;
                if (!isMilitary) {
                    hd = hd >= 12 ? (hd - 12) : hd;
                    hd = hd === 0 ? 12 : hd;
                }
                if (this._HourTextBox)
                    this._HourTextBox.Text = formatNumber(hd, 2, "00");
                if (this._MinuteTextBox)
                    this._MinuteTextBox.Text = formatNumber(m, 2, "00");
                if (this._SecondTextBox) {
                    this._SecondTextBox.Text = formatNumber(s, 2, "00");
                    this._SecondTextBox.Visibility = isSecondShown ? Fayde.Visibility.Visible : Fayde.Visibility.Collapsed;
                }
                if (this._SecondSeparator)
                    this._SecondSeparator.Visibility = isSecondShown ? Fayde.Visibility.Visible : Fayde.Visibility.Collapsed;
                if (this._SuffixTextBlock) {
                    this._SuffixTextBlock.Visibility = isMilitary ? Fayde.Visibility.Collapsed : Fayde.Visibility.Visible;
                    this._SuffixTextBlock.Text = h >= 12 ? "PM" : "AM";
                }
            };
            TimePicker.SelectedHourProperty = DependencyProperty.Register("SelectedHour", function () { return Number; }, TimePicker, 0, function (d, args) { return d.OnSelectedHourChanged(args); });
            TimePicker.SelectedMinuteProperty = DependencyProperty.Register("SelectedMinute", function () { return Number; }, TimePicker, 0, function (d, args) { return d.OnSelectedMinuteChanged(args); });
            TimePicker.SelectedSecondProperty = DependencyProperty.Register("SelectedSecond", function () { return Number; }, TimePicker, 0, function (d, args) { return d.OnSelectedSecondChanged(args); });
            TimePicker.SelectedTimeProperty = DependencyProperty.Register("SelectedTime", function () { return TimeSpan; }, TimePicker, undefined, function (d, args) { return d.OnSelectedTimeChanged(args); });
            TimePicker.IsSecondsShownProperty = DependencyProperty.Register("IsSecondsShown", function () { return Boolean; }, TimePicker, true, function (d, args) { return d._UpdateText(); });
            TimePicker.DisplayModeProperty = DependencyProperty.Register("DisplayMode", function () { return new Fayde.Enum(Time.TimeDisplayMode); }, TimePicker, Time.TimeDisplayMode.Regular, function (d, args) { return d.OnDisplayModeChanged(args); });
            return TimePicker;
        })(Control);
        Time.TimePicker = TimePicker;
        TemplateParts(TimePicker, { Name: "HourTextBox", Type: TextBox }, { Name: "MinuteTextBox", Type: TextBox }, { Name: "SecondTextBox", Type: TextBox }, { Name: "SecondSeparator", Type: Fayde.FrameworkElement }, { Name: "SuffixTextBlock", Type: TextBlock });
        TemplateVisualStates(TimePicker, { GroupName: "CommonStates", Name: "Normal" }, { GroupName: "CommonStates", Name: "Disabled" }, { GroupName: "ValidationStates", Name: "Valid" }, { GroupName: "ValidationStates", Name: "InvalidFocused" }, { GroupName: "ValidationStates", Name: "InvalidUnfocused" });
        function formatNumber(n, digits, fallback) {
            if (isNaN(n))
                return fallback;
            return Fayde.Localization.Format("{0:d" + digits + "}", n);
        }
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        var Internal;
        (function (Internal) {
            var EventGesture = (function () {
                function EventGesture() {
                }
                EventGesture.prototype.Attach = function (event, callback) {
                    var _this = this;
                    this._Callback = callback;
                    event.on(this._OnEvent, this);
                    this.Detach = function () {
                        event.off(_this._OnEvent, _this);
                        _this.Detach = function () {
                        };
                    };
                };
                EventGesture.prototype.Detach = function () {
                };
                EventGesture.prototype._OnEvent = function (sender, e) {
                    this._Callback && this._Callback(sender, e);
                };
                return EventGesture;
            })();
            Internal.EventGesture = EventGesture;
        })(Internal = Time.Internal || (Time.Internal = {}));
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var Time;
    (function (Time) {
        var Internal;
        (function (Internal) {
            var SelectionHandler = (function () {
                function SelectionHandler(textBoxes) {
                    var _this = this;
                    this._ActiveBox = null;
                    this._IsMouseDown = false;
                    this._TextBoxes = [];
                    this._TextBoxes = textBoxes = textBoxes.filter(function (tb) { return !!tb; });
                    textBoxes.forEach(function (tb) {
                        tb.MouseLeftButtonDown.on(_this._MouseDown, _this);
                        tb.MouseLeftButtonUp.on(_this._MouseUp, _this);
                        tb.GotFocus.on(_this._GotFocus, _this);
                        tb.LostFocus.on(_this._LostFocus, _this);
                    });
                }
                Object.defineProperty(SelectionHandler.prototype, "ActiveBox", {
                    get: function () { return this._ActiveBox; },
                    enumerable: true,
                    configurable: true
                });
                SelectionHandler.prototype.Dispose = function () {
                    var _this = this;
                    this._TextBoxes.forEach(function (tb) {
                        tb.MouseLeftButtonDown.off(_this._MouseDown, _this);
                        tb.MouseLeftButtonUp.off(_this._MouseUp, _this);
                        tb.GotFocus.off(_this._GotFocus, _this);
                        tb.LostFocus.off(_this._LostFocus, _this);
                    });
                };
                SelectionHandler.prototype._GotFocus = function (sender, e) {
                    if (this._IsMouseDown)
                        return;
                    sender.SelectAll();
                };
                SelectionHandler.prototype._MouseDown = function (sender, e) {
                    this._IsMouseDown = true;
                };
                SelectionHandler.prototype._MouseUp = function (sender, e) {
                    this._IsMouseDown = false;
                    if (this._ActiveBox === sender)
                        return;
                    this._ActiveBox = sender;
                    if (this._ActiveBox.SelectionLength <= 0)
                        sender.SelectAll();
                };
                SelectionHandler.prototype._LostFocus = function (sender, e) {
                    sender.Select(0, 0);
                    if (this._ActiveBox === sender)
                        this._ActiveBox = null;
                };
                return SelectionHandler;
            })();
            Internal.SelectionHandler = SelectionHandler;
        })(Internal = Time.Internal || (Time.Internal = {}));
    })(Time = Fayde.Time || (Fayde.Time = {}));
})(Fayde || (Fayde = {}));

//# sourceMappingURL=fayde.time.js.map

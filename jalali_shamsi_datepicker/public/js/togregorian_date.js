// jalali_shamsi_datepicker/public/js/togregorian_date.js
frappe.provide("frappe.ui.form");

// تابع تبدیل اعداد فارسی به لاتین
function toLatinDigits(str) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const latinNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let result = str;
    for (let i = 0; i < 10; i++) {
        result = result.replace(persianNumbers[i], latinNumbers[i]);
    }
    return result;
}

// تابع تبدیل تاریخ شمسی به میلادی
function persianToGregorian(persianDateStr) {
    var [year, month, day] = persianDateStr.split("/").map(Number);
    var pDate = new persianDate([year, month, day]);
    return pDate.toCalendar("gregorian").format("YYYY-MM-DD");
}

// تابع تبدیل تاریخ و زمان شمسی به میلادی
function persianToGregorianDatetime(persianDateTimeStr) {
    var [datePart, timePart] = persianDateTimeStr.split(" ");
    var [year, month, day] = datePart.split("/").map(Number);
    var [hour, minute, second] = timePart.split(":").map(Number);
    var pDate = new persianDate([year, month, day, hour, minute, second]);
    return pDate.toCalendar("gregorian").format("YYYY-MM-DD HH:mm:ss");
}

// دریافت تنظیمات سیستم
frappe.call({
    method: "frappe.client.get",
    args: {
        doctype: "System Settings",
        name: "System Settings"
    },
    callback: function(r) {
        var settings = r.message;
        // شرط فعال‌سازی اسکریپت
        if (!settings.custom_enable_shamsi_jalali_calendar || settings.custom_date_storage_format !== "Gregorian (میلادی)") return;

        // فیلدهای Date
        $('input[data-fieldtype="Date"]').each(function() {
            var $input = $(this);
            if (!$input.hasClass("has-persian-datepicker")) {
                $input.addClass("has-persian-datepicker");
                $input.persianDatepicker({
                    format: "YYYY/MM/DD",
                    position: "auto",
                    persianDigit: false, // اعداد لاتین
                    autoClose: true,
                    formatter: function(unix) {
                        var pDate = new persianDate(unix);
                        return toLatinDigits(pDate.format("YYYY/MM/DD"));
                    },
                    onSelect: function(unix) {
                        var pDate = new persianDate(unix);
                        var persianDateLatin = toLatinDigits(pDate.format("YYYY/MM/DD"));
                        var gregorianDate = pDate.toCalendar("gregorian").format("YYYY-MM-DD");
                        $input.val(persianDateLatin);
                        show_gregorian_date($input, gregorianDate);
                        $input.trigger("change");
                    }
                });
            }
        });

        // فیلدهای Datetime
        $('input[data-fieldtype="Datetime"]').each(function() {
            var $input = $(this);
            if (!$input.hasClass("has-persian-datepicker")) {
                $input.addClass("has-persian-datepicker");
                $input.persianDatepicker({
                    format: "YYYY/MM/DD HH:mm:ss",
                    position: "auto",
                    timePicker: { enabled: true },
                    persianDigit: false, // اعداد لاتین
                    autoClose: true,
                    formatter: function(unix) {
                        var pDate = new persianDate(unix);
                        return toLatinDigits(pDate.format("YYYY/MM/DD HH:mm:ss"));
                    },
                    onSelect: function(unix) {
                        var pDate = new persianDate(unix);
                        var persianDateLatin = toLatinDigits(pDate.format("YYYY/MM/DD HH:mm:ss"));
                        $input.val(persianDateLatin);
                        $input.trigger("change");
                    }
                });
            }
        });

        // رویداد before_save برای تبدیل به میلادی
        frappe.ui.form.on(frappe.ui.form.get_form().doctype, {
            before_save: function(frm) {
                frm.fields_dict.$wrapper.find('input[data-fieldtype="Date"]').each(function() {
                    var $input = $(this);
                    var persianDate = $input.val();
                    if (persianDate) {
                        var gregorianDate = persianToGregorian(persianDate);
                        frappe.model.set_value(frm.doctype, frm.doc.name, $input.attr("data-fieldname"), gregorianDate);
                    }
                });

                frm.fields_dict.$wrapper.find('input[data-fieldtype="Datetime"]').each(function() {
                    var $input = $(this);
                    var persianDateTime = $input.val();
                    if (persianDateTime) {
                        var gregorianDateTime = persianToGregorianDatetime(persianDateTime);
                        frappe.model.set_value(frm.doctype, frm.doc.name, $input.attr("data-fieldname"), gregorianDateTime);
                    }
                });
            }
        });
    }
});

// نمایش معادل میلادی برای فیلد Date
function show_gregorian_date($input, gregorian_date) {
    var $gregorian = $input.next(".gregorian-date");
    if (!$gregorian.length) {
        $gregorian = $('<div class="gregorian-date"></div>').insertAfter($input);
    }
    $gregorian.text("میلادی: " + gregorian_date);
}
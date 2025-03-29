// jalali_shamsi_datepicker/public/js/topersian_date.js
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

// استفاده از رویداد form-refresh برای اتصال تقویم به فیلدها
$(document).on("form-load form-refresh", function() {
    frappe.call({
        method: "frappe.client.get",
        args: {
            doctype: "System Settings",
            name: "System Settings"
        },
        callback: function(r) {
            var settings = r.message;
            console.log("تنظیمات دریافت‌شده:", settings);

            // شرط فعال‌سازی اسکریپت
            if (settings.custom_date_storage_format !== "Persian (شمسی)") {
                console.log("اسکریپت غیرفعال - فرمت ذخیره‌سازی:", settings.custom_date_storage_format);
                return;
            }

            console.log("topersian_date.js فعال شد");

            // فیلدهای Date
            $('input[data-fieldtype="Date"]').each(function() {
                var $input = $(this);
                var fieldname = $input.attr("data-fieldname");
                if (!$input.data("datepicker-initialized")) {
                    console.log("اضافه کردن تقویم به فیلد Date:", fieldname);
                    $input.data("datepicker-initialized", true);
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

                            // تنظیم مقدار در فیلد
                            $input.val(persianDateLatin);

                            // به‌روزرسانی مدل داده
                            var frm = $input.closest("form").data("frappe-form");
                            if (frm && frm.doc && fieldname) {
                                frappe.model.set_value(frm.doc.doctype, frm.doc.name, fieldname, persianDateLatin);
                                console.log("مقدار تنظیم‌شده در مدل:", persianDateLatin);
                            } else {
                                console.error("فرم یا فیلد پیدا نشد!");
                            }

                            // نمایش معادل میلادی
                            show_gregorian_date($input, gregorianDate);
                            $input.trigger("change");
                        }
                    });
                    console.log("تقویم به فیلد Date اضافه شد:", fieldname);
                }
            });

            // فیلدهای Datetime
            $('input[data-fieldtype="Datetime"]').each(function() {
                var $input = $(this);
                var fieldname = $input.attr("data-fieldname");
                if (!$input.data("datepicker-initialized")) {
                    console.log("اضافه کردن تقویم به فیلد Datetime:", fieldname);
                    $input.data("datepicker-initialized", true);
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

                            // تنظیم مقدار در فیلد
                            $input.val(persianDateLatin);

                            // به‌روزرسانی مدل داده
                            var frm = $input.closest("form").data("frappe-form");
                            if (frm && frm.doc && fieldname) {
                                frappe.model.set_value(frm.doc.doctype, frm.doc.name, fieldname, persianDateLatin);
                                console.log("مقدار تنظیم‌شده در مدل:", persianDateLatin);
                            } else {
                                console.error("فرم یا فیلد پیدا نشد!");
                            }

                            $input.trigger("change");
                        }
                    });
                    console.log("تقویم به فیلد Datetime اضافه شد:", fieldname);
                }
            });
        }
    });
});

// نمایش معادل میلادی برای فیلد Date
function show_gregorian_date($input, gregorian_date) {
    var $gregorian = $input.next(".gregorian-date");
    if (!$gregorian.length) {
        $gregorian = $('<div class="gregorian-date"></div>').insertAfter($input);
    }
    $gregorian.text("میلادی: " + gregorian_date);
}
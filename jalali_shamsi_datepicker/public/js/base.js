frappe.provide("frappe.ui.form");

// همیشه Gregorian / ERPNext datepicker خودش کار کند
// هیچ کاری برای input ها انجام نمی‌دهیم اگر شمسی غیرفعال باشد
$(document).on("form-load form-refresh", function() {
    frappe.call({
        method: "frappe.client.get",
        args: { doctype: "System Settings", name: "System Settings" },
        callback: function(r) {
            var settings = r.message;

            // اگر شمسی فعال باشد، Persian datepicker را attach کنیم
            if (settings.custom_enable_shamsi_jalali_calendar && settings.custom_date_storage_format === "Persian (شمسی)") {
                frappe.require("/assets/jalali_shamsi_datepicker/js/topersian_date.js", function() {
                });
                frappe.require("/assets/jalali_shamsi_datepicker/js/togregorian_date.js", function() {
                });
                frappe.require("/assets/jalali_shamsi_datepicker/js/in_words_cleanup.js", function() {
                });
                frappe.require("/assets/jalali_shamsi_datepicker/css/custom.css", function() {
                });
            } else {
                // هیچ کاری نکن؛ ERPNext خودش datepicker را نشان می‌دهد
                console.log("Persian datepicker غیرفعال، ERPNext datepicker طبیعی نمایش داده می‌شود");
            }
        }
    });
});

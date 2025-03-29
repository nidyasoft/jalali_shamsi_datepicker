// jalali_shamsi_datepicker/public/js/remove_in_words_suffix.js

frappe.ui.form.on('*', { // اعمال به تمام فرم‌ها
    refresh: function(frm) {
        if (frm.doc && frm.doc.in_words) {
            let inWords = frm.doc.in_words;
            if (inWords.endsWith("Only")) {
                frm.set_value("in_words", inWords.slice(0, -4).trim());
            } else if (inWords.endsWith("فقط")) {
                frm.set_value("in_words", inWords.slice(0, -3).trim());
            }
        }
    }
});
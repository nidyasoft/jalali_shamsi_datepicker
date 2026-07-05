// jalali_shamsi_datepicker/public/js/in_words_cleanup.js

frappe.ui.form.on('*', {
    refresh: function(frm) {
        // فقط اگر فیلد in_words در فرم وجود دارد ادامه بده
        if (!frm.fields_dict || !frm.fields_dict.in_words) return;

        let val = frm.doc && frm.doc.in_words;
        if (typeof val !== 'string' || !val.trim()) return;

        let original = val;
        // الگو برای حذف trailing: فقط، Only، انواع نقطه و فضای سفید، case-insensitive برای انگلیسی
        let cleaned = val.replace(/(\s)*(Only|only|ONLY)([.!؟\s]*)$/i, '')
                         .replace(/(\s)*فقط([.!؟\s]*)$/u, '')
                         .trim();

        if (cleaned !== original) {
            frm.set_value('in_words', cleaned);
        }
    }
});
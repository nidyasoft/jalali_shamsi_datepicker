# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe

def execute():
    """
    Add 'yyyy/mm/dd' option to the 'date_format' field of System Settings
    in an idempotent way.
    """

    doctype = "System Settings"
    fieldname = "date_format"
    new_option = "yyyy/mm/dd"

    try:
        # -----------------------------
        # 1. Update DocField metadata
        # -----------------------------
        dt = frappe.get_meta(doctype)
        field = dt.get_field(fieldname)
        if not field:
            frappe.log_error(
                f"jalali_shamsi_datepicker: Could not find field {fieldname} in {doctype}",
                "add_yyyy_mm_dd_date_format"
            )
            return

        # Convert options to list
        opts = [o.strip() for o in (field.options or "").split("\n") if o.strip()]

        # Add new option if not exists
        if new_option not in opts:
            opts.append(new_option)
            new_options = "\n".join(opts)
            frappe.db.set_value("DocField", {"parent": doctype, "fieldname": fieldname}, "options", new_options)
            frappe.clear_cache(doctype=doctype)

        # -----------------------------
        # 2. Update actual System Settings document
        # -----------------------------
        doc = frappe.get_single(doctype)

        # Ensure the field's current value is still valid
        current_value = doc.get(fieldname)
        if current_value not in opts:
            doc.set(fieldname, current_value or opts[0])  # fallback to first option if empty
            doc.save(ignore_permissions=True)

        # -----------------------------
        # 3. Commit changes
        # -----------------------------
        frappe.db.commit()

    except Exception:
        frappe.log_error(frappe.get_traceback(), "jalali_shamsi_datepicker.add_yyyy_mm_dd_date_format")
        raise

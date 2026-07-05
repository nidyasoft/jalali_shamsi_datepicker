app_name = "jalali_shamsi_datepicker"
app_title = "Jalali Shamsi Datepicker"
app_icon = "octicon octicon-calendar"
app_color = "blue"
app_publisher = "Ideenemium"
app_description = "A best solution to change date and datetime fields to Shamsi(Jalali) Calendar."
app_email = "ideenemium@gmail.com"
app_license = "MIT"

# jalali_shamsi_datepicker/hooks.py
fixtures = [
    {"doctype": "Custom Field"}
]

app_include_css = [
    "/assets/jalali_shamsi_datepicker/css/persian-datepicker.min.css",
]
app_include_js = [
    "/assets/jalali_shamsi_datepicker/js/persian-date.min.js",
    "/assets/jalali_shamsi_datepicker/js/persian-datepicker.min.js",
    "/assets/jalali_shamsi_datepicker/js/base.js"
]
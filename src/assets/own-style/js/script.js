//== Class definition

var BootstrapDatetimepicker = function () {

    //== Private functions
    var demos = function () {

        $('#searchDateAddedFrom, #searchDateAddedTo').datetimepicker({
            format: "yyyy-mm-dd",
            //format: "mm/dd/yyyy",
            todayHighlight: true,
            autoclose: true,
            startView: 2,
            minView: 2,
            forceParse: 0,
            pickerPosition: 'bottom-left'
        });

    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

jQuery(document).ready(function () {
    BootstrapDatetimepicker.init();
});

var Select2 = function () {

    //== Private functions
    var demos = function () {

        // $('#categoryID').select2({
        //     placeholder: "Select Category"
        // });
    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

jQuery(document).ready(function () {
    Select2.init();
});
//== Class definition

var SummernoteDemo = function () {
    //== Private functions
    var demos = function () {
        $('.summernote').summernote({
            lang: 'ar-AR',
            toolbar: [
                // ["style", ["style"]],
                ["font", ["bold", "italic", "underline", "clear", 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['height', ['height']],                
                // ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]],
                ["table", ["table"]],
               
                ["insert", [ "picture", "hr"]],
               
                // ["view", ["fullscreen", "undo", "redo"]],
                // ["view", ["fullscreen", "codeview"]],
            ],
            height: 30
        });
    }

    return {
        // public functions
        init: function () {
            demos();
        }
    };
}();

//== Initialization
jQuery(document).ready(function () {
    SummernoteDemo.init();
    
    $(".note-editable p").addClass("summernoteDirection");
    // $(".note-editable p br").remove();

});
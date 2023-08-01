var UploadEditorImg = function () {

    //== Private functions
    var demos = function () {

        $('.note-form-group').on('change', '.note-image-input', function () {

            var names = [];
            for (var i = 0; i < $(this).get(0).files.length; ++i) {
                names.push($(this).get(0).files[i]);
                // $(this).get(0).files[i].name;

                var formData = new FormData();
                formData.append('file', $(this).get(0).files[i]);

                $.ajax({
                    type: 'POST',
                    url: "http://localhost/ajaxpost.php",
                    data: formData,
                    dataType: 'application/json',
                    async: false,
                    cache: false,
                    success: function (res) {
                        console.log('res::::', res);
                    }
                });

            }

            // console.log(names);


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
    UploadEditorImg.init();
});
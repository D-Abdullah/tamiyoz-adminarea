function check_all()
{
    $('input[class="checkbox_item"]:checkbox').each(function(){

        if ($('input[class="check_all"]:checkbox:checked').length == 0) {
            $(this).prop('checked', false);
        }else{
            $(this).prop('checked', true);
        }

    });
}

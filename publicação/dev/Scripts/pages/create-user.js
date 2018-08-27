$(".chk-legal").change(function () {
    if (this.checked) {

        $('.lbl-name').text('Nome Fantasia (*)');
        $('.div-legal').css('display', 'block');
        $('.div-not-legal').css('display', 'none');

        $(".cnpj").attr("data-required", "true");
        $(".rg").attr("data-required", "false");
        $(".cpf").attr("data-required", "false");
    }
    else {
        $('.lbl-name').text('Nome Completo (*)');
        $('.div-legal').css('display', 'none');
        $('.div-not-legal').css('display', 'block');

        $(".cnpj").attr("data-required", "false");
        $(".rg").attr("data-required", "true");
        $(".cpf").attr("data-required", "true");
    }
});
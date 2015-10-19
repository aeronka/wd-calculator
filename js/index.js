document.addEventListener("DOMContentLoaded", function() {
    var calculator = new Calculator({
        elem: document.querySelector('.deposit-calculator')
    });


// для отслеживания и реагирования на изменения в текстовых полях input сразу же, не дожидаясь увода фокуса
    calculator.elem.addEventListener('input', function() {calculator.formInput();});
// для отслеживания изменений в поле input checkbox
    calculator.elem.addEventListener('change', function() {calculator.formInput();});
//отслеживает нажатие клавиш с целью проверки и запрета ввода не числа
    calculator.elem.addEventListener('keypress', function(event) {calculator.checkSymbol(event);});

});

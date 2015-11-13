document.addEventListener('DOMContentLoaded', function() {
    var slider = new Slider({
        sliderElem: document.querySelector('.slider'),
        labels: [3, 6, 12, 18, 24]
    });

    var calculator = new Calculator({
        elem: document.querySelector('.deposit-calculator'),
        sliderFirstValue: slider.labels[0]
    });

// для отслеживания и реагирования на изменения в текстовых полях input сразу же, не дожидаясь увода фокуса
    calculator.elem.addEventListener('input', function() {
        calculator.formInput();
    });

// для отслеживания изменений в поле input checkbox
    calculator.elem.addEventListener('change', function() {
        calculator.formInput();
    });

//отслеживает нажатие клавиш с целью проверки и запрета ввода не числа
    calculator.elem.addEventListener('keypress', function(event) {
        calculator.checkSymbol(event);
    });
  
//при возникновении события слайдер отдает значение для рассчета суммы вклада
    slider.sliderElem.addEventListener('slide', function(event) {
        calculator.formInput(event.detail);
    });
    
});

document.addEventListener("DOMContentLoaded", function() {
    var calculator = new Calculator({
        elem: document.querySelector('.deposit-calculator')
    });

    var slider = new Slider({
        sliderElem: calculator.elem.querySelector('.slider'),
        labels: [3, 6, 12, 18, 24]
    });

// для отслеживания и реагирования на изменения в текстовых полях input сразу же, не дожидаясь увода фокуса
    calculator.elem.addEventListener('input', calculator.formInput.bind(calculator));

// для отслеживания изменений в поле input checkbox
    calculator.elem.addEventListener('change', calculator.formInput.bind(calculator));
    
//отслеживает нажатие клавиш с целью проверки и запрета ввода не числа
    calculator.elem.addEventListener('keypress', function(event) {
        calculator.checkSymbol(event);
    });
  
//при возникновении события слайдер отдает значение для рассчета суммы вклада
    slider.sliderElem.addEventListener('slide', function(event) {
        console.log('значение слайдера' + event.detail);
    });
    
});

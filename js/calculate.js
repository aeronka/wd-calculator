function Calculator(options) {
    var elem = this.elem = options.elem;
    this.diagramRezultBefore = elem.querySelector('.diagram-before');
    this.diagramRezultAfter = elem.querySelector('.diagram-after');

    this.moneyRezultBefore = this.diagramRezultBefore.querySelector('.money');
    this.moneyRezultAfter = this.diagramRezultAfter.querySelector('.money');

    this.chartBefore = this.diagramRezultBefore.querySelector('.chart-before');
    this.chartAfter = this.diagramRezultAfter.querySelector('.chart-after');
    //текущее значение слайдера
    this.currentMonthsValue = options.sliderFirstValue;

    this.displayRezultBefore();
    this.displayRezultAfter(this.currentMonthsValue);
}

//отображение первоначальной суммы в поле результата
Calculator.prototype.displayRezultBefore = function() {
    var moneyBefore = this.elem.querySelector('input[name="sum"]');
    //форматируем сумму
    this.moneyRezultBefore.innerHTML = (+moneyBefore.value).toLocaleString() || 0;
};

//отображение итоговой суммы
Calculator.prototype.displayRezultAfter = function(months) {
    var money = this.calculateRezultAfter(months);
    //форматируем сумму
    this.moneyRezultAfter.innerHTML = money.moneyAft.toLocaleString();

    this.calculateDiagramRezultHeight(money);
};

Calculator.prototype.formInput = function(months) {
    if(months) this.currentMonthsValue = months;
    this.displayRezultBefore();
    this.displayRezultAfter(this.currentMonthsValue);
};


//рассчет итоговой суммы
Calculator.prototype.calculateRezultAfter = function(months) {
    var capitalization = this.elem.querySelector('input[name="capitalization"]');
    var rate = this.elem.querySelector('input[name="percent"]').value;
    //months - значение количества месяцев из слайдера
    var moneyBefore = this.elem.querySelector('input[name="sum"]').value;
    var moneyAfter = moneyBefore;
    var monthlyIncrease = rate / 12 / 100;

    if (!capitalization.checked) {
        moneyAfter = moneyBefore * (1 + monthlyIncrease * months);
      } else {

        for (var i = 0; i < months; i++) {
          moneyAfter =  moneyAfter * (1 + monthlyIncrease);
        }
      }
    moneyAfter = Math.round(moneyAfter);
    return {moneyAft: moneyAfter, moneyBef: moneyBefore};
};

//рассчет высоты диаграммы итоговой суммы относительно исходной
Calculator.prototype.calculateDiagramRezultHeight = function(money) {
    var percentMoneyAfter = (money.moneyAft * 100) / money.moneyBef;
    var chartBefore = this.elem.querySelector('.chart-before');
    var newHeight = chartBefore.offsetHeight + chartBefore.offsetHeight * (percentMoneyAfter / 100 - 1);
    this.chartAfter.style.height = newHeight + 'px';
};

//проверка на ввод только числа, запрет ввода текста
Calculator.prototype.checkSymbol = function(event) {
    var symbol = getChar(event);
    if (!(+symbol || symbol == '0')) event.preventDefault();
};

// вспомогательная функция для получения символа из события keypress
function getChar(event) {
  if (event.which == null) {
    if (event.keyCode < 32) return null;
    return String.fromCharCode(event.keyCode) // IE
  }

  if (event.which != 0 && event.charCode != 0) {
    if (event.which < 32) return null;
    return String.fromCharCode(event.which) // остальные
  }

  return null; // специальная клавиша
}

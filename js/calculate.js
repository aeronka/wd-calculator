function Calculator(options) {
    var elem = this.elem = options.elem;

    this.diagram = elem.querySelector('.diagram');
    this.diagramRezultBefore = elem.querySelector('.diagram-before');
    this.diagramRezultAfter = elem.querySelector('.diagram-after');

    this.moneyBefore = this.elem.querySelector('.sum');
    this.moneyRezultBefore = this.diagramRezultBefore.querySelector('.money');
    this.moneyRezultAfter = this.diagramRezultAfter.querySelector('.money');

    this.rate = this.elem.querySelector('.rate');
    this.capitalization = this.elem.querySelector('input[name="capitalization"]');

    this.chartBefore = this.diagramRezultBefore.querySelector('.chart-before');
    this.chartAfter = this.diagramRezultAfter.querySelector('.chart-after');
    //текущее значение слайдера
    this.currentMonthsValue = options.sliderFirstValue;

    this.displayRezultBefore();
    this.displayRezultAfter(this.currentMonthsValue);
}

//отображение первоначальной суммы в поле результата
Calculator.prototype.displayRezultBefore = function() {
    //форматируем сумму
    this.moneyRezultBefore.innerHTML = (+this.moneyBefore.value).toLocaleString() || 0;
};

//отображение итоговой суммы
Calculator.prototype.displayRezultAfter = function(months) {
    var money = this.calculateRezultAfter(months);

    this.changeMoneyFontSize(money);
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
    //months - значение количества месяцев из слайдера
    var moneyBefore = this.moneyBefore.value;
    var moneyAfter = moneyBefore;
    var monthlyIncrease = this.rate.value / 12 / 100;

    if (!this.capitalization.checked) {
        moneyAfter = moneyBefore * (1 + monthlyIncrease * months);
    } else {
        for (var i = 0; i < months; i++) {
            moneyAfter =  moneyAfter * (1 + monthlyIncrease);
        }
    }

    return {
        moneyAft: Math.round(moneyAfter),
        moneyBef: moneyBefore
    };
};

//рассчет высоты диаграммы итоговой суммы относительно исходной
Calculator.prototype.calculateDiagramRezultHeight = function(money) {
    var percentMoneyAfter = (money.moneyAft * 100) / money.moneyBef;
    var chartBeforeHeight = this.chartBefore.offsetHeight;
    var newHeight = chartBeforeHeight + chartBeforeHeight * (percentMoneyAfter / 100 - 1);
    this.chartAfter.style.height = newHeight + 'px';
};

//проверка на ввод только числа, запрет ввода текста
Calculator.prototype.checkSymbol = function(event) {
    var symbol = +this.getChar(event);
    if (symbol >= 0 || symbol <= 9) return;
    event.preventDefault();
};

//изменение размеров шрифта сумм над диаграммами
Calculator.prototype.changeMoneyFontSize = function(money) {
    if (money.moneyAft.toString().length > 6) {
        this.setFontBigMoney();
    } else {
        this.setFontLittleMoney();
    }
};

Calculator.prototype.setFontLittleMoney = function() {
    if (this.diagram.classList.contains('diagram-big-money')) this.diagram.classList.remove('diagram-big-money');
    if (!this.diagram.classList.contains('diagram-little-money')) this.diagram.classList.add('diagram-little-money');
};

Calculator.prototype.setFontBigMoney = function() {
    if (this.diagram.classList.contains('diagram-little-money')) this.diagram.classList.remove('diagram-little-money');
    if (!this.diagram.classList.contains('diagram-big-money')) this.diagram.classList.add('diagram-big-money');
};

// вспомогательная функция для получения символа из события keypress
Calculator.prototype.getChar = function(event) {
    if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode) // IE
    }

    if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) // остальные
    }

    return null; // специальная клавиша
};

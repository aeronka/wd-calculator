function Slider(options) {
    this.sliderElem = options.sliderElem;
    //массив месяцев - вариантов сроков вклада
    this.labels = options.labels;
    this.sliderThumb = this.sliderElem.querySelector('.slider-thumb');
    //Максимальное значение шкалы слайдера, соответствующее максимальному количеству месяцев
    this.max = this.sliderElem.clientWidth;

    this.rightEdge = this.sliderElem.offsetWidth - this.sliderThumb.offsetWidth;

    //колбэки событий, чтобы не потеряли this
    this.onSliderMouseDownBinded = this.onSliderMouseDown.bind(this);
    this.onDocumentMouseMoveBinded = this.onDocumentMouseMove.bind(this);
    this.onDocumentMouseUpBinded = this.onDocumentMouseUp.bind(this);

    //отмена встроенного события перетаскивания
    this.sliderElem.ondragstart = function() {
        return false;
    };

    this.sliderElem.addEventListener('mousedown', this.onSliderMouseDownBinded);
}

Slider.prototype.onSliderMouseDown = function(event) {
    if (event.target.closest('.slider-thumb')) {
        this.startDrag(event.clientX, event.clientY);
        event.preventDefault(); // не начинать выделение элемента
    }
};

Slider.prototype.startDrag = function(startClientX, startClientY) {
    this.thumbCoords = this.sliderThumb.getBoundingClientRect();
    this.shiftX = startClientX - this.thumbCoords.left;
    this.shiftY = startClientY - this.thumbCoords.top;

    this.sliderCoords = this.sliderElem.getBoundingClientRect();

    //следим за событиями на document, поскольку при быстром движении мышь может выйти за границы элемента
    document.addEventListener('mousemove', this.onDocumentMouseMoveBinded);
    document.addEventListener('mouseup', this.onDocumentMouseUpBinded);
};

Slider.prototype.moveTo = function(clientX) {
    // вычесть координату родителя, т.к. position: relative
    var newLeft = clientX - this.shiftX - this.sliderCoords.left;

    // курсор ушёл вне слайдера
    if (newLeft < 0) {
      newLeft = 0;
    }
    if (newLeft > this.rightEdge) {
      newLeft = this.rightEdge;
    }

    this.slideEvent(newLeft);

    this.sliderThumb.style.left = newLeft + 'px';
};

Slider.prototype.onDocumentMouseMove = function(e) {
    this.moveTo(e.clientX);
};

Slider.prototype.onDocumentMouseUp = function(e) {
    this.endDrag();
};

Slider.prototype.endDrag = function() {
    //перескакивание слайдера по центру выбранного интервала
    this.sliderThumb.style.left = this.currentSliderValue + 'px';
    document.removeEventListener('mousemove', this.onDocumentMouseMoveBinded);
    document.removeEventListener('mouseup', this.onDocumentMouseUpBinded);
};

//генерация события передвижения, передача рассчитанного значения
Slider.prototype.slideEvent = function(newLeft) {
    var calcMonthValue = this.calculateUserValue(newLeft);
    var newSlideEvent = new CustomEvent("slide", {
        bubbles: true,
        detail: calcMonthValue
    });
    this.sliderElem.dispatchEvent(newSlideEvent);
};

//рассчет текущего значения слайдера без учета интервалов
Slider.prototype.calculateCurrentValue = function(newLeft) {
    return Math.round((this.max * newLeft) / this.rightEdge);
};

//рассчет выбранного значения количества месяцев с учетом интервалов
Slider.prototype.calculateUserValue = function(newLeft) {
    var currentValue = this.calculateCurrentValue(newLeft);

    //длина одного интервала между значениями
    var interval = this.max / (this.labels.length - 1);
    var monthPosition = Math.ceil(currentValue / interval - 0.5);
    //проверяем значение для начала шкалы
    if (monthPosition < 0) monthPosition = 0;
    //проверяем значение в конце шкалы
    if (monthPosition > this.labels.length - 1) monthPosition = this.labels.length - 1;

    this.calculateStickingValue(monthPosition, interval);
    
    //возвращает число - количество месяцев вклада
    return this.labels[monthPosition];
};

//рассчет значения на которое должен перескочить sliderThumb
Slider.prototype.calculateStickingValue = function(monthPosition, interval) {
    //текущее значение слайдера, куда он перескочил
    this.currentSliderValue = interval * monthPosition - this.sliderThumb.offsetWidth / 2;

    //проверка границ слайдера
    if (this.currentSliderValue < 0) {
      this.currentSliderValue = 0;
    }
    if (this.currentSliderValue > this.rightEdge) {
        this.currentSliderValue = this.rightEdge;
    }
};
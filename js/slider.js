function Slider(options) {
    this.sliderElem = options.sliderElem;
    //массив месяцев - вариантов сроков вклада
    this.labels = options.labels;
    this.sliderThumb = this.sliderElem.querySelector('.slider-thumb');
    this.max = 250;

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
    document.removeEventListener('mousemove', this.onDocumentMouseMoveBinded);
    document.removeEventListener('mouseup', this.onDocumentMouseUpBinded);
};

Slider.prototype.slideEvent = function(newLeft) {
    var calcValue = this.calculateUserValue(newLeft);
    console.log(calcValue);
    var newSlideEvent = new CustomEvent("slide", {
        bubbles: true,
        detail: calcValue
    });
    this.sliderElem.dispatchEvent(newSlideEvent);
};

Slider.prototype.calculateUserValue = function(newLeft) {
    return Math.round((this.max * newLeft)/this.rightEdge);
};

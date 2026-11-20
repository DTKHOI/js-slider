function Slidezy(selector, options = {}) {
    this._container = document.querySelector(selector);
    if (!this._container) {
        console.error(`Error: Container ${selector} not found!`);
        return;
    }

    this.opt = Object.assign({ items: 1, loop: false }, options);
    this.slides = Array.from(this._container.children);
    this.currentIndex = 0;

    this._init();
}

Slidezy.prototype._init = function () {
    this._container.classList.add("slidezy-wrapper");

    this._createTrack();
    this._createNavigation();
};

Slidezy.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.className = "slidezy-track";

    this.slides.forEach((slide) => {
        slide.classList.add("slidezy-slide");
        this.track.appendChild(slide);
    });

    this._container.appendChild(this.track);
};

Slidezy.prototype._createNavigation = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.textContent = "<";
    this.nextBtn.textContent = ">";

    this.prevBtn.className = "slidezy-prev";
    this.nextBtn.className = "slidezy-next";

    this._container.append(this.prevBtn, this.nextBtn);

    this.prevBtn.onclick = () => {
        this.moveSlide(-1);
    };

    this.nextBtn.onclick = () => {
        this.moveSlide(1);
    };
};

Slidezy.prototype.moveSlide = function (step) {
    this.currentIndex = Math.min(Math.max(this.currentIndex + step, 0), this.slides.length - 3);

    this.offset = -(this.currentIndex * (100 / 3));
    this.track.style.transform = `translateX(${this.offset}%)`;
};

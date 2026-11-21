function Slidezy(selector, options = {}) {
    this._container = document.querySelector(selector);
    if (!this._container) {
        console.error(`Error: Container ${selector} not found!`);
        return;
    }

    this.opt = Object.assign({ items: 1, loop: false, speed: 300 }, options);
    this.slides = Array.from(this._container.children);

    this.currentIndex = this.opt.loop ? this.opt.items : 0;

    this._init();
    this._updatePostion();
}

Slidezy.prototype._init = function () {
    this._container.classList.add("slidezy-wrapper");

    this._createTrack();
    this._createNavigation();
};

Slidezy.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.className = "slidezy-track";

    if (this.opt.loop) {
        const cloneHead = this.slides.slice(-this.opt.items).map((node) => node.cloneNode(true));
        const cloneTail = this.slides.slice(0, this.opt.items).map((node) => node.cloneNode(true));

        this.slides = cloneHead.concat(this.slides.concat(cloneTail));
    }

    this.slides.forEach((slide) => {
        slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
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
    if (this._isAnimation) return;
    this._isAnimation = true;

    const maxIndex = this.slides.length - this.opt.items;

    this.currentIndex = Math.min(Math.max(this.currentIndex + step, 0), maxIndex);

    setTimeout(() => {
        if (this.opt.loop) {
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.items;
            } else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.items;
            }

            this._updatePostion(true);
        }
        this._isAnimation = false;
    }, this.opt.speed);

    this._updatePostion();
};

Slidezy.prototype._updatePostion = function (instant = false) {
    this.track.style.transition = instant ? "none" : `transform ${this.opt.speed}ms`;
    this.offset = -(this.currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;
};

// Todo
// 1. Làm navigation tab
// 2. Option thay đổi nội dung bên trong nút điều hướng
// 3. Làm auto play, tự động chuyển slide khi có option autoPlay: true
// 4. Làm option quyết định lần next/prev là bao nhiêu slide.
//  Ví dụ: có 3 slides trong viewport, khi bấm next/prev sẽ chuyển sang
//  cụm 3 slides kế tiếp

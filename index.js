addListeners();


function animaster() {
    return {
        _steps: [],

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },

        addMove(duration, transform) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option(e, d, t) {
                    move(e, d, t)
                }, duration, transform
            });
            return copy;
        },
        addScale(duration, transform) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option(e, d, t) {
                    scale(e, d, t)
                }, duration, transform
            });
            console.log(this._steps);
            return copy;
        },
        addFadeIn(duration) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option(e, d) {
                    fadeIn(e, d)
                }, duration
            });
            return copy;
        },
        addFadeOut(duration) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option(e, d) {
                    fadeOut(e, d)
                }, duration
            });
            return copy;
        },
        addRotate(duration, transform) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option(e, d, t) {
                    rotate(e, d, t)
                }, duration, transform
            });
            return copy;
        },
        addDelay(duration) {
            let copy = Object.assign({}, this);
            copy._steps = this._steps.slice();
            copy._steps.push({
                option() {
                    return null
                }, duration
            });
            return copy;
        },
        play(element, cycled = false) {
            const elementInvisible = element.classList.contains('hide');
            let duration = 0;
            let cycledDuration = 0;
            let timer;
            if (cycled) {
                for (let el of this._steps) {
                    cycledDuration += el.duration;
                    setTimeout(() => el.option(element, el.duration, el.transform), duration);
                    console.log(duration);
                    duration += el.duration;
                }
                duration = 0;
                timer = setInterval(() => {
                    for (let el of this._steps) {
                        setTimeout(() => el.option(element, el.duration, el.transform), duration);
                        console.log(duration);
                        duration += el.duration;
                    }
                    duration = 0;
                }, cycledDuration)
            } else {
                for (let el of this._steps) {
                    timer = setTimeout(() => el.option(element, el.duration, el.transform), duration);
                    console.log(duration);
                    duration += el.duration;
                }
            }
            console.log(this._steps);
            return {
                stop() {
                    clearInterval(timer);
                },
                reset() {
                    clearTimeout(timer);
                    const elementAfterPlayInvisible = element.classList.contains('hide');
                    console.log(elementInvisible);
                    console.log(elementAfterPlayInvisible);
                    if (!elementAfterPlayInvisible && elementInvisible) animaster().resetFadeIn(element);
                    if (elementAfterPlayInvisible && !elementInvisible) animaster().resetFadeOut(element);
                    animaster().resetMoveAndScale(element);
                }
            }
        },
        buildHandler() {
            return (el) => this.play(el.target)
        }/*,
        move(element, duration, translation) {
            move(element, duration, translation);
        },
        fadeIn(element, duration) {
            fadeIn(element, duration);
        },
        scale(element, duration, ratio) {
            scale(element, duration, ratio);
        },
        fadeOut(element, duration) {
            fadeOut(element, duration);
        },
        moveAndHide(element, duration, translation) {
            return moveAndHide(element, duration, translation);
        },
        showAndHide(element, duration) {
            showAndHide(element, duration);
        },
        heartBeating(element, duration, ratio) {
            heartBeating(element, duration, ratio);
            let interval = setInterval(() => heartBeating(element, duration, ratio), 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            }
        }*/
    };
}

function Listener(anim, addedAnim, cycled = false) {
    let playAnim;
    document.getElementById(anim + 'Play')
        .addEventListener('click', function () {
            const block = document.getElementById(anim + 'Block');
            playAnim = addedAnim.play(block, cycled);
        });
    if (cycled) {
        document.getElementById(anim + 'Stop')
            .addEventListener('click', function () {
                if (playAnim !== undefined) playAnim.stop();
            });
    } else {
        document.getElementById(anim + 'Reset')
            .addEventListener('click', function () {
                playAnim.reset();
            });
    }
}

function addListeners() {
    Listener('fadeIn',
        animaster().addFadeIn(5000));
    Listener('move',
        animaster().addMove(5000, {x: 100, y: 10}));
    Listener('scale',
        animaster().addScale(1000, 1.25));
    Listener('fadeOut',
        animaster().addFadeOut(5000));
    Listener('moveAndHide',
        animaster().addMove(400, {x: 100, y: 20}).addFadeOut(400));
    Listener('heartBeating',
        animaster().addScale(500, 1.4).addScale(500, 1),
        true);

    let showAndHidePlay;
    let showAndHide = animaster().addFadeIn(500).addDelay(500);
    let a = showAndHide.addScale(1000, 1);
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHidePlay = showAndHide.addFadeOut(500).play(block);
        });

    const rotate = animaster()
        .addRotate(1000, 360)
        .addRotate(0, 0)
        .buildHandler();
    document.getElementById('rotateBlock').addEventListener('click', rotate);
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(null, ratio, null);
}

function fadeOut(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
}

function rotate(element, duration, rotate) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(null, null, rotate);
}

/*function moveAndHide(element, duration, translation) {
    const moveDuration = Math.floor((duration * 2) / 5);
    const hideDuration = duration - moveDuration;
    animaster().move(element, moveDuration, translation);
    return setTimeout(() => animaster().fadeOut(element, hideDuration), moveDuration);
}
function showAndHide(element, duration) {
    const showAndHideDuration = Math.floor((duration) / 3);
    const restDuration = duration - showAndHideDuration * 2;
    animaster().fadeIn(element, showAndHideDuration);
    setTimeout(null, restDuration);
    setTimeout(() => animaster().fadeOut(element, showAndHideDuration), showAndHideDuration + restDuration);
}
function heartBeating(element, duration, ratio) {
    animaster().scale(element, duration, ratio);
    setTimeout(() => animaster().scale(element, duration, 1), duration);
}*/

function getTransform(translation, ratio, rotate) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    if (rotate) {
        result.push(`rotate(${rotate}deg)`);
    }
    return result.join(' ');
}

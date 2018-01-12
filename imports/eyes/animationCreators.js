import {
    Animation,
    EasingFunction,
    QuarticEase,
    ExponentialEase,
    Vector3
} from 'babylonjs';

const BrowUpDistance = 0.10;
const HideDistance = 13.0;

export function createLookDown(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeX(0, -1, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(0, -0.1, 30),
        target: rightBrow
    });
    animations.push({ ...rotateZ(0, 0.1, 30),
        target: leftBrow
    });

    return animations;
}

export function createReturnFromDown(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeX(-1, 0, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(-0.1, 0, 30),
        target: rightBrow
    });
    animations.push({ ...rotateZ(0.1, 0, 30),
        target: leftBrow
    });

    return animations;
}

export function createLookUp(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeX(0, 1, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...moveY(rightBrow.position.y, BrowUpDistance, 30),
        target: rightBrow
    });
    animations.push({ ...moveY(leftBrow.position.y, BrowUpDistance, 30),
        target: leftBrow
    });

    return animations;
}

export function createReturnFromUp(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeX(1, 0, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...moveY(rightBrow.position.y + BrowUpDistance, -BrowUpDistance, 30),
        target: rightBrow
    });
    animations.push({ ...moveY(leftBrow.position.y + BrowUpDistance, -BrowUpDistance, 30),
        target: leftBrow
    });

    return animations;
}

export function createLookRight(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeY(0, 0.75, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(0, 0.1, 30),
        target: rightBrow
    });
    animations.push({ ...moveY(rightBrow.position.y, BrowUpDistance, 30),
        target: rightBrow
    });

    return animations;
}

export function createReturnFromRight(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeY(0.75, 0, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(0.1, 0, 30),
        target: rightBrow
    });
    animations.push({ ...moveY(rightBrow.position.y + BrowUpDistance, -BrowUpDistance, 30),
        target: rightBrow
    });

    return animations;
}

export function createLookLeft(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeY(0, -0.75, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(0, -0.1, 30),
        target: leftBrow
    });
    animations.push({ ...moveY(leftBrow.position.y, BrowUpDistance, 30),
        target: leftBrow
    });

    return animations;
}

export function createReturnFromLeft(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const eyeRightAnimation = rotateEyeY(-0.75, 0, 30);
    animations.push({ ...eyeRightAnimation,
        target: rightEye
    });
    animations.push({ ...eyeRightAnimation,
        target: leftEye
    });
    animations.push({ ...rotateZ(-0.1, 0, 30),
        target: leftBrow
    });
    animations.push({ ...moveY(leftBrow.position.y + BrowUpDistance, -BrowUpDistance, 30),
        target: leftBrow
    });

    return animations;
}

export function createRollEyes(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    const rollEyeAnimation = rollEyes();
    animations.push({ ...rollEyeAnimation,
        target: rightEye
    });
    animations.push({ ...rollEyeAnimation,
        target: leftEye
    });

    const raiseLowerBrowsAnimation = raiseLowerBrows(rightBrow.position, rollEyeAnimation.end);
    animations.push({ ...raiseLowerBrowsAnimation,
        target: rightBrow
    });
    animations.push({ ...raiseLowerBrowsAnimation,
        target: leftBrow
    });

    animations.push({ ...rotateZRightAndReturn(rollEyeAnimation.end),
        target: rightBrow
    });
    animations.push({ ...rotateZLeftAndReturn(rollEyeAnimation.end),
        target: leftBrow
    });

    return animations;
}

export function createSurprised(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    animations.push({ ...scale(1, 1.1, 10),
        target: rightEye
    });
    animations.push({ ...scale(1, 1.1, 10),
        target: leftEye
    });
    animations.push({ ...rotateZ(0, 0.1, 10),
        target: rightBrow
    });
    animations.push({ ...rotateZ(0, -0.1, 10),
        target: leftBrow
    });
    animations.push({ ...moveY(rightBrow.position.y, 0.25, 10),
        target: rightBrow
    });
    animations.push({ ...moveY(leftBrow.position.y, 0.25, 10),
        target: leftBrow
    });

    return animations;
}

export function createReturnFromSurprised(rightEye, leftEye, rightBrow, leftBrow) {
    const animations = [];

    animations.push({ ...scale(1.1, 1, 10),
        target: rightEye
    });
    animations.push({ ...scale(1.1, 1, 10),
        target: leftEye
    });
    animations.push({ ...rotateZ(0.1, 0, 10),
        target: rightBrow
    });
    animations.push({ ...rotateZ(-0.1, 0, 10),
        target: leftBrow
    });
    animations.push({ ...moveY(rightBrow.position.y + 0.25, -0.25, 10),
        target: rightBrow
    });
    animations.push({ ...moveY(leftBrow.position.y + 0.25, -0.25, 10),
        target: leftBrow
    });

    return animations;
}

export function createHideFaceLeft(camera) {
    const animations = [];

    animations.push({ ...moveX('hideFaceLeft', camera.position.x, -HideDistance, 5),
        target: camera
    });

    return animations;
}

export function createUnhideFaceLeft(camera) {
    const animations = [];

    animations.push({ ...moveX('unHideFaceLeft', camera.position.x - HideDistance, HideDistance, 120),
        target: camera
    });

    return animations;
}

export function createHideFaceRight(camera) {
    const animations = [];

    animations.push({ ...moveX('hideFaceRight', camera.position.x, HideDistance, 5),
        target: camera
    });

    return animations;
}

export function createUnhideFaceRight(camera) {
    const animations = [];

    animations.push({ ...moveX('unHideFaceRight', camera.position.x + HideDistance, -HideDistance, 120),
        target: camera
    });

    return animations;
}

export function createShakeYes(scene) {
    const animations = [];

    const animation = new Animation('shakeYes', 'rotation.x', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = 80;
    const amt = 0.1;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: 10,
        value: amt
    });
    keys.push({
        frame: 20,
        value: 0
    });
    keys.push({
        frame: 30,
        value: -amt
    });
    keys.push({
        frame: 40,
        value: 0
    });
    keys.push({
        frame: 50,
        value: amt
    });
    keys.push({
        frame: 60,
        value: 0
    });
    keys.push({
        frame: 70,
        value: -amt
    });
    keys.push({
        frame: 80,
        value: 0
    });
    animation.setKeys(keys);

    animations.push({
        animation,
        start,
        end,
        target: scene
    });

    return animations;
}

export function createShakeNo(scene) {
    const animations = [];

    const animation = new Animation('shakeNo', 'rotation.y', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = 80;
    const amt = 0.1;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: 10,
        value: amt
    });
    keys.push({
        frame: 20,
        value: 0
    });
    keys.push({
        frame: 30,
        value: -amt
    });
    keys.push({
        frame: 40,
        value: 0
    });
    keys.push({
        frame: 50,
        value: amt
    });
    keys.push({
        frame: 60,
        value: 0
    });
    keys.push({
        frame: 70,
        value: -amt
    });
    keys.push({
        frame: 80,
        value: 0
    });
    animation.setKeys(keys);

    animations.push({
        animation,
        start,
        end,
        target: scene
    });

    return animations;
}


function rotateEyeY(startValue, endValue, lastFrame) {
    const animation = new Animation('lookRight', 'rotation.y', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: end,
        value: endValue
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rotateEyeX(startValue, endValue, lastFrame) {
    const animation = new Animation('lookRight', 'rotation.x', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: end,
        value: endValue
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rollEyes() {
    const animation = new Animation('rollEyes', 'rotation', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_RELATIVE);
    const start = 0;
    let end = start;

    const keys = [];
    keys.push({
        frame: start,
        value: new Vector3(0, 0, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(0.25, 0.5, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(1, 0.75, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(1, 0, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(1, -0.5, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(0.25, -0.75, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(0, -0.75, 0)
    });
    keys.push({
        frame: end += 5,
        value: new Vector3(-0.25, -0.75, 0)
    });
    keys.push({
        frame: end += 10,
        value: new Vector3(0, 0, 0)
    });
    animation.setKeys(keys);

    const easingFunction = new ExponentialEase(0.25);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function raiseLowerBrows(startPos, lastFrame) {
    const animation = new Animation('raiseLowerBrows', 'position.y', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_RELATIVE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startPos.y
    });
    keys.push({
        frame: Math.ceil(end / 2),
        value: startPos.y + BrowUpDistance
    });
    keys.push({
        frame: end,
        value: startPos.y
    });
    animation.setKeys(keys);

    return {
        animation,
        start,
        end
    };
}

function rotateZRightAndReturn(lastFrame) {
    const animation = new Animation('rotateZRightAndReturn', 'rotation.z', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: Math.ceil(end / 2),
        value: 0.1
    });
    keys.push({
        frame: end,
        value: 0
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rotateYRightAndReturn(amt, lastFrame) {
    const animation = new Animation('rotateYRightAndReturn', 'rotation.y', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: Math.ceil(end / 2),
        value: amt
    });
    keys.push({
        frame: end,
        value: 0
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rotateXRightAndReturn(amt, lastFrame) {
    const animation = new Animation('rotateYRightAndReturn', 'rotation.x', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: Math.ceil(end / 2),
        value: amt
    });
    keys.push({
        frame: end,
        value: 0
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rotateZLeftAndReturn(lastFrame) {
    const animation = new Animation('rotateZLeftAndReturn', 'rotation.z', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: 0
    });
    keys.push({
        frame: Math.ceil(end / 2),
        value: -0.1
    });
    keys.push({
        frame: end,
        value: 0
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function rotateZ(startValue, endValue, lastFrame) {
    const animation = new Animation('rotateZ', 'rotation.z', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: end,
        value: endValue
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function moveY(startValue, distance, lastFrame) {
    const animation = new Animation('moveY', 'position.y', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: end,
        value: startValue + distance
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function moveX(name, startValue, distance, lastFrame) {
    const animation = new Animation(name, 'position.x', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const start = 0;
    const end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: end,
        value: startValue + distance
    });
    animation.setKeys(keys);

    const easingFunction = new QuarticEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function scale(startValue, endValue, lastFrame) {
    const animation = new Animation('scale', 'scaling', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_RELATIVE);
    const start = 0;
    let end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: new Vector3(startValue, startValue, startValue)
    });
    keys.push({
        frame: lastFrame,
        value: new Vector3(endValue, endValue, endValue)
    });
    animation.setKeys(keys);

    const easingFunction = new ExponentialEase(0.25);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}

function move(name, startValue, endValue, lastFrame) {
    const animation = new Animation(name, 'position', 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_RELATIVE);
    const start = 0;
    let end = lastFrame;

    const keys = [];
    keys.push({
        frame: start,
        value: startValue
    });
    keys.push({
        frame: lastFrame,
        value: endValue
    });
    animation.setKeys(keys);

    const easingFunction = new ExponentialEase(0.25);
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animation.setEasingFunction(easingFunction);

    return {
        animation,
        start,
        end
    };
}
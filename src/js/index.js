import CanvasControls from './controls';
import OpenTypeFonts, {getGoogleFont} from './fonts';

import '../less/main.less';

const CANVAS_WRAPPER_SELECTOR = "test_canvas";

const FONT_FAMILY = "Andika";
const FONT_SIZE = 32;

fabric.util.object.extend(fabric.Canvas.prototype, {
    __userClipPath: null,
});

const canvas = new fabric.Canvas(CANVAS_WRAPPER_SELECTOR);
const canvasControls = new CanvasControls(canvas);

canvas.__userClipPath = new fabric.Rect({
    absolutePositioned: true,
    height: canvas.height * 3 / 4,
    left: canvas.width / 2,
    originX: 'center',
    originY: 'center',
    top: canvas.height / 2,
    width: canvas.width * 3 / 4,
});

const initFabricFixes = () => {
    fabric.util.object.extend(fabric.Text.prototype, {
        _fontSizeMult: 1,
        _getTextHeight: function() {
            return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine();
        },
        _getHeightOfLine: function() {
            return this._getHeightOfSingleLine() * this.lineHeight;
        },
        _getHeightOfSingleLine: function() {
            return this.fontSize * this._fontSizeMult;
        },
    });
};

const addTestImage = () => {
    const imgUrl = '/images/front.jpg';
    const image = new Image();

    image.crossOrigin = 'Anonymous';
    image.onload = () => {
        const fabricImage = new fabric.Image(image);

        fabricImage.scaleToWidth(canvas.getWidth());
        canvas.add(fabricImage);
    };
    image.src = imgUrl;
};

(async () => {
    const font = await getGoogleFont(FONT_FAMILY);
    await OpenTypeFonts.loadFont(font);

    canvasControls.init();
    initFabricFixes();

    canvas.on('object:added', (e) => {
        canvasControls.addSelectionListeners(e.target);
    });

    document.addEventListener('keypress', (e) => {
        const obj = canvas.getActiveObject();
        const removeObj = obj && e.code === 'Delete';

        removeObj && canvas.remove(obj);
    });

    if (canvasControls.pathFromOpenTypeButton) {
        canvasControls.pathFromOpenTypeButton.onclick = () => {
            const obj = canvas.getActiveObject();
            const path = OpenTypeFonts.getTextPath(obj);
            const fabricPath = new fabric.Path(path.toPathData(6));

            fabricPath.set({
                angle: obj.angle,
                fill: '#000',
                originX: obj.originX,
                originY: obj.originY,
                selectable: obj.selectable,
            });

            // fabricPath.set({
            //     width: obj.width,
            //     height: obj.height,
            // });

            fabricPath.set({
                left: obj.left,
                top: obj.top,
            });

            // fabricPath.set({
            //     originalScale: obj.originalScale,
            //     scaleX: obj.scaleX,
            //     scaleY: obj.scaleY,
            // });

            canvas.add(fabricPath);
            canvas.renderAll();
        }
    }

    const text1 = new fabric.Text("text\n\nsdf\n  sda", {
        fontSize: FONT_SIZE,
        fill: "#00f",
        lineHeight: 1,
        fontFamily: FONT_FAMILY,
        fontWeight: "normal",
        left: 256,
        originX: "center",
        originY: "center",
        // textBackgroundColor: '#ffff00',
        top: 256,
    });
    const text2 = fabric.util.object.clone(text1);

    text2.set({
        fill: "#f00",
        fontSize: text1.fontSize * 2
    });

    canvas.add(text1);
    canvas.add(text2);


    canvas.on("selection:cleared", () => {
        canvasControls.deactivateControls();
    });
})();

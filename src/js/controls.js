import OpenTypeFonts from "./fonts";

const ObjInfo = class {
    constructor() {
        this.detailsContainer = document.getElementById("objDetails");
    }

    showObjInfo(obj) {
        const str = JSON.stringify(obj, null, 4);
        const formattedStr = this.formatText(str);

        this.detailsContainer.innerText = formattedStr;
    };

    formatText(JSONString) {
        const propValRegex = /".+":\s.+/gm;
        const quoteRegex = /"/g;
        const objData = {};
        let m;

        while ((m = propValRegex.exec(JSONString)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === propValRegex.lastIndex) {
                propValRegex.lastIndex++;
            }

            m.forEach((match) => {
                const d = match.split(':');

                objData[d[0].replace(quoteRegex, '')] = {
                    value: d[1].replace(/\s+/, ''),
                    type: quoteRegex.test(d[1]) ? 'text' : 'specific',
                };
            });
        }

        const str = Object.keys(objData).sort().map((key) => `    "${key}": ${objData[key].value}`);

        return `
{\n${str.join('\n')}\n}`
    }
};

export default class {
    constructor(canvasEl = null) {
        this.canvasEl = canvasEl;

        this.controls = document.querySelectorAll('[data-control]');
        this.controlInputs = document.querySelectorAll('[data-control-input]');
        this.controlButtons = document.querySelectorAll('[data-control-button]');

        this.pathFromOpenTypeButton = document.getElementById('pathFromOpenTypeButton');

        this.setClipPath = document.getElementById('setClipPath');
        this.unSetClipPath = document.getElementById('unSetClipPath');
        this.deleteButton = document.getElementById('deleteButton');

        this.objFromUrlButton = document.getElementById('objFromUrlButton');

        this.infoProvider = new ObjInfo();
    }

    init() {
        this.controlButtons.length && this.controlButtons.forEach((controlButton) => {
            controlButton.onclick = () => {
                const obj = this.canvasEl.getActiveObject();
                const relatedControlInput = controlButton.parentElement.querySelector('[data-control-input]');

                if (!relatedControlInput) {
                    return void(0);
                }

                let newValue = {};

                newValue[relatedControlInput.dataset.controlInput] = relatedControlInput.value;
                obj.set(newValue);

                this.canvasEl.renderAll();
            }
        });

        this.controlInputs && this.controlInputs.forEach((controlInput) => {
            controlInput.oninput = (e) => {
                const obj = this.canvasEl.getActiveObject();
                let newValue = {};

                newValue[controlInput.dataset.controlInput] = controlInput.value;
                obj.set(newValue);

                this.canvasEl.renderAll();
            }
        });

        if (this.deleteButton) {
            this.deleteButton.onclick = () => {
                const obj = this.canvasEl.getActiveObject();

                obj.remove();
                this.canvasEl.renderAll();
            }
        }

        if (this.objFromUrlButton) {
            this.objFromUrlButton.onclick = () => {
                const fullprintUrlRegex = /assets\/images\/fullprint/;
                const url = objFromUrlButton.parentElement.querySelector('input').value;

                url && fabric.loadSVGFromURL(url , (objects, options) => {
                    console.log('objects from url: ', objects);
                    const allowedObjects = objects.filter((object) => {
                        return [
                            object.hasOwnProperty('text') && object.text.length > 0,
                            object.hasOwnProperty('path') && object.path.length > 0,
                            object.hasOwnProperty('_element') && !fullprintUrlRegex.test(object.getSrc()),
                        ].some(Boolean);
                    });

                    allowedObjects.forEach((object) => {
                        this.canvasEl.add(object);
                        this.canvasEl.renderAll();
                    });

                    console.log('allowedObjects: ', allowedObjects);
                });

            }
        }

        if (this.setClipPath) {
            setClipPath.onclick = () => {
                if (!this.canvasEl.__userClipPath) {
                    return void(0);
                }

                const obj = this.canvasEl.getActiveObject();

                obj.clipPath = this.canvasEl.__userClipPath;
                this.canvasEl.renderAll();
            }
        }

        if (this.unSetClipPath) {
            unSetClipPath.onclick = () => {
                const obj = this.canvasEl.getActiveObject();

                if (obj.clipPath) {
                    obj.clipPath = null;
                    this.canvasEl.renderAll();
                }
            }
        }
    }

    activateControls() {
        this.controls.forEach((control) => {
            control.removeAttribute("disabled");
        });
    };

    deactivateControls() {
        this.controls.forEach((control) => {
            control.setAttribute("disabled", true);
        });
    };

    setControlsValues() {
        const obj = this.canvasEl.getActiveObject();

        this.controlInputs.forEach((controlInput) => {
            const newVal = obj[controlInput.dataset.controlInput];

            if (newVal) {
                controlInput.value = newVal;
            } else {
                controlInput.value = '';
                controlInput.setAttribute('disabled', true);
            }

        });
    };

    addSelectionListeners(obj) {
        obj.on('selected', () => {
            console.log('obj: ', obj);
            this.activateControls();
            this.setControlsValues();
            this.infoProvider.showObjInfo(obj);
        });

        obj.on('modified', () => {
            this.setControlsValues();
            this.infoProvider.showObjInfo(obj);
        });
    }

    static scaleUpX2(obj) {
        obj.set({
            scaleX: obj.scaleX * 2,
            scaleY: obj.scaleY * 2
        });
    };

    static scaleDownX2(obj) {
        obj.set({
            scaleX: obj.scaleX / 2,
            scaleY: obj.scaleY / 2
        });
    };
}

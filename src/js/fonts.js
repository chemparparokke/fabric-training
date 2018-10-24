const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY;

export const fonts = [];
export const getGoogleFont = async (fontName = '') => {
    return new Promise((resolve) => {
        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}`)
            .then((res) => res.json())
            .then((fonts) => {
                if (fonts.error && fonts.error.code === 403) {
                    console.error(
                        `Can\'t fetch google fonts via developers api:\n${
                            fonts.error.message
                            }\n\nDefault fonts will be used`
                    );

                    resolve({error: true});
                }

                const [font] = fonts.items.filter(font => {
                    return font.family === fontName;
                });

                resolve(font);
            })
            .catch((e) => {
                console.error(`Can\'t fetch google fonts via developers api.\n\nDefault fonts will be used.`, e);
                resolve({error: true});
            });
    });
};

export default new class {
    loadFont(gFont) {
        return new Promise((resolve, reject) => {
            let fontLink = gFont.files.regular || gFont.files[gFont.variants[0]];

            fontLink = fontLink.replace(/^http:/, "https:/");

            opentype.Font.prototype.getMultiLinePath = function (text, x, y, fontSize, options = {}) {
                const fullPath = new opentype.Path();
                const regex = /\r?\n/gm;

                const fontSizeFraction = options.fontSizeFraction || 0;
                const heightOfLine = options.heightOfLine || 0;
                const lineHeight = options.lineHeight || 1;

                const multiLineText = regex.test(text);
                const textLines = multiLineText ? text.split(regex) : [text];
                const maxHeight = heightOfLine / lineHeight;

                let lineHeights = 0;

                y -= fontSize * fontSizeFraction;

                for (const textLine of textLines) {
                    const pathPart = this.getPath(textLine, x, y + lineHeights + maxHeight, fontSize);

                    fullPath.extend(pathPart);
                    lineHeights += heightOfLine;
                }

                return fullPath;
            };

            opentype.load(fontLink, (err, fontData) => {
                if (err) {
                    return reject(err);
                }

                const hasIncorrectLayoutTables =
                    typeof fontData.tables.gsub !== "undefined" &&
                    typeof fontData.tables.gsub.scripts === "undefined";

                if (!hasIncorrectLayoutTables) {
                    fontData.fontName = gFont.family;
                    fontData.fontShortName = gFont.family.replace(/\s/g, "");

                    fonts[`${gFont.family.replace(/\s/g, "")}`] = fontData;
                }

                CanvasRenderingContext2D.prototype.getFontSize = function () {
                    // CanvasRenderingContext2D.font looks like `68px AstaSansLightA1`
                    return 1 * this.font.match(/\d+/)[0];
                };

                CanvasRenderingContext2D.prototype.getFontFamily = function () {
                    return this.font.split(" ")[1];
                };

                CanvasRenderingContext2D.prototype.measureText = function (text) {
                    let width = 0;
                    const font = fonts[this.getFontFamily()];

                    if (!font) {
                        console.error("Cannot find font", this.getFontFamily(), fonts);
                        return;
                    }

                    font.forEachGlyph(text + " ", 0, 0, this.getFontSize(), {}, (glyph, x, y) => {
                            width = x;
                        }
                    );

                    return {
                        width
                    };
                };

                CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
                    const width = this.measureText(text).width;
                    const offsetFactor = {
                        start: 0,
                        left: 0,
                        center: 0.5,
                        right: 1
                    };
                    const font = fonts[this.getFontFamily()];
                    const path = font.getPath(
                        text + " ",
                        x - width * offsetFactor[this.textAlign],
                        y,
                        this.getFontSize()
                    );

                    path.fill = this.fillStyle;
                    path.draw(this);
                };

                resolve();
            });
        })
    }

    getTextPath(textObj) {
        let openTypeFont;

        try {
            openTypeFont = fonts[textObj.fontFamily];
        } catch (e) {
            console.warn(`OpenType instance of ${textObj.fontFamily} font wasn't found.`);
            return void(0);
        }

        if (!openTypeFont) {
            return void(0);
        }

        const textParams = {
            fontSizeFraction: textObj._fontSizeFraction,
            heightOfLine: textObj.getHeightOfLine(0) * textObj.scaleX,
            lineHeight: textObj.lineHeight,
        };

        return openTypeFont.getMultiLinePath(textObj.text, textObj.left, textObj.top, textObj.fontSize * textObj.scaleX, textParams);
    }
}

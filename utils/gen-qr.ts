import QRCode from "@/utils/qr-js/QRCode";
import ErrorCorrectLevel from "@/utils/qr-js/ErrorCorrectLevel";

const bytesToBinaryString = (bytes) =>
    bytes.map((b) => String.fromCharCode(b & 0xff)).join("");

const encodeStringToUtf8Bytes = (input) =>
    Array.from(new TextEncoder().encode(input));

export const getQRCodeSvg = ({bgColor = "#FFFFFF", fgColor = "#000000", level = "L", size = 256, value = ''}) => {
    const qrcode = new QRCode(-1, ErrorCorrectLevel[level]);
    const utf8Bytes = encodeStringToUtf8Bytes(value);
    const binaryString = bytesToBinaryString(utf8Bytes);
    qrcode.addData(binaryString, "Byte");
    qrcode.make();
    const cells = qrcode.modules;
    const cellSize = size / cells.length;
    const paths = cells.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
            cell ?
                `<rect 
                    x="${cellIndex * cellSize}"
                    y="${rowIndex * cellSize}" 
                    width="${cellSize}"
                    height="${cellSize}"
                    fill="black"
                    />`
                : ""
        ).join("")
    ).join("");

    return `<svg width="${size}" height="${size}">
            <rect width="100%" height="100%" fill="white" />
            ${paths}
        </svg>`;
}

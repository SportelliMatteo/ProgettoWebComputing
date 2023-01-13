const MAX_WIDTH = 180;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.7;

export default function scaleImage(file, callback, onError) {
  const blobURL = URL.createObjectURL(file);
  const img = new Image();
  img.src = blobURL;

  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    onError();
  };

  img.onload = function () {
    URL.revokeObjectURL(this.src);
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
    const canvas = document.createElement("canvas");

    canvas.width = newWidth;
    canvas.height = newHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    canvas.toBlob(
      (blob) => {
        toBase64(blob, callback);
      },

      MIME_TYPE,
      QUALITY
    );
  };
};

function toBase64(blob, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;                
        callback(base64data);
    }
}

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}
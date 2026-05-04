import createMulter from "../configs/produto.multer.js";

const uploadImage = createMulter({
    folder: 'image',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    fileSize: 10 * 1024 * 1024 // 10 MB

}).single('image');

export default uploadImage;
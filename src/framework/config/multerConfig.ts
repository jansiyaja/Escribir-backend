import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(), 
});



export const uploadProfileImage = upload.single('profileImage');
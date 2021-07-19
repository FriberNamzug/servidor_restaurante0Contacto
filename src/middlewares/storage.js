import multer from 'multer'

/* 
https://github.com/academind/node-restful-api-tutorial/blob/09-image-upload/api/routes/products.js
Me ayude de este repositorio para crear esto c:
*/

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/imgPerfil')
    },

    filename: function (req, file, cb) {
  
      cb(null, `${file.fieldname}-${Date.now()}.jpeg`)
    }
  })
 
 
 
  const storageProducto = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload/imgProducto')
    },

    filename: function (req, file, cb) {
  
      cb(null, `${file.fieldname}-${Date.now()}.jpeg`)
    }
  })

  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  



 export const upload = multer({
    storage: storage,
/*     limits: {
      fileSize: 1024 * 1024 * 5
    },
    */
    fileFilter: fileFilter 
  });

 export const uploadProducto = multer({
  storage: storageProducto,
  fileFilter: fileFilter 

});




   
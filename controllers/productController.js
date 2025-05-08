// import { v2 as cloudinary } from "cloudinary";
// import productModel from "../models/productModel.js"

// const addProduct = async (req,res) => {
//     try {
//         const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
//         const image1 = req.files.image1 && req.files.image1[0]
//         const image2 = req.files.image2 && req.files.image2[0]
//         const image3 = req.files.image3 && req.files.image3[0]
//         const image4 = req.files.image4 && req.files.image4[0]

//         const images = [image1,image2,image3,image4].filter((item)=> item !== undefined)

//         let imagesUrl = await Promise.all(
//             images.map(async (item) => {
//                 let result = await cloudinary.uploader.upload(item.path,{resource_type: 'image'});
//                 return result.secure_url;
//             })
//         )
//         const productData = {
//             name,
//             description,
//             category,
//             subCategory,
//             price : Number(price),
//             sizes : JSON.parse(sizes),
//             bestseller : bestseller === "true" ? true : false,
//             image: imagesUrl,
//             date : Date.now()
//         }

//         console.log(productData);
//         const product = new productModel(productData);
//         await product.save();

//         res.json({success: true, message:"Product added"});
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message});
//     }
// }

// const listProduct = async (req,res) => {
//     try {
//         const products = await productModel.find({});
//         res.json({success: true, products})
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message});
//     }
// }

// const removeProduct = async (req,res) => {
//     try {
//         await productModel.findByIdAndDelete(req.body.id);
//         res.json({success:true, message:"product removed"});
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message});
//     }
// }

// const singleProduct = async (req,res) => {
//     try {
//         const { productId } = req.body;
//         const product = await productModel.findById(productId);
//         res.json({success: true,product});
//     } catch (error) {
//         console.log(error);
//         res.json({success: false, message: error.message});
//     }

// }

// export {addProduct, listProduct, removeProduct, singleProduct} 

import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
    try {
        const { name, about, description, price, category, subCategory, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            about,
            description,
            category,
            subCategory,
            price: Number(price),
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            image: imagesUrl,
            date: Date.now()
        };

        console.log(productData);
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const updateProduct = async (req, res) => {
    try {
        const { id, name, category, price } = req.body;

        const updatedData = {
            name,
            category,
            price: Number(price),
        };

        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct };

import {Schema,model} from 'mongoose'; 

const productSchema = new Schema({
    name: {type:String, required: true},
    price: {type:Number, required: true},
    image: {type:String, required: true},
    description: {type:String, required: true},
    user_id: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps:true})

const Product = model('Product', productSchema);
export default Product
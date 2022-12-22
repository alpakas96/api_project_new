import mongoose from 'mongoose'

// const storyboardSchema = new mongoose.Schema({
//     _id: {$oid:String}, 
//     data: {$binary:
//             base64:String    }
// })

export default mongoose.model('Storyboard', storyboardSchema)
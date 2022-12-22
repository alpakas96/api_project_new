import mongoose from 'mongoose'

const storyboardSchema = new mongoose.Schema({

    _id: String, 
    data: [{URL: String}]

})

export default mongoose.model('Storyboard', storyboardSchema)
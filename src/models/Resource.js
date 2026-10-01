const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['video', 'pdf', 'link', 'text'],
            required: true,
        },
        url: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            required: true,
            min: 1,
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
    },
    {
        timestamps: true
    }
);
const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
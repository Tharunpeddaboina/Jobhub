
const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    companyName: { 
        type: String, 
        required: true 
    },
    website: { 
        type: String // Optional website link
    },
    companyDescription: { 
        type: String // 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter;

// jobVacancy.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobVacancySchema = new Schema({
    jobId: { type: Number, required: true },
    employerId: { type: Number, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobRequirements: [{ type: String, required: true }],
    salaryRange: { type: String, required: true },
    location: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    completedByJobSeekerId: { type: Number, default: null }
});

module.exports = mongoose.model('JobVacancy', jobVacancySchema);

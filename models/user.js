import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Общая схема для всех пользователей
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    about: { type: String, required: true },
    userType: { type: String, required: true, enum: ['Employer', 'JobSeeker'] },
    age: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    registrationDate: { type: Date, default: Date.now },
    socialLinks: [{
        platformName: String,
        url: String
    }],
    password: { type: String, required: true }
}, { discriminatorKey: 'userType', collection: 'users' });

// Модель для работодателя
const employerSchema = new Schema({
    fullName: { type: String, required: true },
    logoURL: { type: String }
});

// Модель для специалиста
const jobSeekerSchema = new Schema({
    fullName: { type: String, required: true },
    experienceStatus: { type: String, required: true },
    resumeURL: { type: String, required: true },
    jobSeekerSkills: [{
        skillName: String,
        durationOfSkill: String
    }],
    jobSeekerWorkExperiences: [{
        companyName: String,
        isCurrentCompany: Boolean,
        profile: String,
        startDate: String,
        endDate: String,
        jobDescription: String
    }],
    portfolioURL: { type: String },
    expectedSalary: { type: String },
    availability: { type: String },
    education: [{
        institutionName: String,
        degree: String,
        fieldOfStudy: String,
        startDate: String,
        endDate: String
    }]
});

const User = mongoose.model('User', userSchema);
const Employer = User.discriminator('Employer', employerSchema);
const JobSeeker = User.discriminator('JobSeeker', jobSeekerSchema);

export {
    User,
    Employer,
    JobSeeker
};

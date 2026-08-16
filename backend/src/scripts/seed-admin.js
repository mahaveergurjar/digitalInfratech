require('dotenv').config();

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { auth } = require('../config/env');
const User = require('../models/user.model');

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function generateStrongPassword() {
  return crypto.randomBytes(18).toString('base64url');
}

async function main() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || 'admin@harghar.local');
  const name = String(process.env.ADMIN_NAME || 'Admin').trim();
  const plainPassword = String(process.env.ADMIN_PASSWORD || '').trim() || generateStrongPassword();
  const now = new Date();

  await connectDB();

  const hashedPassword = await bcrypt.hash(plainPassword, auth.bcryptRounds);

  const admin = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        email,
        phone: String(process.env.ADMIN_PHONE || '').trim(),
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        emailVerified: true,
        emailVerifiedAt: now,
        lastLoginAt: null,
        authVersion: 0,
        partner: {
          applicationStatus: 'not_applied',
          companyName: '',
          city: '',
          serviceCategories: [],
          serviceAreas: [],
          bio: '',
          experienceYears: 0,
          maxConcurrentJobs: 3,
          applicationNote: '',
          rejectionReason: '',
          reviewedAt: null,
          reviewedBy: null,
          approvedAt: null,
          suspendedAt: null,
          lastAssignmentAt: null,
          lastCompletionAt: null,
          activeJobs: 0,
          completedJobs: 0,
          cancelledJobs: 0,
          onTimeRate: 0,
          efficiencyScore: 0,
          ratingAverage: 0,
          ratingCount: 0
        }
      }
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  console.log(JSON.stringify({
    success: true,
    message: 'Admin account ready',
    email: admin.email,
    password: process.env.ADMIN_PASSWORD ? 'Provided via ADMIN_PASSWORD' : plainPassword,
    note: 'Change this password after first login.'
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Admin seed failed:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

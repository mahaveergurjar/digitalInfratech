require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { auth } = require('../config/env');
const User = require('../models/user.model');

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function normalizeName(name = '', fallback = 'User') {
  const value = String(name).trim();
  return value || fallback;
}

async function upsertUser({ email, password, name, role }) {
  const now = new Date();
  const hashedPassword = await bcrypt.hash(password, auth.bcryptRounds);

  return User.findOneAndUpdate(
    { email: normalizeEmail(email) },
    {
      $set: {
        name: normalizeName(name, role === 'admin' ? 'Admin' : 'Customer'),
        email: normalizeEmail(email),
        phone: '',
        password: hashedPassword,
        role,
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
}

async function main() {
  await connectDB();

  const users = await Promise.all([
    upsertUser({
      email: 'admin@digitalinfratech.in',
      password: 'a$dfnl@!k@15#2',
      name: 'Admin',
      role: 'admin'
    }),
    upsertUser({
      email: 'mkv9336@gmail.com',
      password: 'user@123',
      name: 'Mkv9336',
      role: 'customer'
    })
  ]);

  console.log(JSON.stringify({
    success: true,
    message: 'Login users saved',
    users: users.map((user) => ({
      id: String(user._id),
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified
    }))
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Seed login users failed:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

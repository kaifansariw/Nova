import mongoose from 'mongoose';

const projectMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [projectMemberSchema],
    coverImageUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'archived', 'completed'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const Project = mongoose.model('Project', projectSchema);

import mongoose, {Schema, Types} from 'mongoose';
import User from './User';
import {TaskFields} from '../types';

const TaskSchema = new mongoose.Schema<TaskFields>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist',
    }
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['new', 'in_progress', 'complete'],
    default: 'new',
  }
});
const Task = mongoose.model('Task', TaskSchema);
export default Task;